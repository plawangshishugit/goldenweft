"use client";

export default function StepIntro({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-[80vh] flex items-center">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 py-20 w-full">
        <div className="max-w-xl">
          <div className="flex items-center gap-4 mb-7">
            <div className="h-[1px] w-8 bg-[var(--color-gold)]" />
            <span className="text-[0.65rem] tracking-[0.22em] uppercase text-[var(--color-gold)]">Personalised Advisory</span>
          </div>

          <h1 className="font-serif text-[clamp(2.5rem,5vw,4rem)] leading-[1.1] tracking-[-0.02em] text-[var(--color-charcoal)] mb-6">
            Find Your Silk
          </h1>

          <p className="text-[1rem] leading-[1.8] text-[var(--ink-mid)] mb-3">
            A short, thoughtful guide to help us recommend silks that suit your occasion, comfort, and personal style.
          </p>
          <p className="text-[0.85rem] text-[var(--ink-muted)] mb-12">
            Takes about 60 seconds. You can change any answer as you go.
          </p>

          <button
            onClick={onNext}
            className="btn-gold inline-flex items-center gap-3"
          >
            Begin Your Silk Journey
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}