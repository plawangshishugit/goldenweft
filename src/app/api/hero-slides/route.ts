import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? "/";
  const prefix = `hero_slide_${encodeURIComponent(page)}_`;
  const slides = await prisma.siteSetting.findMany({
    where: { key: { startsWith: prefix } },
    orderBy: { updatedAt: "asc" },
  });
  const active = slides
    .map(s => { try { return { id: s.id, ...JSON.parse(s.value) }; } catch { return null; } })
    .filter((s): s is NonNullable<typeof s> => s !== null && s.active !== false);
  return NextResponse.json(active);
}