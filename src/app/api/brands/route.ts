import { NextRequest, NextResponse } from "next/server";
import { getBrandsDb, createBrandDb } from "@/lib/supabase/service";
import { brandAdminSchema } from "@/lib/validation/schemas";
import { revalidatePath } from "next/cache";

// GET: Listado de marcas y casas perfumistas con Edge Caching
export async function GET() {
  try {
    const brands = await getBrandsDb();
    return NextResponse.json(
      {
        total: brands.length,
        brands,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al obtener marcas";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: Registrar nueva casa perfumista (Requiere sesión de administrador)
export async function POST(request: NextRequest) {
  const adminCookie = request.cookies.get("vibes_admin_session");
  if (!adminCookie || !adminCookie.value) {
    return NextResponse.json(
      { error: "No autorizado. Se requiere sesión de administrador activa." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const parsed = brandAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de marca inválidos", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const created = await createBrandDb(parsed.data);

    // Revalidación bajo demanda en Vercel Edge
    revalidatePath("/catalogo");
    revalidatePath("/api/brands");

    return NextResponse.json(
      {
        success: true,
        message: `Marca '${created.name}' registrada exitosamente`,
        brand: created,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
