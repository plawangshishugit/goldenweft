export function rankProducts(
  products: any[],
  answers: Record<string, string>
) {
  return products
    .map(product => {
      let score = 0;
      let reasons: string[] = [];

      if (product.occasions.includes(answers.occasion)) {
        score += 30;
        reasons.push("Matches occasion");
      }

      if (product.weight === answers.drape) {
        score += 20;
        reasons.push("Preferred drape");
      }

      if (product.style === answers.style) {
        score += 20;
        reasons.push("Style match");
      }

      if (product.tones.includes(answers.tone)) {
        score += 15;
        reasons.push("Tone match");
      }

      if (product.tier === answers.investment) {
        score += 15;
        reasons.push("Budget match");
      }

      return { product, score, reasons };
    })
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12); // always show enough
}
