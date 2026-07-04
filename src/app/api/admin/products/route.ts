import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminAuth } from "@/app/admin/_components/AdminAuth";

// GET /api/admin/products — list all products
export async function GET() {
  await requireAdminAuth();
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(products);
}

// POST /api/admin/products — create new product
export async function POST(req: Request) {
  await requireAdminAuth();
  const body = await req.json();

  const product = await prisma.product.create({
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

  return NextResponse.json(product, { status: 201 });
}
