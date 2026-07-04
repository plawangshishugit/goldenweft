import Link from "next/link";
import Image from "next/image";
import { getHomepageTiles } from "@/lib/homepageTiles";

export default async function ShopByStyle() {
  const styles = await getHomepageTiles("style");

  if (styles.length === 0) return null;
  return (
    <section
      style={{ padding: "var(--space-section) 0", background: "var(--paper-soft)" }}
    >
      {/* ── Header — contained, centered, editorial ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="mb-16 reveal text-center mx-auto" style={{ maxWidth: "38rem" }}>
          <p className="eyebrow mb-5">Curated by Aesthetic</p>
          <h2
            className="font-serif"
            style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: 300, lineHeight: 1.08, color: "var(--ink)", letterSpacing: "-0.01em" }}
          >
            Shop by Style
          </h2>
        </div>
      </div>

      {/* ── 3-column image grid — FULL BLEED, caption lives below ── */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-px"
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
        {styles.map((style, i) => (
          <Link
            key={style.id}
            href={style.href}
            className={`group block reveal reveal-delay-${i + 1}`}
            style={{ background: "var(--paper-soft)" }}
          >
            {/* Photograph — unobstructed */}
            <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
              <Image
                src={style.image}
                alt={style.title}
                fill
                className="object-cover img-zoom"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {/* Accent line — hover only */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                style={{ background: "var(--gold)" }}
              />
            </div>

            {/* Caption — below the image, centered, minimal */}
            <div className="text-center" style={{ padding: "1.75rem 1.5rem 2.25rem" }}>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.62rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  marginBottom: "0.75rem",
                }}
              >
                {style.subtitle}
              </span>

              <h3
                className="font-serif"
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  lineHeight: 1.2,
                  color: "var(--ink)",
                  marginBottom: "1rem",
                }}
              >
                {style.title}
              </h3>

              <div
                className="inline-flex items-center gap-3 transition-all duration-300 group-hover:gap-4"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.65rem",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ink-muted)",
                }}
              >
                <span>Explore Style</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
