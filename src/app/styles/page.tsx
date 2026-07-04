import Link from "next/link";
import PageHero from "@/components/hero/PageHero";
import { STYLES } from "@/lib/styles";

export default function StylesPage() {
  return (
    <div className="min-h-screen" style={{ background: "#fff" }}>
      <PageHero page="/styles" minHeight="55vh" />
      <div style={{ background: "#fff", padding: "6rem 1.5rem 4rem", borderBottom: "1px solid #e8e8e8" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <div style={{ height: "1px", width: "32px", background: "var(--gold)" }} />
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)", fontFamily: "var(--font-body)" }}>Curated by Aesthetic</span>
          </div>
          <h1 className="font-serif" style={{ fontSize: "clamp(2.5rem,6vw,5rem)", lineHeight: 1.05, color: "#0a0a0a", fontWeight: 300 }}>Shop by Style</h1>
          <p style={{ marginTop: "1.25rem", color: "var(--ink-mid)", maxWidth: "36rem", fontSize: "0.975rem", lineHeight: 1.75, fontFamily: "var(--font-body)" }}>
            Explore Bhagalpuri silks curated by aesthetic and lifestyle — from deep tradition to contemporary expression.
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-16">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1px", background: "#e8e8e8" }}>
          {Object.entries(STYLES).map(([key, config]) => (
            <Link
              key={key}
              href={`/styles/${key}`}
              className="card-lift group block"
              style={{ background: "#fff", padding: "2.5rem", position: "relative", overflow: "hidden", display: "block", transition: "background 200ms" }}
            >
              <h3 className="font-serif" style={{ fontSize: "1.4rem", color: "#0a0a0a", marginBottom: "0.75rem", fontWeight: 400 }}>{config.label}</h3>
              <p style={{ fontSize: "0.875rem", color: "var(--ink-mid)", lineHeight: 1.7, marginBottom: "2rem", fontFamily: "var(--font-body)" }}>{config.description || `Explore ${config.label.toLowerCase()} silks`}</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#0a0a0a", fontFamily: "var(--font-body)" }}>
                <span>Explore Style</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </div>
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "1px", background: "var(--gold)", transform: "scaleX(0)", transformOrigin: "left", transition: "transform 500ms" }} className="group-hover:scale-x-100" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}