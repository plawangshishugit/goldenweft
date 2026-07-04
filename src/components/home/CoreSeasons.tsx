import Link from "next/link";
import Image from "next/image";
import { getHomepageTiles } from "@/lib/homepageTiles";

export default async function CoreSeasons() {
  const seasons = await getHomepageTiles("seasonal");

  if (seasons.length === 0) return null;
  return (
    <section
      style={{ padding: "var(--space-section) 0" }}
    >
      {/* ── Header — contained, centered, editorial ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="mb-16 reveal text-center mx-auto" style={{ maxWidth: "38rem" }}>
          <p className="eyebrow mb-5">Curated by Occasion</p>
          <h2
            className="font-serif"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
              marginBottom: "1.25rem",
            }}
          >
            Seasonal Highlights
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              color: "var(--ink-muted)",
              lineHeight: 1.7,
            }}
          >
            Silks thoughtfully curated for the celebrations and rituals that define each season.
          </p>
        </div>
      </div>

      {/* ── 4-up image grid — FULL BLEED, caption lives below ── */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-px"
        style={{
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          background: "var(--color-border)",
        }}
      >
        {seasons.map((season, i) => (
          <Link
            key={season.id}
            href={season.href}
            className={`group block reveal reveal-delay-${i + 1}`}
            style={{ background: "var(--paper)" }}
          >
            {/* Photograph — unobstructed */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <Image
                src={season.image}
                alt={season.title}
                fill
                className="object-cover img-zoom"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              {/* Accent line — Prada-style hover only */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ background: "var(--gold)" }}
              />
            </div>

            {/* Caption — below the image, centered, minimal */}
            <div className="text-center" style={{ padding: "1.375rem 1rem 0" }}>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.58rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  marginBottom: "0.5rem",
                }}
              >
                {season.subtitle}
              </span>

              <h3
                className="font-serif"
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 400,
                  lineHeight: 1.25,
                  color: "var(--ink)",
                  marginBottom: "0.75rem",
                }}
              >
                {season.title}
              </h3>

              <div
                className="inline-flex items-center gap-2 transition-all duration-300 group-hover:gap-3"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.6rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--ink-muted)",
                  paddingBottom: "1.5rem",
                }}
              >
                <span>Explore</span>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
