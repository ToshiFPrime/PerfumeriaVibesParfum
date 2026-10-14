import { NextRequest, NextResponse } from "next/server";
import { getProductsDb } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Product, ProductVariant } from "@/types";

const newProductSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  brand: z.string().min(2, "La marca es requerida"),
  gender: z.enum(["Hombre", "Mujer", "Unisex"]),
  concentration: z.enum([
    "Extrait de Parfum",
    "Eau de Parfum (EDP)",
    "Eau de Toilette (EDT)",
    "Eau de Cologne (EDC)",
  ]),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  olfactoryFamily: z.enum([
    "Amaderada",
    "Cítrica",
    "Oriental / Ámbar",
    "Floral",
    "Gourmand",
    "Cuero",
    "Acuática",
    "Aromática",
  ]),
  pyramid: z.object({
    top: z.array(z.string()).default([]),
    heart: z.array(z.string()).default([]),
    base: z.array(z.string()).default([]),
  }),
  images: z.array(z.string()).min(1, "Debe incluir al menos una imagen"),
  variants: z
    .array(
      z.object({
        milliliters: z.number().positive(),
        label: z.string(),
        price: z.number().positive(),
        compareAtPrice: z.number().positive().optional(),
        stock: z.number().min(0),
        sku: z.string(),
      })
    )
    .min(1, "Debe incluir al menos una variante de presentación"),
});

// GET: Consultar perfumes con filtros y búsqueda (Edge Caching)
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.toLowerCase().trim();
  const brand = searchParams.get("brand");
  const family = searchParams.get("family");
  const gender = searchParams.get("gender");
  const inStock = searchParams.get("inStock") === "true";
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

  const results = await getProductsDb({
    q,
    brand,
    family,
    gender,
    inStock,
    limit,
  });

  return NextResponse.json(
    {
      total: results.length,
      products: results,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}

// POST: Crear nuevo perfume (Protegido por cookie de administrador)
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
    const parsed = newProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de producto inválidos", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      slug,
      name: data.name,
      brand: data.brand,
      gender: data.gender,
      concentration: data.concentration,
      description: data.description,
      olfactoryFamily: data.olfactoryFamily,
      pyramid: data.pyramid,
      images: data.images,
      variants: data.variants.map((v, i): ProductVariant => ({
        id: `var-${Date.now()}-${i}`,
        ...v,
      })),
      rating: 5.0,
      reviewsCount: 0,
      isActive: true,
    };

    revalidatePath("/catalogo");
    revalidatePath("/api/products");

    return NextResponse.json(
      { success: true, message: "Perfume creado exitosamente", product: newProduct },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error interno al procesar el producto" },
      { status: 500 }
    );
  }
}
