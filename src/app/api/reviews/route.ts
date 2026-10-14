import { NextRequest, NextResponse } from "next/server";
import { reviewSchema } from "@/lib/validation/schemas";
import { MOCK_REVIEWS } from "@/lib/data/mockPerfumes";
import type { Review } from "@/types";

// GET: Obtener reseñas por slug o id de producto
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Parámetro 'slug' requerido" },
      { status: 400 }
    );
  }

  const reviews = MOCK_REVIEWS[slug] || [];

  return NextResponse.json({
    slug,
    total: reviews.length,
    reviews,
  });
}

// POST: Enviar nueva reseña de cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de reseña inválidos", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { productId, authorName, rating, comment } = parsed.data;

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      authorName,
      rating,
      comment,
      isVerifiedPurchase: true,
      date: "Hoy",
    };

    return NextResponse.json(
      {
        success: true,
        message: "¡Gracias por tu valoración! Tu reseña ha sido registrada.",
        review: newReview,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error interno al enviar la reseña" },
      { status: 500 }
    );
  }
}
