"use client";

import { useEffect, useState } from "react";
import AdvisorProductCard from "./AdvisorProductCard";

const CACHE_KEY = "gw_advisor_results_v1";

type AdvisorItem = {
  product?: any;
  reasons?: string[];
  confidence: number;
};

export default function AdvisorResult({
  answers,
  lastEdited,
  onRestart,
}: {
  answers: Record<string, string>;
  lastEdited: string | null;
  onRestart: () => void;
}) {
  const [results, setResults] = useState<AdvisorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const cachedRaw = localStorage.getItem(CACHE_KEY);
        const cached: AdvisorItem[] | null = cachedRaw ? JSON.parse(cachedRaw) : null;

        if (cached && lastEdited) {
          const value = answers[lastEdited];
          const reranked = cached
            .filter((r) => r && r.product)
            .map((r) => {
              let boost = 0;
              if (value && (r.product?.tones?.includes(value) || r.product?.occasions?.includes(value) || r.product?.style === value || r.product?.tier === value)) boost = 5;
              return { ...r, confidence: Math.min(100, Math.max(0, r.confidence + boost)) };
            })
            .sort((a, b) => b.confidence - a.confidence);
          if (mounted) { setResults(reranked); setLoading(false); }
          return;
        }

        const res = await fetch("/api/advisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });
        const data = await res.json();
        const recs: AdvisorItem[] = (data.recommendations ?? []).filter((r: AdvisorItem) => r && r.product);
        if (mounted) {
          setResults(recs);
          localStorage.setItem(CACHE_KEY, JSON.stringify(recs));
          setLoading(false);
        }
      } catch (err) {
        if (mounted) { setResults([]); setLoading(false); }
      }
    }
    load();
    return () => { mounted = false; };
  }, [answers, lastEdited]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-[2px] bg-[var(--color-gold)] mx-auto mb-4 animate-pulse" />
          <p className="font-serif italic text-[1.1rem] text-[var(--ink-muted)]">
            Curating silks for you…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-20">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
        <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-gold)]">Your Personal Edit</span>
      </div>

      <h1 className="font-serif text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.1] text-[var(--color-charcoal)] mb-3">
        Your GoldenWeft Edit
      </h1>

      {lastEdited && (
        <div className="inline-flex items-center gap-2 text-[0.65rem] tracking-[0.15em] uppercase text-[var(--color-gold)] border border-[var(--color-gold-muted)] px-3 py-1.5 mb-8">
          <span>◆</span> Updated for {lastEdited}
        </div>
      )}

      {results.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-[var(--ink-mid)] mb-6">No close matches found. Try adjusting your preferences.</p>
          <button onClick={() => { localStorage.removeItem(CACHE_KEY); onRestart(); }} className="btn-ghost">
            Start Over
          </button>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl">
          {results.map((item, i) => {
            if (!item.product) return null;
            return (
              <AdvisorProductCard
                key={`${item.product.slug}-${i}`}
                product={item.product}
                reasons={item.reasons ?? []}
                confidence={item.confidence}
                highlight={i === 0}
              />
            );
          })}
        </div>
      )}

      <div className="mt-16 pt-10 border-t border-[var(--color-border)]">
        <button
          onClick={() => { localStorage.removeItem(CACHE_KEY); onRestart(); }}
          className="inline-flex items-center gap-2 text-[0.75rem] tracking-[0.15em] uppercase text-[var(--ink-mid)] hover:opacity-60 transition-colors duration-300"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          Restart Silk Advisor
        </button>
      </div>
    </div>
  );
}