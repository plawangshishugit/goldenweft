import Link from "next/link";

export default function BusinessPage() {
  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <div className="bg-[var(--color-ivory)] py-28 px-6 md:px-12 lg:px-16 border-b border-[var(--color-border)]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
            <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-gold)]">Trade & Commerce</span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-tight text-[var(--color-charcoal)]">Business</h1>
          <p className="mt-5 text-[var(--ink-mid)] max-w-lg text-[0.975rem] leading-relaxed">
            GoldenWeft partners with boutiques, designers, and global buyers for premium silk sourcing and bulk export.
          </p>
        </div>
      </div>
      <div style={{ height: "1px", background: "var(--gold)", opacity: 0.4 }} />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mb-10">
          <Link href="/exports" className="card-lift group block p-8 border border-[var(--color-border)] bg-white hover:border-[var(--color-gold-muted)]">
            <h3 className="font-serif text-[1.2rem] text-[var(--color-charcoal)] mb-2 group-hover:opacity-60 transition-colors duration-300">Exports & Bulk Orders</h3>
            <p className="text-[0.85rem] text-[var(--ink-mid)]">Premium silk sourcing for retailers, designers, and international importers.</p>
          </Link>
          <Link href="/business/contact" className="card-lift group block p-8 border border-[var(--color-border)] bg-white hover:border-[var(--color-gold-muted)]">
            <h3 className="font-serif text-[1.2rem] text-[var(--color-charcoal)] mb-2 group-hover:opacity-60 transition-colors duration-300">Business Contact</h3>
            <p className="text-[0.85rem] text-[var(--ink-mid)]">Submit a trade inquiry. We respond within 24 hours.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
