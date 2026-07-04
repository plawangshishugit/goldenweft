/**
 * One-time backfill: gives every existing Product document a `stock`
 * value, since products created before this release have no such field
 * in MongoDB at all.
 *
 * Deliberately uses the raw MongoDB driver instead of Prisma — this
 * script needs to run safely regardless of whether `npx prisma generate`
 * has been run yet against the new schema, and a raw driver sidesteps
 * that ordering question entirely.
 *
 * Run this once, right after deploying the new schema and before
 * announcing the update to customers:
 *
 *   npx tsx scripts/backfillProductStock.ts
 *
 * The number it sets is a safe, conservative PLACEHOLDER — not your real
 * inventory. Go to /admin/products afterwards and correct the stock
 * count for each piece so nothing sells that you don't actually have.
 */
import { loadEnv } from "./_env";
loadEnv();

import { MongoClient } from "mongodb";

const PLACEHOLDER_STOCK = 8;

async function main() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error("DATABASE_URL is not set. Add it to .env or export it before running this script.");
  }

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db();
    const products = db.collection("Product");

    const totalProducts = await products.countDocuments({});
    const missingCount = await products.countDocuments({ stock: { $exists: false } });

    console.log(`Products in database: ${totalProducts}`);
    console.log(`Products missing a stock value: ${missingCount}`);

    if (missingCount === 0) {
      console.log("✅ Nothing to do — every product already has a stock value.");
      return;
    }

    const result = await products.updateMany(
      { stock: { $exists: false } },
      { $set: { stock: PLACEHOLDER_STOCK } }
    );

    console.log(`✅ Set stock=${PLACEHOLDER_STOCK} on ${result.modifiedCount} product(s).`);
    console.log("");
    console.log("⚠️  IMPORTANT: this is a safe placeholder, not your real inventory.");
    console.log("   Go to /admin/products now and set the real stock count for each");
    console.log("   piece — otherwise the store will think you have 8 of everything.");
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("❌ Backfill failed:", err);
  process.exit(1);
});
