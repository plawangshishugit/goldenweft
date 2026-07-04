import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/app/admin/_components/AdminAuth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminAuth();
  const { id } = await params;
  const body = await req.json();
  const { page: _p, id: _id, key: _k, ...rest } = body;
  await prisma.siteSetting.update({ where: { id }, data: { value: JSON.stringify(rest) } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminAuth();
  const { id } = await params;
  await prisma.siteSetting.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}