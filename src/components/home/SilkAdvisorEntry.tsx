import Link from "next/link";

export default function SilkAdvisorEntry() {
  return (
    <section
      style={{ padding: "var(--space-section) 0", background: "var(--paper)", borderTop: "1px solid var(--color-border)" }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left — editorial pitch ── */}
          <div className="reveal">
            <p className="eyebrow mb-6">Personalised Advisory</p>

            <h2
              className="font-serif"
              style={{
                fontSize: "clamp(2rem, 4vw, 3.25rem)",
                fontWeight: 300,
                lineHeight: 1.1,
                color: "var(--ink)",
                letterSpacing: "-0.01em",
              }}
            >
              The silk that was{" "}
              <em style={{ color: "var(--gold)", fontStyle: "italic" }}>made</em>
              {" "}for you.
            </h2>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.9375rem",
                lineHeight: 1.85,
                color: "var(--ink-mid)",
                marginTop: "1.5rem",
                maxWidth: "34rem",
              }}
            >
              Not sure which weave suits your occasion, skin tone, or draping style?
              Our Silk Advisor asks the right questions and guides you to a silk that
              feels like it was crafted for you alone.
            </p>

            <div style={{ marginTop: "2.5rem" }}>
              <Link
                href="/find-your-silk"
                className="btn-primary inline-flex items-center gap-3"
              >
                Begin Your Silk Journey
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* ── Right — numbered steps ── */}
          <div className="space-y-3 reveal reveal-delay-2">
            {[
              { num: "01", title: "Tell us the occasion", body: "Wedding, festival, everyday — or something entirely personal." },
              { num: "02", title: "Share your preference", body: "Light and breathable, or richly structured? You decide the feel." },
              { num: "03", title: "Receive your match",   body: "A curated recommendation with the reason it suits you, personally." },
            ].map((step) => (
              <div
                key={step.num}
                className="flex gap-6 group"
                style={{
                  padding: "1.375rem 1.5rem",
                  borderBottom: "1px solid var(--color-border)",
                  transition: "border-color 300ms",
                }}
              >
                <div
                  className="font-serif flex-shrink-0"
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 300,
                    lineHeight: 1,
                    color: "var(--gold-ghost)",
                    marginTop: "0.15rem",
                    transition: "color 300ms",
                  }}
                >
                  {step.num}
                </div>
                <div>
                  <div
                    className="font-serif"
                    style={{ fontSize: "1rem", fontWeight: 400, color: "var(--ink)", marginBottom: "0.3rem" }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.85rem",
                      color: "var(--ink-muted)",
                      lineHeight: 1.65,
                    }}
                  >
                    {step.body}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
