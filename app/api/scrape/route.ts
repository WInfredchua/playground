import Anthropic from "@anthropic-ai/sdk";
import { ApifyClient } from "apify-client";
import { NextRequest } from "next/server";
import { PropertyDetails, PropertyType, Tone } from "../../types";

export const runtime = "nodejs";

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const apify = new ApifyClient({ token: process.env.APIFY_API_TOKEN });

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || !/^https?:\/\/.+/.test(url)) {
      return Response.json({ error: "A valid URL is required." }, { status: 400 });
    }

    // Step 1: Scrape the listing page via Apify Cloud
    const run = await apify.actor("apify/website-content-crawler").call(
      {
        startUrls: [{ url }],
        maxCrawlPages: 1,
        crawlerType: "cheerio",
        readableTextCharThreshold: 100,
      },
      { waitSecs: 90 }
    );

    const { items } = await apify.dataset(run.defaultDatasetId).listItems();

    if (!items.length || !items[0].text) {
      return Response.json({ error: "Could not extract content from that URL." }, { status: 422 });
    }

    const pageText = String(items[0].text).slice(0, 12000);

    // Step 2: Claude extracts structured property details from scraped text
    const extraction = await claude.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: `You are a property data extractor. Extract structured property listing details from raw webpage text.
Always respond with valid JSON matching the schema exactly. Use null for missing fields.`,
      messages: [
        {
          role: "user",
          content: `Extract property details from this listing page text and return a JSON object.

Schema:
{
  "propertyType": one of: apartment|house|condo|townhouse|villa|studio|penthouse|land|commercial|shophouse,
  "listingType": "sale" | "rent",
  "title": string | null,
  "location": string | null,
  "price": string | null,
  "currency": string | null,
  "bedrooms": string | null,
  "bathrooms": string | null,
  "area": string | null,
  "areaUnit": "sqft" | "sqm" | null,
  "features": string[],
  "highlights": string | null,
  "tone": "professional"
}

Return ONLY the JSON object, no explanation.

PAGE TEXT:
${pageText}`,
        },
      ],
    });

    const raw = extraction.content[0].type === "text" ? extraction.content[0].text.trim() : "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return Response.json({ error: "Failed to parse property data from the page." }, { status: 500 });
    }

    const extracted = JSON.parse(jsonMatch[0]);

    // Merge extracted data into default PropertyDetails shape
    const details: Partial<PropertyDetails> = {
      propertyType: (extracted.propertyType as PropertyType) ?? "apartment",
      listingType: extracted.listingType ?? "sale",
      title: extracted.title ?? "",
      location: extracted.location ?? "",
      price: extracted.price ?? "",
      currency: extracted.currency ?? "MYR (RM)",
      bedrooms: extracted.bedrooms ?? "",
      bathrooms: extracted.bathrooms ?? "",
      area: extracted.area ?? "",
      areaUnit: extracted.areaUnit ?? "sqft",
      features: Array.isArray(extracted.features) ? extracted.features : [],
      highlights: extracted.highlights ?? "",
      tone: (extracted.tone as Tone) ?? "professional",
    };

    return Response.json({ details });
  } catch (err) {
    console.error("Scrape error:", err);
    const message = err instanceof Error ? err.message : "Scrape failed.";
    return Response.json({ error: message }, { status: 500 });
  }
}
