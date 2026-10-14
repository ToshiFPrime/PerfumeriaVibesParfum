import { NextRequest, NextResponse } from "next/server";
import { customerOrderSchema, orderStatusUpdateSchema } from "@/lib/validation/schemas";
import { getOrdersDb, updateOrderStatusDb } from "@/lib/supabase/service";
import { z } from "zod";

const createOrderSchema = z.object({
  customer: customerOrderSchema,
  items: z.array(
    z.object({
      productId: z.string(),
      productName: z.string(),
      variantId: z.string(),
      variantLabel: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().positive(),
    })
  ).min(1, "El pedido debe contener al menos una fragancia"),
  couponCode: z.string().optional(),
  shippingCost: z.number().min(0).default(0),
});

// GET: Consultar pedidos (solo administradores)
export async function GET(request: NextRequest) {
  const adminCookie = request.cookies.get("vibes_admin_session");
  if (!adminCookie || !adminCookie.value) {
    return NextResponse.json(
      { error: "No autorizado. Se requiere sesión de administrador activa." },
      { status: 401 }
    );
  }

  const orders = await getOrdersDb();

  return NextResponse.json({
    total: orders.length,
    orders,
  });
}

// POST: Registrar nueva orden de compra
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos del pedido inválidos", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { customer, items, shippingCost } = parsed.data;

    const subtotal = items.reduce(
      (acc, item) => acc + item.unitPrice * item.quantity,
      0
    );
    const total = subtotal + shippingCost;

    const orderNumber = `VP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: customer.fullName,
      phone: customer.phone,
      department: customer.department,
      city: customer.city,
      address: customer.address,
      notes: customer.notes || null,
      items,
      subtotal,
      shippingCost,
      total,
      status: "Pendiente",
      paymentMethod: "QR Simple BCP / WhatsApp",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: "Pedido registrado con éxito",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error al procesar orden:", error);
    return NextResponse.json(
      { error: "Error interno al procesar el pedido", details: message },
      { status: 500 }
    );
  }
}

// PATCH: Actualizar estado de pedido o asignar courier de despacho
export async function PATCH(request: NextRequest) {
  const adminCookie = request.cookies.get("vibes_admin_session");
  if (!adminCookie || !adminCookie.value) {
    return NextResponse.json(
      { error: "No autorizado. Se requiere sesión de administrador activa." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const parsed = orderStatusUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos de actualización inválidos", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { orderId, status, courier } = parsed.data;
    const success = await updateOrderStatusDb(orderId, status, courier);

    if (!success) {
      return NextResponse.json(
        { error: `No se pudo actualizar la orden con ID '${orderId}'` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Estado de la orden actualizado a '${status}'`,
      orderId,
      status,
      courier,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

