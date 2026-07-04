type StyleConfig = {
  label: string;
  dbValue: string;
  description: string;
};

// NOTE: `description` is deliberately typed as plain `string` (not a literal
// union via `as const`). Every entry below always has a non-empty value, so
// `as const` made TypeScript treat `config.description || fallback` as
// provably-always-truthy — which narrowed the `|| fallback` branch to
// `never` and broke `config.label` access inside it (TS2339). Keeping the
// values as `string` preserves identical runtime behaviour while keeping
// the type-checker accurate.
export const STYLES: Record<"traditional" | "modern" | "genz", StyleConfig> = {
  traditional: {
    label: "Traditional",
    dbValue: "Traditional",
    description: "Timeless handwoven classics",
  },
  modern: {
    label: "Modern",
    dbValue: "Contemporary",
    description: "Contemporary silk expressions",
  },
  genz: {
    label: "Gen Z",
    dbValue: "Elegant",
    description: "Light, expressive modern silks",
  },
};

export type StyleKey = keyof typeof STYLES;
