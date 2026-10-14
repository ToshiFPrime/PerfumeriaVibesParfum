import { NextRequest, NextResponse } from "next/server";
import { getCouponsDb, validateCouponDb } from "@/lib/supabase/service";
import { couponAdminSchema } from "@/lib/validation/schemas";
import { revalidatePath } from "next/cache";

// GET: Validar cupón específico (?code=VIBES10) o listar cupones
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");

  if (code) {
    const coupon = await validateCouponDb(code);
    if (!coupon) {
      return NextResponse.json(
        { valid: false, error: `El cupón '${code}' no existe o ha expirado` },
        { status: 404 }
      );
    }
    return NextResponse.json({
      valid: true,
      coupon,
    });
  }

  // Listado público de cupones activos
  const coupons = await getCouponsDb();
  return NextResponse.json(
    {
      total: coupons.length,
      coupons,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      },
    }
  );
}

// POST: Registrar nuevo cupón de descuento (Requiere sesión de administrador)
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
    const parsed = couponAdminSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de cupón inválidos", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Revalidación de caché
    revalidatePath("/checkout");
    revalidatePath("/api/coupons");

    return NextResponse.json(
      {
        success: true,
        message: `Cupón '${data.code}' activado con ${data.percentage}% de descuento`,
        coupon: data,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al procesar cupón";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
