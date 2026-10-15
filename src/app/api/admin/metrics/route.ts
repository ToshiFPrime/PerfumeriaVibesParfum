import { NextRequest, NextResponse } from "next/server";
import { getOrdersDb, getProductsDb } from "@/lib/supabase/service";

// GET: Métricas ejecutivas y KPIs de ventas para el Panel de Administrador
export async function GET(request: NextRequest) {
  const adminCookie = request.cookies.get("vibes_admin_session");
  if (!adminCookie || !adminCookie.value) {
    return NextResponse.json(
      { error: "No autorizado. Se requiere sesión de administrador activa." },
      { status: 401 }
    );
  }

  try {
    const orders = await getOrdersDb();
    const products = await getProductsDb();

    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
    const confirmedRevenue = orders
      .filter((ord) => ord.status === "Confirmado" || ord.status === "Enviado" || ord.status === "Entregado")
      .reduce((sum, ord) => sum + (ord.total || 0), 0);

    const pendingOrdersCount = orders.filter((ord) => ord.status === "Pendiente").length;
    const deliveredOrdersCount = orders.filter((ord) => ord.status === "Entregado").length;

    // Métricas de inventario
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let totalStockUnits = 0;
    let totalDecantsStock = 0;
    let totalBottlesStock = 0;

    products.forEach((perfume) => {
      perfume.variants.forEach((v) => {
        totalStockUnits += v.stock;
        if (v.milliliters <= 10) {
          totalDecantsStock += v.stock;
        } else {
          totalBottlesStock += v.stock;
        }

        if (v.stock === 0) {
          outOfStockCount++;
        } else if (v.stock <= 3) {
          lowStockCount++;
        }
      });
    });

    // Desglose por departamentos
    const departmentDistribution: Record<string, number> = {};
    orders.forEach((ord) => {
      const dept = ord.department || "Otros";
      departmentDistribution[dept] = (departmentDistribution[dept] || 0) + 1;
    });

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      financials: {
        totalRevenueBs: totalRevenue,
        confirmedRevenueBs: confirmedRevenue,
        averageTicketBs: orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0,
        currency: "BOB (Bs.)",
      },
      orders: {
        total: orders.length,
        pending: pendingOrdersCount,
        delivered: deliveredOrdersCount,
        byDepartment: departmentDistribution,
      },
      inventory: {
        totalStockUnits,
        totalDecantsStock,
        totalBottlesStock,
        lowStockVariantsCount: lowStockCount,
        outOfStockVariantsCount: outOfStockCount,
        activeCatalogsCount: products.filter((p) => p.isActive !== false).length,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al calcular métricas";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
