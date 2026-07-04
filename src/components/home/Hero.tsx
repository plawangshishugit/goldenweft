import PageHero from "@/components/hero/PageHero";
import Link from "next/link";

// Fallback shown when no slides are set for home
function FallbackHero() {
  return (
    <section style={{
      position: "relative", minHeight: "92vh", overflow: "hidden",
      background: "#1a1510", display: "flex", alignItems: "flex-end",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(155,123,54,0.06) 2px,rgba(155,123,54,0.06) 3px)`,
      }} />
      <div style={{ position: "relative", zIndex: 10, width: "100%", textAlign: "center", paddingBottom: "5rem" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.6rem", letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(155,123,54,0.7)", marginBottom: "1rem" }}>
          The Handloom Edit
        </p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.8rem,7vw,6.5rem)", fontWeight: 700, color: "#fff", marginBottom: "1.5rem", lineHeight: 1 }}>
          Woven in Bhagalpur
        </h1>
        <Link href="/collections" style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff", textDecoration: "underline", textUnderlineOffset: "5px" }}>
          Explore Collections
        </Link>
      </div>
      {/* Admin hint */}
      <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 20, background: "rgba(155,123,54,0.15)", border: "1px solid var(--gold)", color: "var(--gold)", fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.1em", padding: "0.5rem 0.875rem" }}>
        No hero media · <a href="/admin/hero" style={{ color: "var(--gold)", textDecoration: "underline" }}>Add in admin ↗</a>
      </div>
    </section>
  );
}

export default function Hero() {
  return <PageHero page="/" minHeight="92vh" fallback={<FallbackHero />} />;
}