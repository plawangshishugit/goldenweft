"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

type Slide = {
  id: string;
  type: "image" | "video" | "gif";
  url: string;
  poster?: string;
  eyebrow?: string;
  headline: string;
  subline?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaLabel2?: string;
  ctaHref2?: string;
  overlayOpacity: number;
  textPosition?: "bottom-center" | "bottom-left" | "center";
  active: boolean;
};

const SLIDE_DURATION = 6000; // ms per slide

export default function HeroSlider({
  slides,
  minHeight = "92vh",
}: {
  slides: Slide[];
  minHeight?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startRef = useRef<number>(Date.now());
  const elapsed = useRef<number>(0);

  const total = slides.length;

  const goTo = useCallback((idx: number) => {
    setCurrent(((idx % total) + total) % total);
    setProgress(0);
    elapsed.current = 0;
    startRef.current = Date.now();
  }, [total]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  /* ── Progress timer ── */
  useEffect(() => {
    if (paused || total <= 1) return;
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const spent = elapsed.current + (now - startRef.current);
      const pct = Math.min((spent / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (spent >= SLIDE_DURATION) {
        goTo(current + 1);
      }
    }, 50);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [current, paused, total, goTo]);

  /* ── Pause/resume ── */
  function pause() {
    elapsed.current += Date.now() - startRef.current;
    setPaused(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }
  function resume() {
    startRef.current = Date.now();
    setPaused(false);
  }

  if (!slides.length) return null;

  const slide = slides[current];
  const textPos = slide.textPosition ?? "bottom-center";

  const textAlign: React.CSSProperties = textPos === "bottom-left"
    ? { alignItems: "flex-end", paddingBottom: "4rem", paddingLeft: "clamp(1.5rem, 8vw, 8rem)", textAlign: "left" }
    : textPos === "center"
    ? { alignItems: "center", justifyContent: "center", textAlign: "center" }
    : { alignItems: "flex-end", paddingBottom: "4.5rem", textAlign: "center", justifyContent: "center" };

  return (
    <section
      style={{ position: "relative", minHeight, overflow: "hidden", background: "#111", display: "flex", flexDirection: "column" }}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      {/* ── Media layers — one per slide, fade between them ── */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          style={{
            position: "absolute", inset: 0,
            opacity: i === current ? 1 : 0,
            transition: "opacity 800ms cubic-bezier(0.4,0,0.2,1)",
            pointerEvents: "none",
          }}
        >
          {(s.type === "video" || s.type === "gif") ? (
            <video
              src={s.url}
              poster={s.poster}
              autoPlay muted loop playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={s.url}
              alt={s.headline}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
            />
          )}
          {/* Overlay */}
          <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${s.overlayOpacity ?? 0.3})` }} />
        </div>
      ))}

      {/* ── Text overlay ── */}
      <div style={{
        position: "relative", zIndex: 10, flex: 1,
        display: "flex", flexDirection: "column",
        width: "100%",
        ...textAlign,
      }}>
        <div style={{ maxWidth: textPos === "bottom-center" ? "none" : "36rem" }}>
          {slide.eyebrow && (
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "0.6rem",
              letterSpacing: "0.26em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.75)", marginBottom: "0.75rem",
            }}>{slide.eyebrow}</p>
          )}
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2rem, 6vw, 5.5rem)",
            fontWeight: 700, lineHeight: 1.0,
            color: "#fff", marginBottom: "0.75rem",
          }}>{slide.headline}</h1>
          {slide.subline && (
            <p style={{
              fontFamily: "var(--font-body)", fontSize: "0.875rem",
              color: "rgba(255,255,255,0.8)", lineHeight: 1.6,
              marginBottom: "1.25rem", maxWidth: "36rem",
              margin: "0 auto 1.25rem",
            }}>{slide.subline}</p>
          )}
          {/* CTAs — Prada underlined text style */}
          <div style={{ display: "flex", gap: "1.5rem", justifyContent: textPos === "bottom-left" ? "flex-start" : "center", flexWrap: "wrap", marginTop: "1rem" }}>
            {slide.ctaHref && slide.ctaLabel && (
              <Link href={slide.ctaHref} style={{
                fontFamily: "var(--font-body)", fontSize: "0.72rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#fff", textDecoration: "underline",
                textUnderlineOffset: "5px", textDecorationThickness: "1px",
                transition: "opacity 200ms",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity="0.6"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity="1"}
              >{slide.ctaLabel}</Link>
            )}
            {slide.ctaHref2 && slide.ctaLabel2 && (
              <Link href={slide.ctaHref2} style={{
                fontFamily: "var(--font-body)", fontSize: "0.72rem",
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#fff", textDecoration: "underline",
                textUnderlineOffset: "5px", textDecorationThickness: "1px",
                transition: "opacity 200ms",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity="0.6"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity="1"}
              >{slide.ctaLabel2}</Link>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom bar: progress lines + arrow + pause — Prada exact ── */}
      {total > 0 && (
        <div style={{
          position: "absolute", bottom: "1.75rem", left: 0, right: 0,
          zIndex: 20, display: "flex", alignItems: "center",
          justifyContent: "center", gap: "0.5rem", padding: "0 2rem",
        }}>
          {/* Progress bars */}
          <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  position: "relative", height: "1px", border: "none",
                  width: i === current ? "48px" : "32px",
                  background: "rgba(255,255,255,0.3)",
                  cursor: "pointer", padding: 0,
                  transition: "width 300ms",
                  overflow: "hidden",
                }}
                aria-label={`Go to slide ${i + 1}`}
              >
                {/* Fill */}
                <span style={{
                  position: "absolute", top: 0, left: 0, height: "100%",
                  background: "#fff",
                  width: i === current ? `${progress}%` : i < current ? "100%" : "0%",
                  transition: i === current ? "none" : "width 0ms",
                }} />
              </button>
            ))}
          </div>

          {/* Arrow next */}
          {total > 1 && (
            <button
              onClick={next}
              style={{
                marginLeft: "0.75rem", background: "none", border: "none",
                color: "#fff", cursor: "pointer", padding: "4px",
                opacity: 0.8, transition: "opacity 200ms",
                display: "flex", alignItems: "center",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity="1"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity="0.8"}
              aria-label="Next slide"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          )}

          {/* Pause/play */}
          <button
            onClick={() => paused ? resume() : pause()}
            style={{
              marginLeft: "0.5rem", background: "none", border: "none",
              color: "#fff", cursor: "pointer", padding: "4px",
              opacity: 0.7, transition: "opacity 200ms",
              display: "flex", alignItems: "center",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity="1"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity="0.7"}
            aria-label={paused ? "Play" : "Pause"}
          >
            {paused ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>
              </svg>
            )}
          </button>
        </div>
      )}

      {/* ── Prev arrow (left side) ── */}
      {total > 1 && (
        <button
          onClick={prev}
          style={{
            position: "absolute", left: "1.5rem", top: "50%",
            transform: "translateY(-50%)", zIndex: 20,
            background: "none", border: "none", color: "#fff",
            cursor: "pointer", padding: "8px", opacity: 0,
            transition: "opacity 300ms",
          }}
          className="hero-prev"
          aria-label="Previous slide"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      )}

      <style>{`.hero-prev { opacity: 0 } section:hover .hero-prev { opacity: 0.7 }`}</style>
    </section>
  );
}