/**
 * One-time migration: rewrites legacy Order.status values to their
 * modern equivalents:
 *
 *   PENDING   -> CONFIRMED   (an order existing in the DB at all under
 *                              the old flow meant payment had already
 *                              been verified client-side, or it was COD)
 *   PAID      -> CONFIRMED
 *   COMPLETED -> DELIVERED
 *
 * Uses the raw MongoDB driver rather than Prisma. This matters here
 * specifically because Prisma validates enum values on READ — if this
 * migration were skipped, the new schema would still work (the old
 * values are kept in the OrderStatus enum precisely as a safety net,
 * see prisma/schema.prisma), but the admin/account UIs would keep
 * showing old orders with legacy styling forever. Running this once
 * converges everything to the clean new set.
 *
 * Safe to run multiple times — matches on the old values, so once an
 * order is migrated it's simply not touched again.
 *
 *   npx tsx scripts/migrateOrderStatus.ts
 */
import { loadEnv } from "./_env";
loadEnv();

import { MongoClient } from "mongodb";

const MIGRATIONS: { from: string; to: string }[] = [
  { from: "PENDING", to: "CONFIRMED" },
  { from: "PAID", to: "CONFIRMED" },
  { from: "COMPLETED", to: "DELIVERED" },
];

async function main() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error("DATABASE_URL is not set. Add it to .env or export it before running this script.");
  }

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db();
    const orders = db.collection("Order");

    let totalMigrated = 0;
    for (const { from, to } of MIGRATIONS) {
      const count = await orders.countDocuments({ status: from });
      if (count === 0) continue;

      const result = await orders.updateMany({ status: from }, { $set: { status: to } });
      console.log(`✅ ${from} -> ${to}: migrated ${result.modifiedCount} order(s)`);
      totalMigrated += result.modifiedCount;
    }

    if (totalMigrated === 0) {
      console.log("✅ Nothing to migrate — no orders were using a legacy status value.");
    } else {
      console.log(`\nDone. Migrated ${totalMigrated} order(s) in total.`);
    }

    // Orders placed before shipping addresses were collected will have no
    // shippingAddress at all — that's expected and handled gracefully by
    // the admin UI, but flag them here so nothing old-and-unfulfilled
    // gets missed.
    const withoutAddress = await orders.countDocuments({
      shippingAddress: { $exists: false },
      status: { $nin: ["DELIVERED", "CANCELLED", "REFUNDED"] },
    });
    if (withoutAddress > 0) {
      console.log(
        `\n⚠️  ${withoutAddress} order(s) are still open (not delivered/cancelled/refunded) and have no delivery address on file — these predate address collection. Contact those customers directly to get one, using the phone/email already on the order.`
      );
    }
  } finally {
    await client.close();
  }
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
