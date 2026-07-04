"use client";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  onClick,
  disabled,
  type = "button",
  className = "",
}: ButtonProps) {
  const base =
    "btn-luxury px-7 py-3.5 rounded-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none";

  const styles: Record<string, string> = {
    primary:
      "bg-[var(--color-charcoal)] text-[var(--color-ivory)] hover:opacity-80 shadow-[0_2px_20px_rgba(26,26,26,0.12)] hover:shadow-[0_4px_30px_rgba(184,145,47,0.25)]",
    secondary:
      "border border-[var(--color-charcoal)] text-[var(--color-charcoal)] hover:bg-[var(--color-charcoal)] hover:text-[var(--color-ivory)]",
    gold:
      "btn-primary-gold hover:bg-[var(--color-gold-light)] shadow-[0_2px_20px_rgba(184,145,47,0.2)] hover:shadow-[0_4px_30px_rgba(184,145,47,0.35)]",
    ghost:
      "text-[var(--color-charcoal)] hover:opacity-60 underline-offset-4",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
