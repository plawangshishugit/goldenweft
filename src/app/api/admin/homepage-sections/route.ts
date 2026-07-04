import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/app/admin/_components/AdminAuth";

// Sections this endpoint manages. Each is a distinct group of editorial
// tiles on the homepage — "seasonal" = Seasonal Highlights, "style" = Shop by Style.
export const VALID_GROUPS = ["seasonal", "style"] as const;
export type SectionGroup = (typeof VALID_GROUPS)[number];

// GET /api/admin/homepage-sections?group=seasonal
export async function GET(req: Request) {
  await requireAdminAuth();
  const { searchParams } = new URL(req.url);
  const group = searchParams.get("group") ?? "seasonal";
  const prefix = `homepage_tile_${group}_`;

  const rows = await prisma.siteSetting.findMany({
    where: { key: { startsWith: prefix } },
    orderBy: { updatedAt: "asc" },
  });

  const tiles = rows
    .map((r) => ({ id: r.id, key: r.key, group, ...JSON.parse(r.value) }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return NextResponse.json(tiles);
}

// POST /api/admin/homepage-sections
export async function POST(req: Request) {
  await requireAdminAuth();
  const body = await req.json();
  const group: SectionGroup = body.group === "style" ? "style" : "seasonal";
  const prefix = `homepage_tile_${group}_`;

  const count = await prisma.siteSetting.count({
    where: { key: { startsWith: prefix } },
  });
  const key = `${prefix}${Date.now()}_${count}`;

  const { group: _g, ...rest } = body;
  const data = { ...rest, order: rest.order ?? count };

  const record = await prisma.siteSetting.create({
    data: { key, value: JSON.stringify(data) },
  });

  return NextResponse.json({ id: record.id, key, group, ...data });
}
