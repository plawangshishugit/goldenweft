export default function CraftArtisansPage() {
  return (
    <div className="min-h-screen bg-[var(--color-ivory)]">
      <div className="bg-[var(--color-ivory)] py-28 px-6 md:px-12 lg:px-16 border-b border-[var(--color-border)]">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
            <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-gold)]">The Weavers</span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,6vw,5rem)] leading-tight text-[var(--color-charcoal)]">Craft & Artisans</h1>
          <p className="mt-5 text-[var(--ink-mid)] max-w-lg text-[0.975rem] leading-relaxed">
            Behind every GoldenWeft silk is a master weaver. Their hands, their rhythm, their knowledge — passed down and irreplaceable.
          </p>
        </div>
      </div>
      <div style={{ height: "1px", background: "var(--gold)", opacity: 0.4 }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-20">
        <div className="max-w-2xl space-y-10">
          {[
            { title: "The Handloom", body: "Each silk begins on a traditional pit loom or frame loom — tools that have remained largely unchanged for centuries. The weaver's feet and hands work in unison, creating a rhythm unique to each person." },
            { title: "The Weavers", body: "Our artisan partners are master craftspeople from weaving families in and around Bhagalpur. Many have been weaving since childhood, learning from parents and grandparents who built their livelihoods on the loom." },
            { title: "The Time", body: "A single sari can take three to seven days to complete. There is no shortcut, and we do not ask for one. The time invested is what makes each piece worth keeping for generations." },
          ].map((sec) => (
            <div key={sec.title} className="flex gap-8 pb-10 border-b border-[var(--color-border)] last:border-0">
              <div className="w-1 bg-[var(--color-gold)] flex-shrink-0 rounded" />
              <div>
                <h2 className="font-serif text-[1.5rem] text-[var(--color-charcoal)] mb-4">{sec.title}</h2>
                <p className="text-[0.975rem] text-[var(--ink-mid)] leading-[1.85]">{sec.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
