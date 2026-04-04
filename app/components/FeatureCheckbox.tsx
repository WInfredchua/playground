"use client";

import { Check } from "lucide-react";

interface Props {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function FeatureCheckbox({ label, checked, onChange }: Props) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-150 ${
        checked
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <span
        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition-colors ${
          checked ? "border-blue-500 bg-blue-500" : "border-slate-300 bg-white"
        }`}
      >
        {checked && <Check size={10} className="text-white" strokeWidth={3} />}
      </span>
      {label}
    </button>
  );
}
