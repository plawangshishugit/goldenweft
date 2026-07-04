import Link from "next/link";

export default function ExportsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <div
        className="relative py-32 px-6 md:px-12 lg:px-16 overflow-hidden border-b border-[var(--color-border)]"
        style={{ background: `radial-gradient(ellipse 70% 60% at 80% 40%, rgba(184,145,47,0.1) 0%, transparent 60%), var(--color-ivory)` }}
      >
        <div className="max-w-[1400px] mx-auto relative">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
            <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-gold)]">Global Reach</span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-tight text-[var(--color-charcoal)] max-w-2xl">
            Exports &amp; Bulk Orders
          </h1>
          <p className="mt-5 text-[var(--ink-mid)] max-w-lg text-[0.975rem] leading-relaxed">
            GoldenWeft silks reach boutiques, designers, and collectors across India and internationally. We welcome serious bulk and export inquiries.
          </p>
        </div>
      </div>
      <div style={{ height: "1px", background: "var(--gold)", opacity: 0.4 }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <h2 className="font-serif text-[2rem] text-[var(--color-charcoal)] mb-6">Who We Work With</h2>
            <div className="space-y-5">
              {[
                { title: "Boutiques & Retailers", body: "Curated collections for stores that value authenticity and provenance over mass production." },
                { title: "Fashion Designers", body: "Yardage and custom weaves for designers who require specific textures, weights, and finishes." },
                { title: "Wedding Planners", body: "Bulk orders for trousseau, gifting, and ceremonial requirements with consistent quality." },
                { title: "International Importers", body: "Export-ready packaging and documentation for partners worldwide." },
              ].map((item) => (
                <div key={item.title} className="flex gap-5 p-6 border border-[var(--color-border)] hover:border-[var(--color-gold-muted)] transition-all duration-400">
                  <div className="w-[2px] bg-[var(--color-gold)] flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-[1rem] text-[var(--color-charcoal)] mb-1.5">{item.title}</h3>
                    <p className="text-[0.85rem] text-[var(--ink-mid)] leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--color-ivory-deep)] border border-[var(--color-gold-muted)] p-10 sticky top-28">
            <h3 className="font-serif text-[1.5rem] text-[var(--color-charcoal)] mb-3">Ready to discuss?</h3>
            <p className="text-[0.875rem] text-[var(--ink-mid)] mb-8 leading-relaxed">
              Tell us about your requirements. We'll respond within 24 hours with availability, pricing, and samples.
            </p>
            <Link
              href="/business/contact"
              className="btn-gold w-full justify-center py-4"
            >
              Submit a Business Inquiry
            </Link>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full justify-center py-4 mt-3"
            >
              WhatsApp Us Directly
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}