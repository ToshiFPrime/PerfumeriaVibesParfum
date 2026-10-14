import { NextResponse } from "next/server";
import { MOCK_PERFUMES } from "@/lib/data/mockPerfumes";

// GET: Agrupación de familias olfativas, marcas y géneros con conteos para filtros dinámicos
export async function GET() {
  const families: Record<string, number> = {};
  const brands: Record<string, number> = {};
  const genders: Record<string, number> = {
    Hombre: 0,
    Mujer: 0,
    Unisex: 0,
  };

  MOCK_PERFUMES.forEach((perfume) => {
    if (perfume.isActive !== false) {
      // Familia olfativa
      if (perfume.olfactoryFamily) {
        families[perfume.olfactoryFamily] = (families[perfume.olfactoryFamily] || 0) + 1;
      }
      // Marca
      if (perfume.brand) {
        brands[perfume.brand] = (brands[perfume.brand] || 0) + 1;
      }
      // Género
      if (perfume.gender && genders[perfume.gender] !== undefined) {
        genders[perfume.gender] += 1;
      }
    }
  });

  return NextResponse.json({
    totalProducts: MOCK_PERFUMES.filter((p) => p.isActive !== false).length,
    families: Object.entries(families).map(([name, count]) => ({ name, count })),
    brands: Object.entries(brands).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
    genders: Object.entries(genders).map(([name, count]) => ({ name, count })),
  });
}
