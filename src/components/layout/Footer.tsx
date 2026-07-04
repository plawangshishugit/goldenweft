import Link from "next/link";
import NewsletterForm from "./NewsletterForm";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#fff", borderTop: "1px solid #e8e8e8" }}>
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "4rem 2rem 3rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "3rem",
          }}
        >
          {/* Email signup — Prada has this left */}
          <div style={{ gridColumn: "span 1" }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.72rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#0a0a0a",
                marginBottom: "1.25rem",
              }}
            >
              Stay Close
            </p>
            <NewsletterForm />
            <div style={{ display: "flex", gap: "1.25rem", marginTop: "1.5rem" }}>
              {[
                {
                  label: "Instagram",
                  href: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
                  icon: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  ),
                },
                {
                  label: "WhatsApp",
                  href: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
                    ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hello%20GoldenWeft%2C%20I%20would%20like%20to%20know%20more%20about%20your%20silks.`
                    : undefined,
                  icon: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  href: process.env.NEXT_PUBLIC_LINKEDIN_URL,
                  icon: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  ),
                },
                {
                  label: "Telegram",
                  href: process.env.NEXT_PUBLIC_TELEGRAM_USERNAME
                    ? `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_USERNAME}`
                    : undefined,
                  icon: (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  ),
                },
              ]
                .filter((s) => !!s.href)
                .map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{ color: "#0a0a0a", display: "flex", transition: "color 200ms" }}
                    className="hover:opacity-60"
                  >
                    {s.icon}
                  </a>
                ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#0a0a0a", marginBottom: "1.25rem" }}>
              Explore
            </p>
            {[
              { href: "/collections", label: "Collections" },
              { href: "/seasons", label: "Seasons & Festivals" },
              { href: "/styles", label: "Shop by Style" },
              { href: "/find-your-silk", label: "Find Your Silk" },
              { href: "/collections/new-arrivals", label: "New Arrivals" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#555", marginBottom: "0.7rem", letterSpacing: "0.01em" }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Our Story */}
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#0a0a0a", marginBottom: "1.25rem" }}>
              Our Story
            </p>
            {[
              { href: "/legacy", label: "Our Legacy" },
              { href: "/about/sustainability", label: "Sustainability" },
              { href: "/about/craft-artisans", label: "Craft & Artisans" },
              { href: "/about", label: "About Us" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#555", marginBottom: "0.7rem" }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Business */}
          <div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.65rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "#0a0a0a", marginBottom: "1.25rem" }}>
              Business
            </p>
            {[
              { href: "/exports", label: "Exports & Bulk Orders" },
              { href: "/business", label: "Business Inquiries" },
              { href: "/business/contact", label: "Contact Us" },
              { href: "/wishlist", label: "Your Wishlist" },
            ].map((l) => (
              <Link key={l.href} href={l.href} style={{ display: "block", fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "#555", marginBottom: "0.7rem" }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            marginTop: "3rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid #e8e8e8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.7rem", color: "#aaa" }}>
            © {year} GoldenWeft · Bhagalpur, India
          </span>
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.65rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--gold)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span style={{ width: "16px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
            Handwoven Silks
          </span>
        </div>
      </div>
    </footer>
  );
}