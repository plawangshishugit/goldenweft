import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <div className="bg-[var(--color-ivory)] py-28 px-6 md:px-12 lg:px-16 border-b border-[var(--color-border)]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
            <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-gold)]">Who We Are</span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-tight text-[var(--color-charcoal)]">
            About GoldenWeft
          </h1>
        </div>
      </div>
      <div style={{ height: "1px", background: "var(--gold)", opacity: 0.4 }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-20">
        <div className="max-w-2xl">
          <p className="font-serif italic text-[1.25rem] leading-relaxed text-[var(--ink-muted)] mb-8 border-l-2 border-[var(--color-gold)] pl-6">
            GoldenWeft represents the heritage of Bhagalpuri silk — crafted with patience, tradition, and respect for artisans.
          </p>
          <p className="text-[0.975rem] leading-[1.85] text-[var(--ink-mid)] mb-6">
            We are a silk house rooted in Bhagalpur, Bihar — the city that has gifted India its finest handwoven silks for centuries. Every piece in our collection is a result of close collaboration with master weavers who have inherited their craft through generations.
          </p>
          <p className="text-[0.975rem] leading-[1.85] text-[var(--ink-mid)] mb-12">
            At GoldenWeft, luxury is not about perfection — it is about authenticity, intention, and longevity. We curate silks that respect tradition while fitting the lives and occasions of today.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { href: "/legacy", label: "Our Legacy", desc: "The history of Bhagalpuri silk." },
              { href: "/about/sustainability", label: "Sustainability", desc: "How we care for artisans and the earth." },
              { href: "/about/craft-artisans", label: "Craft & Artisans", desc: "The hands behind every weave." },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group block border border-[var(--color-border)] p-6 hover:border-[var(--color-gold-muted)] transition-all duration-400 card-lift"
              >
                <h3 className="font-serif text-[1.05rem] text-[var(--color-charcoal)] mb-2 group-hover:opacity-60 transition-colors duration-300">{link.label}</h3>
                <p className="text-[0.8rem] text-[var(--ink-mid)]">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
