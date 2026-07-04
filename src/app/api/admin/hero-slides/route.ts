import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/app/admin/_components/AdminAuth";

// GET /api/admin/hero-slides?page=/collections
export async function GET(req: Request) {
  await requireAdminAuth();
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "/";
  const prefix = `hero_slide_${encodeURIComponent(page)}_`;
  const slides = await prisma.siteSetting.findMany({
    where: { key: { startsWith: prefix } },
    orderBy: { updatedAt: "asc" },
  });
  return NextResponse.json(
    slides.map(s => ({ id: s.id, key: s.key, page, ...JSON.parse(s.value) }))
  );
}

// POST /api/admin/hero-slides
export async function POST(req: Request) {
  await requireAdminAuth();
  const body = await req.json();
  const page = body.page ?? "/";
  const prefix = `hero_slide_${encodeURIComponent(page)}_`;
  const count = await prisma.siteSetting.count({ where: { key: { startsWith: prefix } } });
  const key = `${prefix}${Date.now()}_${count}`;
  const { page: _p, ...rest } = body;
  const record = await prisma.siteSetting.create({
    data: { key, value: JSON.stringify(rest) },
  });
  return NextResponse.json({ id: record.id, key, page, ...rest });
}