"use client";

import { useState, useRef } from "react";
import {
  Sparkles,
  Wand2,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Building2,
  AlertCircle,
  Download,
  Link,
  Loader2,
} from "lucide-react";
import PropertyForm from "./components/PropertyForm";
import AdCard from "./components/AdCard";
import {
  PropertyDetails,
  GeneratedAd,
  AdFormat,
  FORMAT_LABELS,
  FORMAT_ICONS,
} from "./types";

const DEFAULT_DETAILS: PropertyDetails = {
  propertyType: "apartment",
  listingType: "sale",
  title: "",
  location: "",
  price: "",
  currency: "MYR (RM)",
  bedrooms: "3",
  bathrooms: "2",
  area: "",
  areaUnit: "sqft",
  features: [],
  highlights: "",
  targetAudience: "",
  tone: "professional",
  formats: ["listing", "social_instagram", "whatsapp"],
};

function parseAds(raw: string, formats: AdFormat[]): GeneratedAd[] {
  const SECTION_MAP: Record<AdFormat, string[]> = {
    listing: ["LISTING DESCRIPTION"],
    social_instagram: ["INSTAGRAM POST"],
    social_facebook: ["FACEBOOK POST"],
    whatsapp: ["WHATSAPP MESSAGE"],
    email: ["EMAIL CAMPAIGN"],
    headline: ["HEADLINES", "HEADLINES & TITLES"],
    tagline: ["TAGLINES", "TAGLINES & SLOGANS"],
  };

  const results: GeneratedAd[] = [];

  for (const fmt of formats) {
    const headers = SECTION_MAP[fmt];
    let start = -1;
    let headerFound = "";

    for (const h of headers) {
      const idx = raw.toUpperCase().indexOf(`### ${h}`);
      if (idx !== -1 && (start === -1 || idx < start)) {
        start = idx;
        headerFound = h;
      }
    }

    if (start === -1) {
      results.push({ format: fmt, content: "" });
      continue;
    }

    // Find the end (next ### or end of string)
    const afterHeader = raw.indexOf("\n", start) + 1;
    const nextSection = raw.indexOf("\n###", afterHeader);
    const content =
      nextSection === -1
        ? raw.slice(afterHeader).trim()
        : raw.slice(afterHeader, nextSection).trim();

    results.push({ format: fmt, content });
  }

  return results;
}

export default function Home() {
  const [details, setDetails] = useState<PropertyDetails>(DEFAULT_DETAILS);
  const [ads, setAds] = useState<GeneratedAd[]>([]);
  const [rawOutput, setRawOutput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(true);
  const outputRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const [importUrl, setImportUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");

  const handleImport = async () => {
    if (!importUrl.trim()) return;
    setImportError("");
    setIsImporting(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");
      setDetails((prev) => ({
        ...prev,
        ...data.details,
        formats: prev.formats,
        targetAudience: prev.targetAudience,
      }));
      setImportUrl("");
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Import failed. Please try again.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleGenerate = async () => {
    if (!details.location && !details.title) {
      setError("Please enter at least a location or property title to get started.");
      return;
    }

    setError("");
    setIsGenerating(true);
    setRawOutput("");
    setAds(details.formats.map((fmt) => ({ format: fmt, content: "" })));
    setShowForm(false);

    // Scroll to output
    setTimeout(() => {
      outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details),
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setRawOutput(accumulated);
        setAds(parseAds(accumulated, details.formats));
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setShowForm(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsGenerating(false);
  };

  const handleReset = () => {
    handleStop();
    setDetails(DEFAULT_DETAILS);
    setAds([]);
    setRawOutput("");
    setError("");
    setShowForm(true);
  };

  const handleDownloadAll = () => {
    const completedAds = ads.filter((a) => a.content);
    if (!completedAds.length) return;

    const text = completedAds
      .map((a) => `=== ${FORMAT_ICONS[a.format]} ${FORMAT_LABELS[a.format].toUpperCase()} ===\n\n${a.content}`)
      .join("\n\n" + "─".repeat(60) + "\n\n");

    const propName = details.title || details.location || "property";
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${propName.replace(/\s+/g, "-").toLowerCase()}-ads.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedCount = ads.filter((a) => a.content.length > 0).length;
  const hasResults = ads.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <header className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <Building2 size={20} className="text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">PropAds</span>
                <span className="ml-1 text-xl font-light text-blue-200">AI</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm">
                <Sparkles size={11} className="text-yellow-300" />
                Powered by Claude Opus
              </span>
            </div>
          </div>

          <div className="mt-8 max-w-2xl">
            <h1 className="text-3xl font-extrabold text-white leading-tight sm:text-4xl">
              Generate Winning<br />
              <span className="text-yellow-300">Property Ads</span> in Seconds
            </h1>
            <p className="mt-3 text-base text-blue-100 leading-relaxed">
              AI-powered copywriting for listings, social media, WhatsApp, email campaigns and more.
              Fill in the details — let AI do the rest.
            </p>
          </div>

          {/* Stats bar */}
          <div className="mt-6 flex flex-wrap gap-6">
            {[
              { label: "Ad Formats", value: "7" },
              { label: "Tone Styles", value: "5" },
              { label: "Property Types", value: "10" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-white">{s.value}</span>
                <span className="text-sm text-blue-200">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Left: Form Panel */}
          <div className="w-full lg:w-[420px] lg:flex-shrink-0">
            {/* Mobile collapsible toggle */}
            {hasResults && (
              <button
                onClick={() => setShowForm((v) => !v)}
                className="mb-4 flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 lg:hidden"
              >
                <span className="flex items-center gap-2">
                  <Wand2 size={15} className="text-blue-600" />
                  Property Details
                </span>
                {showForm ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}

            <div className={hasResults && !showForm ? "hidden lg:block" : undefined}>
              {/* Apify URL Import */}
              <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Link size={11} />
                  Import from listing URL
                </p>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleImport()}
                    placeholder="https://www.propertyguru.com.my/..."
                    disabled={isImporting}
                    className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                  />
                  <button
                    onClick={handleImport}
                    disabled={isImporting || !importUrl.trim()}
                    className="btn-primary px-3 py-2 text-sm disabled:opacity-50"
                  >
                    {isImporting ? <Loader2 size={14} className="animate-spin" /> : "Import"}
                  </button>
                </div>
                {isImporting && (
                  <p className="mt-2 text-xs text-blue-500">Scraping page via Apify…</p>
                )}
                {importError && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
                    <AlertCircle size={12} />
                    {importError}
                  </p>
                )}
              </div>

              <PropertyForm details={details} onChange={setDetails} />

              {/* Error */}
              {error && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-5 flex gap-3">
                <button
                  onClick={isGenerating ? handleStop : handleGenerate}
                  className={`btn-primary flex-1 justify-center py-3.5 text-base ${
                    isGenerating
                      ? "from-orange-500 to-orange-600 shadow-orange-400/25 hover:from-orange-400 hover:to-orange-500"
                      : ""
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Stop Generating
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Generate Ads
                    </>
                  )}
                </button>

                {hasResults && (
                  <button
                    onClick={handleReset}
                    className="btn-secondary px-4 py-3.5"
                    title="Reset everything"
                  >
                    <RotateCcw size={15} />
                  </button>
                )}
              </div>

              {/* Format count hint */}
              <p className="mt-2.5 text-center text-xs text-slate-400">
                Generating {details.formats.length} format{details.formats.length > 1 ? "s" : ""} · ~15–30 sec
              </p>
            </div>
          </div>

          {/* Right: Output Panel */}
          <div className="flex-1 min-w-0" ref={outputRef}>
            {!hasResults && !isGenerating && (
              <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-10 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 mb-4">
                  <Wand2 size={28} className="text-blue-500" />
                </div>
                <h3 className="text-base font-semibold text-slate-700 mb-2">Your ads will appear here</h3>
                <p className="text-sm text-slate-400 max-w-sm">
                  Fill in the property details on the left, choose your formats, and hit{" "}
                  <strong className="text-slate-600">Generate Ads</strong> to create compelling copy instantly.
                </p>

                <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-xs">
                  {(["listing", "social_instagram", "whatsapp"] as AdFormat[]).map((fmt) => (
                    <div
                      key={fmt}
                      className="flex flex-col items-center gap-1 rounded-xl bg-slate-50 px-3 py-3"
                    >
                      <span className="text-xl">{FORMAT_ICONS[fmt]}</span>
                      <span className="text-[10px] font-medium text-slate-500">{FORMAT_LABELS[fmt].split(" ")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {hasResults && (
              <div className="space-y-4">
                {/* Results header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-slate-800">Generated Ads</h2>
                    {isGenerating ? (
                      <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                        Generating…
                      </span>
                    ) : (
                      <span className="tag bg-green-50 text-green-600">
                        ✓ {completedCount}/{ads.length} complete
                      </span>
                    )}
                  </div>

                  {!isGenerating && completedCount > 0 && (
                    <button onClick={handleDownloadAll} className="btn-secondary text-xs py-1.5 px-3">
                      <Download size={12} />
                      Download All
                    </button>
                  )}
                </div>

                {/* Ad Cards */}
                <div className="space-y-4">
                  {ads.map((ad) => (
                    <AdCard
                      key={ad.format}
                      format={ad.format}
                      content={ad.content}
                      isStreaming={isGenerating}
                    />
                  ))}
                </div>

                {/* Regenerate */}
                {!isGenerating && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleGenerate}
                      className="btn-secondary flex-1 justify-center py-3"
                    >
                      <RotateCcw size={14} />
                      Regenerate All
                    </button>
                    <button
                      onClick={handleReset}
                      className="btn-secondary px-4 py-3 text-slate-500"
                    >
                      New Property
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-100 bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="text-xs text-slate-400">
              PropAds AI — Real estate copywriting powered by Claude Opus
            </p>
            <p className="text-xs text-slate-400">
              Always review AI-generated content before publishing
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
