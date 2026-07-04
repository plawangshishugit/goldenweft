import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ UNWRAP params
    const { id } = await params;

    await prisma.businessInquiry.update({
      where: { id },
      data: { resolved: true },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Resolve inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to mark inquiry resolved" },
      { status: 500 }
    );
  }
}
