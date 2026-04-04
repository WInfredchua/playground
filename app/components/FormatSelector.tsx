"use client";

import { AdFormat, FORMAT_ICONS, FORMAT_LABELS } from "../types";

interface Props {
  selected: AdFormat[];
  onChange: (formats: AdFormat[]) => void;
}

const ALL_FORMATS: AdFormat[] = [
  "listing",
  "social_instagram",
  "social_facebook",
  "whatsapp",
  "email",
  "headline",
  "tagline",
];

export default function FormatSelector({ selected, onChange }: Props) {
  const toggle = (fmt: AdFormat) => {
    if (selected.includes(fmt)) {
      if (selected.length === 1) return; // keep at least one
      onChange(selected.filter((f) => f !== fmt));
    } else {
      onChange([...selected, fmt]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_FORMATS.map((fmt) => {
        const active = selected.includes(fmt);
        return (
          <button
            key={fmt}
            type="button"
            onClick={() => toggle(fmt)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-150 ${
              active
                ? "border-blue-500 bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm shadow-blue-500/25"
                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <span>{FORMAT_ICONS[fmt]}</span>
            {FORMAT_LABELS[fmt]}
          </button>
        );
      })}
    </div>
  );
}
