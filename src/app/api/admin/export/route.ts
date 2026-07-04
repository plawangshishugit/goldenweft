import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  if (!type) {
    return new NextResponse("Missing export type", { status: 400 });
  }

  /* ---------- ADVISOR SESSIONS ---------- */
  if (type === "advisor_sessions") {
    const sessions = await prisma.advisorSession.findMany({
      orderBy: { createdAt: "desc" },
    });

    const csv = [
      ["Session ID", "Created At", "Answers"],
      ...sessions.map((s) => [
        s.id,
        s.createdAt.toISOString(),
        JSON.stringify(s.answers),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          'attachment; filename="advisor_sessions.csv"',
      },
    });
  }

  /* ---------- WISHLISTS ---------- */
  if (type === "wishlists") {
    const events = await prisma.conversionEvent.findMany({
      where: { type: "wishlist" },
      orderBy: { createdAt: "desc" },
    });

    const csv = [
      ["Product ID", "Advisor Session ID", "Created At"],
      ...events.map((e) => [
        e.productId ?? "",
        e.advisorSessionId ?? "",
        e.createdAt.toISOString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          'attachment; filename="wishlists.csv"',
      },
    });
  }

  /* ---------- INQUIRIES ---------- */
  if (type === "inquiries") {
    const events = await prisma.conversionEvent.findMany({
      where: { type: "inquiry" },
      orderBy: { createdAt: "desc" },
    });

    const csv = [
      ["Product ID", "Advisor Session ID", "Created At"],
      ...events.map((e) => [
        e.productId ?? "",
        e.advisorSessionId ?? "",
        e.createdAt.toISOString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          'attachment; filename="inquiries.csv"',
      },
    });
  }

  /* ---------- FALLBACK ---------- */
  return new NextResponse("Invalid export type", { status: 400 });
}
