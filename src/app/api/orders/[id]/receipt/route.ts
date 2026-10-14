import { NextRequest, NextResponse } from "next/server";
import { INITIAL_ORDERS } from "@/lib/data/adminMockData";
import { generateReceiptPdf, type ReceiptData } from "@/lib/pdf/generateReceipt";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  // Buscar por ID ('ord-1') o por número de orden ('VP-2026-0089')
  const order = INITIAL_ORDERS.find(
    (o) => o.id === decodedId || o.orderNumber === decodedId
  );

  if (!order) {
    return NextResponse.json(
      { error: `Pedido '${id}' no encontrado para generación de comprobante` },
      { status: 404 }
    );
  }

  try {
    // Extraer o estructurar los ítems para el comprobante
    const receiptData: ReceiptData = {
      orderNumber: order.orderNumber,
      date: order.date,
      customerName: order.customerName,
      customerPhone: order.phone,
      department: order.department,
      city: order.city,
      address: `Zona Central / Despacho a ${order.city}`,
      items: [
        {
          productName: order.itemsSummary.split(" x")[0] || order.itemsSummary,
          variantLabel: "Presentación Oficial",
          quantity: 1,
          unitPrice: order.total,
          totalPrice: order.total,
        },
      ],
      subtotal: order.total,
      shippingCost: 0,
      total: order.total,
      paymentMethod: "QR Simple BCP / WhatsApp",
      notes: `Courier asignado: ${order.courier || "Envío Express Bolivia"}`,
    };

    const pdfBytes = await generateReceiptPdf(receiptData);

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Comprobante-${order.orderNumber}.pdf"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error al generar PDF de comprobante:", error);
    return NextResponse.json(
      { error: "Error interno al generar el archivo PDF del comprobante" },
      { status: 500 }
    );
  }
}
