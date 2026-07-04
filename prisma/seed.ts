import { prisma } from "../src/lib/prisma";
import { PRODUCTS } from "../src/lib/products";

async function main() {
  console.log("🌱 Seeding products...");

  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.id },

      // ⚠️ Existing products are intentionally NOT touched here.
      // Once a product exists, its photos, featured status, and other
      // admin-curated fields (uploaded via /admin/products) are the
      // source of truth — this script must never overwrite them on
      // re-run. If you need to update text fields like price/name on
      // an existing product, do it through /admin/products, not here.
      update: {},

      create: {
        slug: product.id,
        name: product.name,
        description: product.description ?? "",
        fabric: product.fabric,
        weight: product.weight,
        style: product.style,
        tier: product.tier,
        tones: product.tones,
        occasions: product.occasions,
        price: product.price ?? 0,
        isNew: product.isNew ?? false,
        isActive: true,
        images: product.images ?? [],
        // Conservative starting count for a brand-new, freshly-seeded
        // product — these are handwoven, limited pieces, not mass
        // inventory. Adjust the real count any time via /admin/products.
        // Existing products are untouched (see `update: {}` above), so
        // this never overwrites a merchant-set stock count on re-run.
        stock: 8,
      },
    });
  }

  console.log("✅ Seeding complete (only created products that were missing — existing products and their photos were left untouched)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
