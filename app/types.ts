export type PropertyType =
  | "apartment"
  | "house"
  | "condo"
  | "townhouse"
  | "villa"
  | "studio"
  | "penthouse"
  | "land"
  | "commercial"
  | "shophouse";

export type ListingType = "sale" | "rent";

export type Tone = "professional" | "luxury" | "friendly" | "urgent" | "cozy";

export type AdFormat =
  | "listing"
  | "social_instagram"
  | "social_facebook"
  | "whatsapp"
  | "email"
  | "headline"
  | "tagline";

export interface PropertyDetails {
  propertyType: PropertyType;
  listingType: ListingType;
  title: string;
  location: string;
  price: string;
  currency: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  areaUnit: "sqft" | "sqm";
  features: string[];
  highlights: string;
  targetAudience: string;
  tone: Tone;
  formats: AdFormat[];
}

export interface GeneratedAd {
  format: AdFormat;
  content: string;
}

export const FORMAT_LABELS: Record<AdFormat, string> = {
  listing: "Property Listing",
  social_instagram: "Instagram Post",
  social_facebook: "Facebook Post",
  whatsapp: "WhatsApp Message",
  email: "Email Campaign",
  headline: "Headlines & Titles",
  tagline: "Taglines & Slogans",
};

export const FORMAT_ICONS: Record<AdFormat, string> = {
  listing: "🏠",
  social_instagram: "📸",
  social_facebook: "👥",
  whatsapp: "💬",
  email: "✉️",
  headline: "📰",
  tagline: "✨",
};

export const PROPERTY_FEATURES = [
  "Swimming Pool",
  "Gymnasium / Gym",
  "Garden / Backyard",
  "Balcony / Terrace",
  "Parking (covered)",
  "Parking (open)",
  "Security / CCTV",
  "Smart Home System",
  "Air Conditioning",
  "Built-in Kitchen",
  "Open Plan Living",
  "City View",
  "Sea View",
  "Mountain View",
  "Pet Friendly",
  "Gated Community",
  "Near MRT / LRT",
  "Near Highway",
  "Near Schools",
  "Near Shopping Mall",
  "Freehold",
  "Leasehold",
  "Furnished",
  "Semi-furnished",
  "Brand New",
  "Recently Renovated",
  "Corner Unit",
  "High Floor",
  "Low Density",
  "24-Hour Security",
];
