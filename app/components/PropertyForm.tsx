"use client";

import { ChevronDown } from "lucide-react";
import {
  PropertyDetails,
  PropertyType,
  ListingType,
  Tone,
  PROPERTY_FEATURES,
} from "../types";
import FeatureCheckbox from "./FeatureCheckbox";
import FormatSelector from "./FormatSelector";

interface Props {
  details: PropertyDetails;
  onChange: (d: PropertyDetails) => void;
}

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "Apartment" },
  { value: "house", label: "House" },
  { value: "condo", label: "Condominium" },
  { value: "townhouse", label: "Townhouse" },
  { value: "villa", label: "Villa" },
  { value: "studio", label: "Studio" },
  { value: "penthouse", label: "Penthouse" },
  { value: "shophouse", label: "Shophouse" },
  { value: "land", label: "Land" },
  { value: "commercial", label: "Commercial" },
];

const CURRENCIES = ["MYR (RM)", "SGD ($)", "USD ($)", "AUD ($)", "GBP (£)", "EUR (€)", "THB (฿)", "IDR (Rp)"];

const TONES: { value: Tone; label: string; desc: string }[] = [
  { value: "professional", label: "Professional", desc: "Formal & authoritative" },
  { value: "luxury", label: "Luxury", desc: "Premium & aspirational" },
  { value: "friendly", label: "Friendly", desc: "Warm & approachable" },
  { value: "urgent", label: "Urgent", desc: "FOMO & time-sensitive" },
  { value: "cozy", label: "Cozy", desc: "Homely & inviting" },
];

export default function PropertyForm({ details, onChange }: Props) {
  const set = <K extends keyof PropertyDetails>(key: K, val: PropertyDetails[K]) =>
    onChange({ ...details, [key]: val });

  const toggleFeature = (feature: string) => {
    const has = details.features.includes(feature);
    set("features", has ? details.features.filter((f) => f !== feature) : [...details.features, feature]);
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</span>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Property Details</h2>
        </div>

        {/* Type & Listing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Property Type</label>
            <div className="relative">
              <select
                className="select-field"
                value={details.propertyType}
                onChange={(e) => set("propertyType", e.target.value as PropertyType)}
              >
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="label">Listing Type</label>
            <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              {(["sale", "rent"] as ListingType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("listingType", t)}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                    details.listingType === t
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  For {t === "sale" ? "Sale" : "Rent"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="label">Property Title / Name <span className="text-slate-400 normal-case font-normal">(optional)</span></label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. The Residences @ Mont Kiara, Damansara Heights..."
            value={details.title}
            onChange={(e) => set("title", e.target.value)}
          />
        </div>

        {/* Location */}
        <div>
          <label className="label">Location / Address</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Bangsar South, Kuala Lumpur"
            value={details.location}
            onChange={(e) => set("location", e.target.value)}
          />
        </div>

        {/* Price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Price</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 850,000 or 2,500/mo"
              value={details.price}
              onChange={(e) => set("price", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Currency</label>
            <div className="relative">
              <select
                className="select-field"
                value={details.currency}
                onChange={(e) => set("currency", e.target.value)}
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Bedrooms</label>
            <div className="relative">
              <select
                className="select-field"
                value={details.bedrooms}
                onChange={(e) => set("bedrooms", e.target.value)}
              >
                <option value="">—</option>
                {["Studio", "1", "2", "3", "4", "5", "6", "7+"].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="label">Bathrooms</label>
            <div className="relative">
              <select
                className="select-field"
                value={details.bathrooms}
                onChange={(e) => set("bathrooms", e.target.value)}
              >
                <option value="">—</option>
                {["1", "2", "3", "4", "5", "6+"].map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="label">Built-up Area</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="input-field"
                placeholder="1200"
                value={details.area}
                onChange={(e) => set("area", e.target.value)}
              />
              <div className="relative">
                <select
                  className="select-field w-24"
                  value={details.areaUnit}
                  onChange={(e) => set("areaUnit", e.target.value as "sqft" | "sqm")}
                >
                  <option value="sqft">sq ft</option>
                  <option value="sqm">sq m</option>
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</span>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Features & Amenities</h2>
          {details.features.length > 0 && (
            <span className="ml-auto tag bg-blue-50 text-blue-600">{details.features.length} selected</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {PROPERTY_FEATURES.map((f) => (
            <FeatureCheckbox
              key={f}
              label={f}
              checked={details.features.includes(f)}
              onChange={() => toggleFeature(f)}
            />
          ))}
        </div>
      </section>

      {/* Highlights & Audience */}
      <section className="card p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">3</span>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Selling Points</h2>
        </div>

        <div>
          <label className="label">Unique Highlights <span className="text-slate-400 normal-case font-normal">(what makes this special?)</span></label>
          <textarea
            className="input-field resize-none"
            rows={3}
            placeholder="e.g. Rare corner unit with panoramic KLCC view. Just 5 min walk to MRT. Developer closing sale — urgent!"
            value={details.highlights}
            onChange={(e) => set("highlights", e.target.value)}
          />
        </div>

        <div>
          <label className="label">Target Audience <span className="text-slate-400 normal-case font-normal">(who is this for?)</span></label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Young professionals, growing families, investors, expats..."
            value={details.targetAudience}
            onChange={(e) => set("targetAudience", e.target.value)}
          />
        </div>

        {/* Tone */}
        <div>
          <label className="label">Tone & Style</label>
          <div className="grid grid-cols-5 gap-2">
            {TONES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => set("tone", t.value)}
                className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all duration-150 ${
                  details.tone === t.value
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                <span className="text-xs font-semibold">{t.label}</span>
                <span className="text-[10px] text-slate-400">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Output Formats */}
      <section className="card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">4</span>
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Output Formats</h2>
        </div>
        <p className="text-xs text-slate-500">Select which ad formats to generate</p>
        <FormatSelector
          selected={details.formats}
          onChange={(fmts) => set("formats", fmts)}
        />
      </section>
    </div>
  );
}
