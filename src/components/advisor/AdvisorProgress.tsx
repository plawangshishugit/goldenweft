export default function AdvisorProgress({ current, total }: { current: number; total: number }) {
  const percent = Math.min(100, Math.round((current / total) * 100));

  return (
    <div className="w-full px-6 md:px-12 lg:px-16 pt-8 pb-2">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[0.6rem] tracking-[0.18em] uppercase text-[var(--ink-muted)]">
            Step {current} of {total}
          </span>
          <span className="text-[0.6rem] tracking-[0.18em] uppercase text-[var(--color-gold)]">
            {percent}%
          </span>
        </div>
        <div className="w-full h-[2px] bg-[var(--color-border)]">
          <div
            className="h-[2px] bg-[var(--color-gold)] transition-all duration-500"
            style={{ width: `${percent}%`, transitionTimingFunction: "var(--ease-silk)" }}
          />
        </div>
      </div>
    </div>
  );
}
