import { prisma } from "../src/lib/prisma";

/**
 * One-time seed for the two homepage editorial sections:
 *   - "Seasonal Highlights" (CoreSeasons.tsx)
 *   - "Shop by Style" (ShopByStyle.tsx)
 *
 * Carries over the original titles/subtitles/links from the previous
 * hardcoded arrays, but leaves `image` blank so it's obvious in
 * /admin/homepage which tiles still need a real photo uploaded —
 * rather than silently pointing at files that were never added to the
 * project (which is what caused the broken-image layout before).
 *
 * Safe to re-run: skips any group that already has tiles.
 *
 * Run with: npx tsx scripts/seedHomepageTiles.ts
 */

const SEASONAL_TILES = [
  { title: "Wedding Season", subtitle: "Eternal", href: "/seasons/wedding" },
  { title: "Diwali Edit", subtitle: "Festive", href: "/seasons/diwali" },
  { title: "Durga Puja", subtitle: "Sacred", href: "/seasons/durgapuja" },
  { title: "New Arrivals", subtitle: "Just In", href: "/collections/new-arrivals" },
];

const STYLE_TILES = [
  { title: "Traditional Indian", subtitle: "Rooted in Heritage", href: "/styles/traditional" },
  { title: "Modern Elegance", subtitle: "Refined & Contemporary", href: "/styles/modern" },
  { title: "Gen Z Edit", subtitle: "Bold & Expressive", href: "/styles/genz" },
];

async function seedGroup(group: "seasonal" | "style", items: typeof SEASONAL_TILES) {
  const prefix = `homepage_tile_${group}_`;
  const existing = await prisma.siteSetting.count({
    where: { key: { startsWith: prefix } },
  });

  if (existing > 0) {
    console.log(`⏭  Skipping "${group}" — ${existing} tile(s) already exist.`);
    return;
  }

  for (let i = 0; i < items.length; i++) {
    const key = `${prefix}${Date.now()}_${i}`;
    await prisma.siteSetting.create({
      data: {
        key,
        value: JSON.stringify({ ...items[i], image: "", order: i }),
      },
    });
  }

  console.log(`✅ Seeded ${items.length} tile(s) for "${group}".`);
}

async function run() {
  console.log("🌱 Seeding homepage section tiles...");
  await seedGroup("seasonal", SEASONAL_TILES);
  await seedGroup("style", STYLE_TILES);
  console.log("Done. Visit /admin/homepage to upload real photos for each tile.");
}

run()
  .catch((e) => {
    console.error("❌ Seed failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
