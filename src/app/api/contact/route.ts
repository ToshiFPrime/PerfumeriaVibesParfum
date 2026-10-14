import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation/schemas";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Formulario de contacto incompleto o inválido", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, phone, subject, message } = parsed.data;

    // Registrar mensaje recibido para atención comercial
    const contactTicket = {
      id: `ticket-${Date.now()}`,
      name,
      phone,
      subject,
      message,
      receivedAt: new Date().toISOString(),
      status: "pending_reply",
    };

    return NextResponse.json(
      {
        success: true,
        message: "¡Mensaje recibido! Nuestro equipo te contactará a la brevedad.",
        ticket: contactTicket,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error al enviar el mensaje de contacto" },
      { status: 500 }
    );
  }
}
