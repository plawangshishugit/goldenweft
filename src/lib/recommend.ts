import { Product } from "./products";

type Answers = Record<string, string>;

export function scoreProduct(
  product: Product,
  answers: Answers
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Occasion
  if (answers.occasion && product.occasions.includes(mapOccasion(answers.occasion))) {
    score += 3;
    reasons.push("Suitable for your occasion");
  }

  // Drape / Weight
  if (answers.drape) {
    const map: Record<string, Product["weight"]> = {
      "Light & breathable": "Light",
      "Rich & structured": "Heavy",
      "Balanced & versatile": "Medium",
    };
    if (product.weight === map[answers.drape]) {
      score += 2;
      reasons.push("Matches your comfort preference");
    }
  }

  // Style
  if (answers.style && product.style === mapStyle(answers.style)) {
    score += 2;
    reasons.push("Alignes with your style");
  }

  // Tone
  if (answers.tone && product.tones.includes(answers.tone as any)) {
    score += 1;
    reasons.push("Complements your undertone");
  }

  // Investment
  if (answers.investment) {
    const map: Record<string, Product["tier"]> = {
      "Everyday luxury": "Everyday",
      "Occasion special": "Occasion",
      "Heirloom piece": "Heirloom",
    };
    if (product.tier === map[answers.investment]) {
      score += 2;
      reasons.push("Fits your investment preference");
    }
  }

  return { score, reasons };
}

function mapOccasion(value: string): Product["occasions"][number] {
  if (value.includes("Wedding")) return "Wedding";
  if (value.includes("Festival")) return "Festival";
  if (value.includes("Everyday")) return "Everyday";
  return "Gift";
}

function mapStyle(value: string): Product["style"] {
  if (value.includes("Traditional")) return "Traditional";
  if (value.includes("Elegant")) return "Elegant";
 
  return "Contemporary";
}
