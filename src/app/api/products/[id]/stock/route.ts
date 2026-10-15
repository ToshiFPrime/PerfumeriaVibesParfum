import { NextRequest, NextResponse } from "next/server";
import { recordStockMovementDb, updateVariantStockDb } from "@/lib/supabase/service";
import { revalidatePath } from "next/cache";
import type { StockAdjustmentReason } from "@/types/admin";
import { z } from "zod";

const updateStockSchema = z.object({
  variantId: z.string().min(1, "ID de variante requerida"),
  newStock: z.number().int().min(0, "El stock no puede ser negativo").optional(),
  delta: z.number().int().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

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

  const { id: productId } = await params;

  try {
    const body = await request.json();
    const parsed = updateStockSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parámetros de stock inválidos", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { variantId, newStock, delta, reason, notes } = parsed.data;

    if (newStock === undefined && delta === undefined) {
      return NextResponse.json(
        { error: "Debe especificar 'newStock' o 'delta'" },
        { status: 400 }
      );
    }

    // Retornar confirmación de ajuste y log de auditoría generado
    const auditRecord = {
      id: `audit-${Date.now()}`,
      productId,
      variantId,
      newStock,
      delta,
      reason: reason || "ajuste_manual",
      notes: notes || "Actualización por API administrativa",
      timestamp: new Date().toISOString(),
      admin: "Super Admin",
    };

    // Registrar en Supabase si está activo
    recordStockMovementDb({
      id: auditRecord.id,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      perfumeId: productId,
      perfumeName: "Perfume " + productId,
      brand: "Vibes",
      variantId,
      variantLabel: "Variante",
      previousStock: 0,
      newStock: newStock || 0,
      delta: delta || 0,
      reason: (reason as StockAdjustmentReason) || "ajuste_inventario",
      reasonLabel: "Ajuste por API",
      notes: notes || undefined,
      adminName: "Super Admin",
    }).catch(() => {});

    // Actualizar stock de la variante en Supabase
    await updateVariantStockDb(variantId, newStock, delta);

    revalidatePath("/catalogo");
    revalidatePath("/api/products");
    revalidatePath("/admin");

    return NextResponse.json({
      success: true,
      message: "Existencias actualizadas correctamente en base de datos",
      auditRecord,
    });
  } catch {
    return NextResponse.json(
      { error: "Error al actualizar existencias" },
      { status: 500 }
    );
  }
}
