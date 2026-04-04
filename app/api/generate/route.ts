import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { PropertyDetails, AdFormat, FORMAT_LABELS } from "../../types";

export const runtime = "nodejs";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function buildPrompt(details: PropertyDetails): string {
  const listingLabel = details.listingType === "sale" ? "For Sale" : "For Rent";
  const priceLabel = details.price
    ? `${details.currency.split(" ")[0]} ${details.price}${details.listingType === "rent" ? "/month" : ""}`
    : "Price upon request";

  const specs: string[] = [];
  if (details.bedrooms) specs.push(`${details.bedrooms} bed`);
  if (details.bathrooms) specs.push(`${details.bathrooms} bath`);
  if (details.area) specs.push(`${details.area} ${details.areaUnit}`);

  const formatInstructions = details.formats
    .map((fmt: AdFormat) => {
      const instructions: Record<AdFormat, string> = {
        listing: `
### LISTING DESCRIPTION
Write a compelling property listing description (250–400 words). Include an attention-grabbing opening, key features woven naturally into the narrative, lifestyle benefits, and a strong call to action. Use paragraph breaks. Make it scannable with natural emphasis on standout features.`,

        social_instagram: `
### INSTAGRAM POST
Write an Instagram caption (150–250 words). Start with a hook emoji line. Use emojis throughout. Include key property highlights in bullet points. Add 15–20 relevant hashtags at the end (mix of location, property type, and lifestyle tags). End with a clear CTA.`,

        social_facebook: `
### FACEBOOK POST
Write a Facebook post (200–350 words). More conversational than Instagram. Include the key details upfront, tell a mini story about the lifestyle, use bullet points for features, and end with a clear CTA and contact prompt. Use some emojis but less than Instagram.`,

        whatsapp: `
### WHATSAPP MESSAGE
Write a WhatsApp broadcast message (100–180 words). Keep it punchy and conversational. Use line breaks and emojis. Include price, key specs, location, and 3–4 top features. End with a direct CTA like "Reply YES for more info" or "DM me to arrange viewing".`,

        email: `
### EMAIL CAMPAIGN
Write a property email with:
- Subject line (max 60 chars, catchy)
- Preview text (max 90 chars)
- Email body (300–500 words) with: personalised opening, property narrative, key features as a bullet list, lifestyle benefits, urgency element, and a clear CTA button label.
Format as:
Subject: [subject line]
Preview: [preview text]
---
[email body]`,

        headline: `
### HEADLINES & TITLES
Generate 6 compelling headlines/titles for this property. Include:
- 2 aspirational lifestyle headlines
- 2 feature-focused headlines
- 2 urgency/value headlines
Each headline max 10 words. Number them 1–6.`,

        tagline: `
### TAGLINES & SLOGANS
Create 5 short taglines/slogans for this property (max 8 words each). Each should be memorable and evoke emotion. Number them 1–5.`,
      };
      return instructions[fmt];
    })
    .join("\n");

  return `You are an expert real estate copywriter specialising in Malaysian and Southeast Asian property markets. Generate compelling, authentic property advertisements that convert.

## PROPERTY INFORMATION
- **Type:** ${details.propertyType.charAt(0).toUpperCase() + details.propertyType.slice(1)} — ${listingLabel}
${details.title ? `- **Name/Title:** ${details.title}` : ""}
- **Location:** ${details.location || "Prime location"}
- **Price:** ${priceLabel}
${specs.length > 0 ? `- **Specs:** ${specs.join(" · ")}` : ""}
${details.features.length > 0 ? `- **Features & Amenities:** ${details.features.join(", ")}` : ""}
${details.highlights ? `- **Unique Highlights:** ${details.highlights}` : ""}
${details.targetAudience ? `- **Target Audience:** ${details.targetAudience}` : ""}
- **Tone:** ${details.tone.charAt(0).toUpperCase() + details.tone.slice(1)} (${
    {
      professional: "formal, authoritative, trust-building",
      luxury: "premium, aspirational, sophisticated",
      friendly: "warm, approachable, conversational",
      urgent: "FOMO-driven, time-sensitive, action-oriented",
      cozy: "homely, inviting, emotionally warm",
    }[details.tone]
  })

## INSTRUCTIONS
Generate ONLY the formats requested below. Use the exact section headers shown. Write in the tone specified. Make the copy feel authentic — avoid generic filler phrases. Highlight real differentiators. Every piece of copy should make a reader feel excited and compelled to act.

${formatInstructions}`;
}

export async function POST(req: NextRequest) {
  try {
    const details: PropertyDetails = await req.json();

    if (!details.location && !details.title) {
      return new Response(
        JSON.stringify({ error: "Please provide at least a location or property title." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const prompt = buildPrompt(details);

    const stream = await client.messages.stream({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      thinking: { type: "adaptive" } as any,
      messages: [{ role: "user", content: prompt }],
      system: `You are PropAds AI, an expert property copywriter for Southeast Asian real estate markets.
Your copy is: authentic, emotionally resonant, conversion-focused, and tailored to the requested tone.
Never use generic filler phrases. Always highlight real differentiators.
Output ONLY the requested ad formats with their section headers.`,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const chunk = encoder.encode(event.delta.text);
              controller.enqueue(chunk);
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    console.error("Generate error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate ads. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
