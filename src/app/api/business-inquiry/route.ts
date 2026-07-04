import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, company, email, message, website } = await req.json();

    /* 🕵️ Honeypot */
    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    /* 🌐 Get IP */
    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "unknown";

    /* 🚦 Rate limiting (BEFORE insert) */
    const lastHour = new Date(Date.now() - 60 * 60 * 1000);

    const recentCount = await prisma.businessInquiry.count({
      where: {
        ip,
        createdAt: { gte: lastHour },
      },
    });

    if (recentCount >= 5) {
      return NextResponse.json(
        { error: "Too many requests. Please try later." },
        { status: 429 }
      );
    }

    /* 💾 Store inquiry */
    await prisma.businessInquiry.create({
      data: {
        name,
        company,
        email,
        message,
        ip, // ✅ IMPORTANT
      },
    });

    /* 📩 Email transporter */
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.BUSINESS_EMAIL,
        pass: process.env.BUSINESS_EMAIL_PASSWORD,
      },
    });

    /* 📬 Internal email */
    await transporter.sendMail({
      from: `"GoldenWeft Business" <${process.env.BUSINESS_EMAIL}>`,
      to: process.env.BUSINESS_EMAIL,
      subject: "New Business Inquiry – GoldenWeft",
      text: `
Name: ${name}
Company: ${company || "N/A"}
Email: ${email}

Message:
${message}
      `,
    });

    /* 🤖 Auto-reply */
    await transporter.sendMail({
      from: `"GoldenWeft" <${process.env.BUSINESS_EMAIL}>`,
      to: email,
      subject: "We received your inquiry – GoldenWeft",
      text: `
Hi ${name},

Thank you for reaching out to GoldenWeft.

We’ve received your inquiry and our team will respond within 24–48 hours.

Your message:
--------------------------------
${message}
--------------------------------

Warm regards,
GoldenWeft Team
Bhagalpur, India
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Business inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
