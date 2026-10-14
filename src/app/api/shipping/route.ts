import { NextRequest, NextResponse } from "next/server";
import { BOLIVIA_DEPARTMENTS } from "@/lib/data/shippingRates";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const deptQuery = searchParams.get("department");

  if (deptQuery) {
    const match = BOLIVIA_DEPARTMENTS.find(
      (d) => d.department.toLowerCase() === deptQuery.toLowerCase().trim()
    );
    if (!match) {
      return NextResponse.json(
        { error: `Departamento '${deptQuery}' no encontrado` },
        { status: 404 }
      );
    }
    return NextResponse.json(match, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }

  return NextResponse.json(
    {
      total: BOLIVIA_DEPARTMENTS.length,
      departments: BOLIVIA_DEPARTMENTS,
      nationalCourier: "Encomienda Asegurada con Protección Especial de Frascos",
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
