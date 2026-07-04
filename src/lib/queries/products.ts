import { prisma } from "@/lib/prisma";

export async function getNewArrivals(limit = 6) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      isNew: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getFeaturedProducts(limit = 6) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    orderBy: [
      { featuredOrder: "asc" },
      { createdAt: "desc" },
    ],
    take: limit,
  });
}
