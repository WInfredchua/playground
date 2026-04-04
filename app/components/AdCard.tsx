"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { AdFormat, FORMAT_ICONS, FORMAT_LABELS } from "../types";

interface Props {
  format: AdFormat;
  content: string;
  isStreaming?: boolean;
}

export default function AdCard({ format, content, isStreaming }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className="ad-card animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{FORMAT_ICONS[format]}</span>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              {FORMAT_LABELS[format]}
            </h3>
            {!isStreaming && content && (
              <p className="text-xs text-slate-400">
                {wordCount} words · {charCount} chars
              </p>
            )}
          </div>
        </div>

        <button
          onClick={handleCopy}
          disabled={!content || isStreaming}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            copied
              ? "bg-green-50 text-green-600"
              : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          }`}
        >
          {copied ? (
            <>
              <Check size={12} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={12} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* Content */}
      <div className="relative min-h-[80px]">
        {!content && isStreaming ? (
          <div className="space-y-2 pt-1">
            <div className="shimmer h-3.5 w-full rounded" />
            <div className="shimmer h-3.5 w-4/5 rounded" />
            <div className="shimmer h-3.5 w-full rounded" />
            <div className="shimmer h-3.5 w-3/5 rounded" />
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 scrollbar-thin">
            {content}
            {isStreaming && (
              <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-blue-500 align-text-bottom" />
            )}
          </p>
        )}
      </div>
    </div>
  );
}
