import { prisma } from "../src/lib/prisma";
import crypto from "crypto";

/* ---------- Hash helper ---------- */
function hashAnswers(answers: Record<string, string>) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(answers))
    .digest("hex");
}

async function backfill() {
  console.log("🔄 Backfilling advisorSession.answersHash...");

  // ⬇️ Fetch ALL sessions (including ones without the field)
  const sessions = await prisma.advisorSession.findMany();

  let updated = 0;

  for (const session of sessions) {
    // @ts-ignore (Mongo documents may not have field)
    if (!session.answersHash) {
      const hash = hashAnswers(session.answers as Record<string, string>);

      await prisma.advisorSession.update({
        where: { id: session.id },
        data: { answersHash: hash },
      });

      updated++;
    }
  }

  console.log(`✅ Backfilled ${updated} sessions`);
}

backfill()
  .catch((e) => {
    console.error("❌ Backfill failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
