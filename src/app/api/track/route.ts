import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { type, productId, advisorSessionId } = await req.json();

    await prisma.conversionEvent.create({
      data: {
        type,
        productId,
        advisorSessionId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Tracking error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
