import { NextRequest, NextResponse } from "next/server";
import { MOCK_PERFUMES } from "@/lib/data/mockPerfumes";
import { z } from "zod";

const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  brand: z.string().min(2).optional(),
  gender: z.enum(["Hombre", "Mujer", "Unisex"]).optional(),
  concentration: z.enum([
    "Extrait de Parfum",
    "Eau de Parfum (EDP)",
    "Eau de Toilette (EDT)",
    "Eau de Cologne (EDC)",
  ]).optional(),
  description: z.string().min(10).optional(),
  olfactoryFamily: z.enum([
    "Amaderada",
    "Cítrica",
    "Oriental / Ámbar",
    "Floral",
    "Gourmand",
    "Cuero",
    "Acuática",
    "Aromática",
  ]).optional(),
  isActive: z.boolean().optional(),
});

// GET: Obtener un perfume individual por ID o Slug
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id).toLowerCase();

  const product = MOCK_PERFUMES.find(
    (p) => p.id.toLowerCase() === decodedId || p.slug.toLowerCase() === decodedId
  );

  if (!product) {
    return NextResponse.json(
      { error: `Perfume con identificador '${id}' no encontrado` },
      { status: 404 }
    );
  }

  return NextResponse.json(product, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

// PATCH: Actualizar información de un perfume (Solo Administrador)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCookie = request.cookies.get("vibes_admin_session");
  if (!adminCookie || !adminCookie.value) {
    return NextResponse.json(
      { error: "No autorizado. Se requiere sesión de administrador activa." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const product = MOCK_PERFUMES.find(
    (p) => p.id === id || p.slug === id
  );

  if (!product) {
    return NextResponse.json(
      { error: `Perfume con ID '${id}' no encontrado` },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de actualización inválidos", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = {
      ...product,
      ...parsed.data,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Perfume actualizado exitosamente",
      product: updated,
    });
  } catch {
    return NextResponse.json(
      { error: "Error interno al actualizar el perfume" },
      { status: 500 }
    );
  }
}

// DELETE: Desactivar perfume (Soft delete / retirar del catálogo)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminCookie = request.cookies.get("vibes_admin_session");
  if (!adminCookie || !adminCookie.value) {
    return NextResponse.json(
      { error: "No autorizado. Se requiere sesión de administrador activa." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const product = MOCK_PERFUMES.find(
    (p) => p.id === id || p.slug === id
  );

  if (!product) {
    return NextResponse.json(
      { error: `Perfume con ID '${id}' no encontrado` },
      { status: 404 }
    );
  }

  product.isActive = false;

  return NextResponse.json({
    success: true,
    message: `El perfume '${product.name}' ha sido retirado del catálogo activo`,
    productId: product.id,
  });
}
