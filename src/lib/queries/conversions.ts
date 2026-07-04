import { prisma } from "@/lib/prisma";

export async function getProductSignals(productId: string) {
  const [clicks, wishlists, inquiries] = await Promise.all([
    prisma.conversionEvent.count({
      where: { type: "advisor_click", productId },
    }),
    prisma.conversionEvent.count({
      where: { type: "wishlist", productId },
    }),
    prisma.conversionEvent.count({
      where: { type: "inquiry", productId },
    }),
  ]);

  return {
    clicks,
    wishlists,
    inquiries,
  };
}
