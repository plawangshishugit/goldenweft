import { Product } from "./products";

export function buildWhatsAppMessage(data: {
  name: string;
  contact: string;
  message?: string;
  wishlist: Product[];
}) {
  const wishlistText =
    data.wishlist.length > 0
      ? data.wishlist
          .map(
            (p, i) =>
              `${i + 1}. ${p.name} (${p.fabric}, ${p.weight} drape)`
          )
          .join("\n")
      : "No items selected yet";

  return encodeURIComponent(`
Hello GoldenWeft,

My name is ${data.name}.
Contact: ${data.contact}

Message:
${data.message || "—"}

Wishlist:
${wishlistText}
  `.trim());
}
