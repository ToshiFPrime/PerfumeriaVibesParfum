import { NextRequest, NextResponse } from "next/server";
import { getProductsDb } from "@/lib/supabase/service";

// GET: Búsqueda rápida y liviana para autocompletado en barra de navegación
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.toLowerCase().trim() || "";

  if (!q || q.length < 2) {
    return NextResponse.json({
      query: q,
      results: [],
    });
  }

  const products = await getProductsDb({ q, limit: 6 });

  const matches = products
    .filter((p) => p.isActive !== false)
    .slice(0, 6)
    .map((p) => {
      const minPrice = p.variants && p.variants.length > 0
        ? Math.min(...p.variants.map((v) => v.price))
        : 0;
      return {
        id: p.id,
        name: p.name,
        brand: p.brand,
        slug: p.slug,
        image: p.images[0] || "/images/placeholder.jpg",
        gender: p.gender,
        minPrice,
      };
    });

  return NextResponse.json(
    {
      query: q,
      count: matches.length,
      results: matches,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    }
  );
}
