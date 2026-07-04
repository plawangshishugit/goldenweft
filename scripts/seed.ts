/**
 * Seed script — pushes all products from lib/products.ts into MongoDB
 * Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed.ts
 * Or add to package.json: "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' scripts/seed.ts"
 */

import { PrismaClient } from "@prisma/client";
import { PRODUCTS } from "../src/lib/products";

const prisma = new PrismaClient();

async function main() {
  console.log(`Seeding ${PRODUCTS.length} products...`);

  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: p.id },
      update: {
        name: p.name,
        description: p.description ?? null,
        fabric: p.fabric,
        weight: p.weight,
        style: p.style,
        tier: p.tier,
        tones: p.tones,
        occasions: p.occasions,
        price: p.price ?? 0,
        isNew: p.isNew ?? false,
        isActive: true,
        images: p.images ?? [],
      },
      create: {
        slug: p.id,
        name: p.name,
        description: p.description ?? null,
        fabric: p.fabric,
        weight: p.weight,
        style: p.style,
        tier: p.tier,
        tones: p.tones,
        occasions: p.occasions,
        price: p.price ?? 0,
        isNew: p.isNew ?? false,
        isActive: true,
        images: p.images ?? [],
      },
    });
    console.log(`  ✓ ${p.id}`);
  }

  console.log("\nDone! All products seeded.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
