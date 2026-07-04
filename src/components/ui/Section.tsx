export function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`py-[var(--space-section)] px-6 md:px-12 lg:px-16 max-w-[1400px] mx-auto ${className}`}
    >
      {children}
    </section>
  );
}
