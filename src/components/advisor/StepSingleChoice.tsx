"use client";

const CONFIG: Record<string, { question: string; subtitle?: string; options: string[] }> = {
  occasion: {
    question: "What is this silk for?",
    subtitle: "Choose the occasion that best fits your purpose.",
    options: ["Wedding", "Festival", "Everyday", "Gifting", "Special Event"],
  },
  drape: {
    question: "How would you like the silk to feel?",
    subtitle: "The drape and weight of a silk shapes how it moves and feels.",
    options: ["Light & breathable", "Balanced & versatile", "Rich & structured"],
  },
  style: {
    question: "Which style feels most like you?",
    subtitle: "Your aesthetic guides the weave and motif selection.",
    options: ["Traditional", "Elegant", "Contemporary", "Bold"],
  },
  tone: {
    question: "Which tones suit your complexion?",
    subtitle: "Certain silk tones complement warm, cool, and neutral undertones beautifully.",
    options: ["Warm", "Cool", "Neutral"],
  },
  investment: {
    question: "How would you like to invest?",
    subtitle: "Each tier reflects a different level of craftsmanship and longevity.",
    options: ["Everyday luxury", "Occasion special", "Heirloom piece"],
  },
};

export default function StepSingleChoice({
  step,
  onSelect,
  onBack,
}: {
  step: keyof typeof CONFIG;
  onSelect: (key: string, value: string) => void;
  onBack: () => void;
}) {
  const data = CONFIG[step];
  if (!data) return null;

  return (
    <div className="min-h-[80vh] flex items-center">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-12 w-full">
        <div className="max-w-lg">
          <h2 className="font-serif text-[clamp(1.7rem,3.5vw,2.6rem)] leading-[1.1] tracking-[-0.015em] text-[var(--color-charcoal)] mb-2">
            {data.question}
          </h2>
          {data.subtitle && (
            <p className="text-[0.875rem] text-[var(--ink-mid)] mb-9">{data.subtitle}</p>
          )}

          <div className="grid gap-3 mt-8">
            {data.options.map((opt) => (
              <button
                key={opt}
                onClick={() => onSelect(step, opt)}
                className="group text-left px-7 py-4 border border-[var(--color-border)] bg-white hover:border-[var(--color-gold)] hover:bg-[var(--color-gold-muted)] transition-all duration-300 flex items-center justify-between"
              >
                <span className="font-serif text-[1.05rem] text-[var(--color-charcoal)] group-hover:opacity-60 transition-colors duration-300">
                  {opt}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-[var(--color-border-mid)] group-hover:opacity-60 transition-all duration-300 group-hover:translate-x-1"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>

          <button
            onClick={onBack}
            className="mt-8 text-[0.7rem] tracking-[0.15em] uppercase text-[var(--ink-muted)] hover:text-[var(--color-charcoal)] transition-colors duration-300 flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
