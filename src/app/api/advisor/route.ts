import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { rankProducts } from "@/lib/advisorEngine";

/* ---------- Hash helper ---------- */
function hashAnswers(answers: Record<string, string>) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(answers))
    .digest("hex");
}

export async function POST(req: Request) {
  try {
    const { answers } = await req.json();

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Invalid answers payload" },
        { status: 400 }
      );
    }

    /* ---------- 0. Compute hash ---------- */
    const answersHash = hashAnswers(answers);

    /* =====================================================
       1. CHECK CACHE (AdvisorSession)
    ===================================================== */
    const cachedSession = await prisma.advisorSession.findFirst({
      where: { answersHash },
    });

    let recommendations: any[];
    let advisorSessionId: string | null;
    let cached: boolean;

    if (cachedSession) {
      // Scoring/ranking is stable enough to cache, but stock and active
      // status are not — they're refreshed live below regardless of
      // whether this request hit the cache, so a recommendation surfaced
      // yesterday never shows yesterday's inventory.
      recommendations = cachedSession.recommendations as any[];
      advisorSessionId = cachedSession.id;
      cached = true;
    } else {
      recommendations = await computeRecommendations(answers);
      const session = await prisma.advisorSession.create({
        data: { answers, answersHash, recommendations },
      });
      advisorSessionId = session.id;
      cached = false;
    }

    if (recommendations.length === 0) {
      return NextResponse.json({ advisorSessionId, recommendations: [], cached });
    }

    /* =====================================================
       Live enrichment: current stock + active status, applied
       uniformly whether recommendations came from cache or not.
    ===================================================== */
    const ids = recommendations.map((r) => r?.product?.id).filter(Boolean);
    const liveProducts = await prisma.product.findMany({
      where: { slug: { in: ids } },
      select: { slug: true, stock: true, isActive: true },
    });
    const liveBySlug = new Map<string, { stock: number; isActive: boolean }>(
      liveProducts.map((p: any) => [p.slug, { stock: p.stock ?? 0, isActive: p.isActive }])
    );

    const enriched = recommendations
      .map((r) => {
        const live = liveBySlug.get(r?.product?.id);
        if (!live || !live.isActive) return null; // no longer sold — don't recommend it
        return { ...r, product: { ...r.product, stock: live.stock } };
      })
      .filter(Boolean);

    return NextResponse.json({ advisorSessionId, recommendations: enriched, cached });
  } catch (err) {
    console.error("Advisor route error:", err);
    return NextResponse.json(
      { error: "Advisor failed" },
      { status: 500 }
    );
  }
}

/** Fresh recommendation computation — ML service first, local scoring as
 *  fallback. Extracted so the route can call it once and then apply the
 *  same live-stock enrichment regardless of cache hit/miss. */
async function computeRecommendations(answers: Record<string, string>): Promise<any[]> {
  const products = await prisma.product.findMany({ where: { isActive: true } });
  if (products.length === 0) return [];

  try {
    if (!process.env.ML_SERVICE_URL) throw new Error("ML_SERVICE_URL not set");

    const mlRes = await fetch(
      `${process.env.ML_SERVICE_URL}/recommend`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          products: products.map((p) => ({
            id: p.slug,
            fabric: p.fabric,
            weight: p.weight,
            style: p.style,
            tier: p.tier,
            tones: p.tones,
            occasions: p.occasions,
          })),
        }),
        signal: AbortSignal.timeout(8000), // 8s timeout
      }
    );

    if (!mlRes.ok) throw new Error("ML service returned non-OK");

    const mlResponse = await mlRes.json();

    const mlRecommendations = Array.isArray(mlResponse)
      ? mlResponse
      : Array.isArray(mlResponse?.recommendations)
      ? mlResponse.recommendations
      : [];

    return mlRecommendations
      .map((r: any) => {
        const product = products.find((p) => p.slug === r.productId);
        if (!product || typeof product.price !== "number") return null;

        return {
          product: {
            id: product.slug,
            name: product.name,
            fabric: product.fabric,
            weight: product.weight,
            style: product.style,
            tier: product.tier,
            tones: product.tones,
            occasions: product.occasions,
            isNew: product.isNew,
            price: product.price,
            images: product.images,
          },
          confidence: Math.round(r.confidence ?? 0),
          reasons: r.reasons ?? [],
        };
      })
      .filter(Boolean);
  } catch (mlError) {
    /* =====================================================
       LOCAL FALLBACK — ML service unavailable
    ===================================================== */
    console.warn("ML service unavailable, using local scoring:", mlError);

    const localResults = rankProducts(products, answers);

    return localResults
      .map(({ product, score, reasons }) => {
        if (typeof product.price !== "number") return null;
        return {
          product: {
            id: product.slug,
            name: product.name,
            fabric: product.fabric,
            weight: product.weight,
            style: product.style,
            tier: product.tier,
            tones: product.tones,
            occasions: product.occasions,
            isNew: product.isNew,
            price: product.price,
            images: product.images,
          },
          confidence: Math.min(100, score),
          reasons,
        };
      })
      .filter(Boolean);
  }
}
