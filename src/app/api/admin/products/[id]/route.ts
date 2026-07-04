import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/app/admin/_components/AdminAuth";

// PUT /api/admin/products/[id] — update product
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminAuth();
  const { id } = await params;
  const body = await req.json();

  const product = await prisma.product.update({
    where: { id },
    data: {
      slug: body.slug,
      name: body.name,
      description: body.description || null,
      fabric: body.fabric,
      weight: body.weight,
      style: body.style,
      tier: body.tier,
      tones: body.tones,
      occasions: body.occasions,
      price: Number(body.price),
      images: body.images ?? [],
      isNew: body.isNew ?? false,
      isFeatured: body.isFeatured ?? false,
      featuredOrder: Number(body.featuredOrder ?? 0),
      isActive: body.isActive ?? true,
      stock: Math.max(0, Math.floor(Number(body.stock ?? 0))),
    },
  });

  return NextResponse.json(product);
}

// DELETE /api/admin/products/[id] — delete product
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireAdminAuth();
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
