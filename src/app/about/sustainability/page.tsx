const values = [
  {
    title: "Ethical Artisan Wages",
    body: "Every weaver we work with is paid fairly — wages that reflect the skill, time, and heritage embodied in their craft. We believe the cost of a fabric must first account for the hands that made it.",
  },
  {
    title: "Natural Fibres Only",
    body: "We work exclusively with Tussar, Ghicha, and Mulberry — fibres derived from natural sources. No synthetic blends. No shortcuts that compromise the integrity of the weave.",
  },
  {
    title: "Small-Batch Production",
    body: "We deliberately limit output to prevent overproduction. Each batch is crafted with intention, not for volume. This is not a constraint — it is a choice.",
  },
  {
    title: "Preserving the Handloom",
    body: "By purchasing from GoldenWeft, you support the continued existence of handloom culture in Bhagalpur. Every order sustains an artisan family and keeps a loom alive.",
  },
];

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <div className="bg-[var(--color-ivory)] py-28 px-6 md:px-12 lg:px-16 border-b border-[var(--color-border)]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
            <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-gold)]">Our Responsibility</span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-tight text-[var(--color-charcoal)]">Sustainability</h1>
          <p className="mt-5 text-[var(--ink-mid)] max-w-lg text-[0.975rem] leading-relaxed">
            Craft and conscience, woven together. Our approach to sustainability is not a marketing posture — it is inseparable from the way we work.
          </p>
        </div>
      </div>
      <div style={{ height: "1px", background: "var(--gold)", opacity: 0.4 }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
          {values.map((v, i) => (
            <div key={v.title} className="p-8 border border-[var(--color-border)] bg-white hover:border-[var(--color-gold-muted)] transition-all duration-400 card-lift">
              <div className="w-8 h-[2px] bg-[var(--color-gold)] mb-5" />
              <h3 className="font-serif text-[1.2rem] text-[var(--color-charcoal)] mb-3">{v.title}</h3>
              <p className="text-[0.875rem] text-[var(--ink-mid)] leading-[1.8]">{v.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
