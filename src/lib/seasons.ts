export const SEASONS = {
  diwali: {
    label: "Diwali Collection",
    description: "Festive silks for Diwali celebrations.",
    match: ["Festival"], // ✅ Capital F
  },
  wedding: {
    label: "Wedding Collection",
    description: "Heirloom silks for weddings.",
    match: ["Wedding"],
  },
  durgapuja: {
    label: "Durga Puja Collection",
    description: "Traditional festive silks.",
    match: ["Festival"],
  },
} as const;
export type Season = keyof typeof SEASONS;