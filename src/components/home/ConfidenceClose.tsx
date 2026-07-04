"use client";

const signals = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: "Chosen by Families",
    description: "Trusted for weddings, rituals, and moments that carry deep personal meaning across generations.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: "Preferred by Designers",
    description: "Selected for its texture, depth, and character in bespoke creations and couture collections.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
    title: "Collected Worldwide",
    description: "Appreciated by clients across India, the Gulf, Europe, and international diaspora communities.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    title: "Crafted with Integrity",
    description: "Every piece reflects ethical handloom practices, fair artisan wages, and respect for the craft.",
  },
];

export default function ConfidenceClose() {
  return (
    <section style={{ background: "var(--paper-soft)", padding: "var(--space-section) 0" }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16">

        {/* ── Header ── */}
        <div className="text-center mb-16 reveal">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div style={{ width: "32px", height: "1px", background: "var(--gold)" }} />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.6rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "var(--gold)",
              }}
            >
              Why GoldenWeft
            </span>
            <div style={{ width: "32px", height: "1px", background: "var(--gold)" }} />
          </div>

          <h2
            className="font-serif"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              fontWeight: 300,
              lineHeight: 1.08,
              color: "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            Why people choose GoldenWeft
          </h2>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.9rem",
              color: "var(--ink-mid)",
              maxWidth: "32rem",
              margin: "1rem auto 0",
              lineHeight: 1.75,
            }}
          >
            Not for trends — but for meaning, craftsmanship, and the quiet
            confidence that comes from wearing something authentic.
          </p>
        </div>

        {/* ── 4-column grid ── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: "var(--color-border)" }}
        >
          {signals.map((signal, i) => (
            <div
              key={signal.title}
              className={`p-10 reveal reveal-delay-${i + 1}`}
              style={{
                background: "var(--paper-soft)",
                transition: "background 300ms",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--paper)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--paper-soft)"; }}
            >
              <div style={{ color: "var(--gold)", marginBottom: "1.5rem" }}>
                {signal.icon}
              </div>
              <h3
                className="font-serif"
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 400,
                  color: "var(--ink)",
                  marginBottom: "0.875rem",
                  lineHeight: 1.3,
                }}
              >
                {signal.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.82rem",
                  color: "var(--ink-muted)",
                  lineHeight: 1.8,
                }}
              >
                {signal.description}
              </p>
            </div>
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div
          className="text-center reveal"
          style={{
            marginTop: "5rem",
            paddingTop: "4rem",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <p
            className="font-serif"
            style={{
              fontSize: "1.35rem",
              fontWeight: 300,
              fontStyle: "italic",
              color: "var(--ink-muted)",
              marginBottom: "2rem",
            }}
          >
            "A silk that endures is a silk that matters."
          </p>
          <a
            href="/collections"
            className="btn-ghost inline-flex items-center gap-3"
          >
            Begin Exploring
          </a>
        </div>
      </div>
    </section>
  );
}