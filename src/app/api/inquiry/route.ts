import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInquiryEmail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, contact, message, wishlist } = body;

    if (!name || !contact) {
      return NextResponse.json(
        { success: false, error: "Name and contact are required" },
        { status: 400 }
      );
    }

    // 1. Track conversion event in DB
    await prisma.conversionEvent.create({
      data: {
        type: "inquiry",
        productId: wishlist?.[0]?.id ?? null,
      },
    });

    // 2. Send email notification
    await sendInquiryEmail({
      name,
      contact,
      message,
      wishlist: wishlist ?? [],
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Inquiry error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
