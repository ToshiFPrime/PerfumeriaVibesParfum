import { NextRequest, NextResponse } from "next/server";
import {
  getProductByIdOrSlugDb,
  updateProductDb,
  deleteProductDb,
} from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";
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
  const product = await getProductByIdOrSlugDb(id);

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

  try {
    const body = await request.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de actualización inválidos", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const updated = await updateProductDb(id, parsed.data);

    if (!updated) {
      return NextResponse.json(
        { error: `No se pudo actualizar el perfume con ID '${id}'` },
        { status: 404 }
      );
    }

    revalidatePath("/catalogo");
    revalidatePath("/api/products");
    revalidatePath("/admin");

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
  const success = await deleteProductDb(id);

  if (!success) {
    return NextResponse.json(
      { error: `No se pudo retirar el perfume con ID '${id}'` },
      { status: 404 }
    );
  }

  revalidatePath("/catalogo");
  revalidatePath("/api/products");
  revalidatePath("/admin");

  return NextResponse.json({
    success: true,
    message: `El perfume con ID '${id}' ha sido retirado del catálogo activo`,
    productId: id,
  });
}
