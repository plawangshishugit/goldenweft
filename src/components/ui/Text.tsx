type TextProps = {
  children: React.ReactNode;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "blockquote";
  className?: string;
  serif?: boolean;
};

export function Text({ children, as = "p", className = "", serif }: TextProps) {
  const Component = as;

  const baseStyles: Record<string, string> = {
    h1: "font-serif text-[clamp(2.6rem,6vw,5rem)] leading-[1.08] tracking-[-0.02em] font-medium",
    h2: "font-serif text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.12] tracking-[-0.015em] font-medium",
    h3: "font-serif text-[clamp(1.15rem,2vw,1.5rem)] leading-[1.3] font-medium",
    p: "text-[0.975rem] leading-[1.75] text-[var(--ink-mid)]",
    span: "",
    blockquote:
      "font-serif italic text-[1.35rem] leading-[1.5] text-[var(--ink-muted)] border-l-2 border-[var(--color-gold)] pl-6",
  };

  const serifOverride = serif ? "font-serif" : "";

  return (
    <Component className={`${baseStyles[as]} ${serifOverride} ${className}`}>
      {children}
    </Component>
  );
}
