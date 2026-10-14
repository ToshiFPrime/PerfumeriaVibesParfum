import { NextRequest, NextResponse } from "next/server";
import { generateReceiptPdf, type ReceiptData } from "@/lib/pdf/generateReceipt";
import { z } from "zod";

const receiptItemSchema = z.object({
  productName: z.string().min(1),
  variantLabel: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  totalPrice: z.number().positive().optional(),
});

const receiptPayloadSchema = z.object({
  orderNumber: z.string().min(1),
  date: z.string().optional(),
  customerName: z.string().min(1),
  customerPhone: z.string().min(1),
  department: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  items: z.array(receiptItemSchema).min(1),
  subtotal: z.number().positive(),
  discountAmount: z.number().min(0).optional(),
  shippingCost: z.number().min(0).default(0),
  total: z.number().positive(),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = receiptPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos del comprobante inválidos", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const receiptData = parsed.data as ReceiptData;
    const pdfBytes = await generateReceiptPdf(receiptData);

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Comprobante-${receiptData.orderNumber}.pdf"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error al generar comprobante PDF:", error);
    return NextResponse.json(
      { error: "Error interno al procesar el comprobante PDF" },
      { status: 500 }
    );
  }
}
