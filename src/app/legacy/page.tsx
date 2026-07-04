import Link from "next/link";
import PageHero from "@/components/hero/PageHero";

const chapters = [
  {
    num: "I",
    title: "A Craft Older Than Time",
    body: `Known as the "Silk City of India," Bhagalpur's weaving tradition dates back hundreds of years. Families pass down looms, techniques, and sensibilities across generations — preserving a heritage that cannot be replicated by machines.`,
  },
  {
    num: "II",
    title: "Woven by Hands, Not Machines",
    body: "Every Bhagalpuri silk carries subtle variations — in texture, weave, and finish. These are not flaws. They are signatures of the artisan who wove it. Unlike factory-produced fabrics, handwoven silk responds to the weaver's rhythm, the climate, and the yarn itself.",
  },
  {
    num: "III",
    title: "Natural Fibres, Honest Materials",
    body: "Bhagalpuri silk is traditionally woven using natural fibres such as Tussar, Mulberry, and Ghicha. These silks are prized for their breathability, raw elegance, and graceful aging over time — becoming more beautiful with each wearing.",
  },
  {
    num: "IV",
    title: "Our Philosophy at GoldenWeft",
    body: "At GoldenWeft, we do not chase trends blindly. We curate silks that respect tradition while fitting modern lives — whether for ceremonies, celebrations, or quiet everyday elegance. We believe luxury is not about perfection, but about authenticity, intention, and longevity.",
  },
  {
    num: "V",
    title: "A Living Legacy",
    body: "When you choose Bhagalpuri silk, you are not just selecting a fabric. You are supporting an ecosystem of artisans, preserving a cultural heritage, and carrying forward a story that deserves to endure across generations.",
  },
];

export default function LegacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <PageHero page="/legacy" minHeight="55vh" />
      {/* Hero */}
      <div
        className="relative py-32 px-6 md:px-12 lg:px-16 overflow-hidden border-b border-[var(--color-border)]"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 30% 50%, rgba(184,145,47,0.08) 0%, transparent 60%), var(--color-ivory)`,
        }}
      >
        <div className="max-w-[1400px] mx-auto relative">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
            <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-gold)]">
              Our Heritage
            </span>
          </div>
          <h1 className="font-serif text-[clamp(2.8rem,7vw,6rem)] leading-[1.05] tracking-[-0.025em] text-[var(--color-charcoal)] max-w-3xl">
            The Legacy of
            <br />
            Bhagalpuri Silk
          </h1>
          <p className="mt-6 text-[0.975rem] text-[var(--ink-mid)] max-w-lg leading-relaxed">
            For centuries, Bhagalpur has been the heart of India's silk craftsmanship —
            where fabric is not manufactured, but woven with patience, skill, and human touch.
          </p>
        </div>
      </div>

      <div style={{ height: "1px", background: "var(--gold)", opacity: 0.4 }} />

      {/* Chapters */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-24">
        <div className="max-w-3xl mx-auto space-y-0">
          {chapters.map((chapter, i) => (
            <div
              key={chapter.num}
              className={`py-16 flex gap-12 items-start ${i < chapters.length - 1 ? "border-b border-[var(--color-border)]" : ""}`}
            >
              {/* Roman numeral */}
              <div className="font-serif text-[3.5rem] text-[var(--color-gold-muted)] leading-none flex-shrink-0 mt-1 select-none">
                {chapter.num}
              </div>

              <div>
                <h2 className="font-serif text-[1.7rem] leading-snug tracking-[-0.01em] text-[var(--color-charcoal)] mb-5">
                  {chapter.title}
                </h2>
                <p className="text-[0.975rem] leading-[1.85] text-[var(--ink-mid)]">
                  {chapter.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing pull quote */}
        <div className="max-w-2xl mx-auto mt-16 pt-16 border-t border-[var(--color-border)] text-center">
          <blockquote className="font-serif italic text-[1.5rem] leading-[1.5] text-[var(--color-charcoal)] mb-8">
            "The thread remembers what the machine forgets."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
            <span className="text-[0.6rem] tracking-[0.22em] uppercase text-[var(--color-gold)]">GoldenWeft</span>
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
          </div>

          <div className="mt-12">
            <Link
              href="/collections"
              className="btn-ghost inline-flex items-center gap-3"
            >
              Explore the Collection
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}