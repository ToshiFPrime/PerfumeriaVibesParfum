import { NextRequest, NextResponse } from "next/server";
import { MOCK_PERFUMES } from "@/lib/data/mockPerfumes";

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

  const matches = MOCK_PERFUMES.filter((p) => {
    if (p.isActive === false) return false;
    const allNotes = [...(p.pyramid?.top || []), ...(p.pyramid?.heart || []), ...(p.pyramid?.base || [])];
    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.olfactoryFamily.toLowerCase().includes(q) ||
      allNotes.some((note) => note.toLowerCase().includes(q))
    );
  })
    .slice(0, 6)
    .map((p) => {
      const minPrice = Math.min(...p.variants.map((v) => v.price));
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
