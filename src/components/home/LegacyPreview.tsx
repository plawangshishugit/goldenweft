"use client";

import Link from "next/link";

const pillars = [
  {
    title: "Handloom Craft",
    body: "Each weave is crafted on traditional looms, preserving techniques passed down through generations of Bhagalpur artisans.",
  },
  {
    title: "Artisan Made",
    body: "Skilled hands guide every thread — no automated shortcuts, no industrial replication. The loom hears the weaver breathe.",
  },
  {
    title: "Time & Patience",
    body: "A single piece can take days to complete, ensuring depth, character, and a texture that only patience can produce.",
  },
  {
    title: "Rooted in Bhagalpur",
    body: "Known globally as India's Silk City, Bhagalpur's weaving heritage spans centuries and cannot be replicated anywhere.",
  },
];

export default function LegacyPreview() {
  return (
    <section style={{ padding: "var(--space-section) 0" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28 items-center">

          {/* ── Left — story text ── */}
          <div className="reveal">
            <p className="eyebrow mb-6">Our Story</p>

            <h2
              className="font-serif"
              style={{
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 300,
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
                marginBottom: "1.5rem",
              }}
            >
              Woven by hand.
              <br />
              <em style={{ fontStyle: "italic", fontWeight: 300 }}>Guided by generations.</em>
            </h2>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                lineHeight: 1.9,
                color: "var(--ink-mid)",
                marginBottom: "1.25rem",
              }}
            >
              Every GoldenWeft silk begins its journey on a handloom in Bhagalpur —
              shaped by time, skill, and the quiet dedication of artisans who have
              carried this craft across generations.
            </p>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                lineHeight: 1.9,
                color: "var(--ink-mid)",
                marginBottom: "2.5rem",
              }}
            >
              We do not rush our weaves, and we do not mass-produce tradition.
              Each piece reflects patience, heritage, and deep respect for the
              material itself.
            </p>

            {/* Pull quote */}
            <blockquote
              style={{
                borderLeft: "1px solid var(--gold)",
                paddingLeft: "1.5rem",
                marginBottom: "2.5rem",
              }}
            >
              <p
                className="font-serif"
                style={{
                  fontSize: "1.1rem",
                  fontStyle: "italic",
                  fontWeight: 300,
                  lineHeight: 1.65,
                  color: "var(--ink-muted)",
                }}
              >
                "The thread remembers what the machine forgets."
              </p>
            </blockquote>

            <Link
              href="/legacy"
              className="inline-flex items-center gap-3 group transition-opacity hover:opacity-50 duration-300"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--ink)",
              }}
            >
              Discover our legacy
              <svg
                width="13" height="13" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* ── Right — pillars grid ── */}
          <div className="grid grid-cols-2 gap-px" style={{ background: "var(--color-border)" }}>
            {pillars.map((pillar, i) => (
              <div
                key={pillar.title}
                className={`p-8 reveal reveal-delay-${i + 1}`}
                style={{
                  background: "var(--paper)",
                  transition: "background 300ms",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--paper-soft)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--paper)"; }}
              >
                <div style={{ width: "28px", height: "1px", background: "var(--gold)", marginBottom: "1.5rem" }} />
                <h3
                  className="font-serif"
                  style={{
                    fontSize: "1rem",
                    fontWeight: 400,
                    color: "var(--ink)",
                    marginBottom: "0.75rem",
                    lineHeight: 1.3,
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8rem",
                    color: "var(--ink-muted)",
                    lineHeight: 1.8,
                  }}
                >
                  {pillar.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
