import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Revised GoldenWeft palette ── */
        paper:       "#FFFFFF",
        "paper-soft": "#F4F4F4",
        ink:         "#0D0B09",
        "ink-mid":   "#4A4540",
        "ink-muted": "#8A847C",
        gold:        "#9B7B36",
        "gold-pale": "#C0965A",
        "gold-ghost": "#DDD0A8",

        /* Legacy names — kept for any non-updated component refs */
        ivory:       "#FFFFFF",
        "ivory-deep": "#F4F4F4",
        charcoal:    "#0D0B09",
        "gold-light": "#C0965A",
        "gold-muted": "#DDD0A8",
        /* Neutralized — no longer clash */
        maroon:      "#2A1F16",
        indigo:      "#1B2130",
        sage:        "#6A655E",
        taupe:       "#8A847C",
        smoke:       "#4A4540",
      },
      fontFamily: {
        serif:   ["Cormorant Garamond", "serif"],
        sans:    ["Inter", "sans-serif"],
        display: ["Cormorant Garamond", "serif"],
      },
      spacing: {
        section: "8rem",
        gap:     "3rem",
        18:      "4.5rem",
      },
      borderRadius: {
        soft: "0px",   /* Prada uses zero radius */
      },
      transitionTimingFunction: {
        silk:   "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        emerge: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
      },
      animation: {
        "fade-up": "fadeUp 0.8s var(--ease-emerge) both",
        "fade-in": "fadeIn 0.6s ease both",
        shimmer:   "shimmer 6s linear infinite",
        marquee:   "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
