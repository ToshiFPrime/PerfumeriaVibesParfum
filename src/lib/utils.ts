import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { CartItem, CustomerOrderInfo } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const WHATSAPP_NUMBERS = {
  primary: {
    raw: "65947174",
    full: "59165947174",
    label: "+591 65947174",
  },
  secondary: {
    raw: "65867500",
    full: "59165867500",
    label: "+591 65867500",
  },
} as const;

export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/vibes_parfum?stkn=OWpieno3am14dGtv&utm_source=qr",
  tiktok: "https://www.tiktok.com/@vibes_parfum?_r=1&_t=ZS-99g8D8vX1cK",
  whatsapp1: "https://wa.me/59165947174",
  whatsapp2: "https://wa.me/59165867500",
};

export function formatPrice(amount: number): string {
  return `Bs. ${amount.toLocaleString("es-BO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export function buildWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function generateProductWhatsAppMessage(
  productName: string,
  brand: string,
  variantLabel: string,
  price: number,
  productUrl?: string
): string {
  let msg = `Estimado equipo de *Vibes Parfum Bolivia*,\n\n`;
  msg += `Un cordial saludo. Me pongo en contacto desde su tienda online para consultar la disponibilidad y coordinar la compra de la siguiente fragancia exclusiva:\n\n`;
  msg += `• *Fragancia:* ${productName}\n`;
  msg += `• *Casa / Marca:* ${brand}\n`;
  msg += `• *Presentación:* ${variantLabel}\n`;
  msg += `• *Inversión:* ${formatPrice(price)}\n`;
  if (productUrl) {
    msg += `• *Ficha oficial:* ${productUrl}\n`;
  }
  msg += `\n¿Podrían confirmarme la disponibilidad en stock para despacho y los datos para pago por QR Simple o transferencia bancaria? Agradezco mucho su gentil atención.`;
  return msg;
}

export function generateProductQuoteWhatsAppMessage(
  productName: string,
  brand: string,
  variantLabel: string,
  price: number,
  department: string,
  productUrl?: string
): string {
  let msg = `Estimado equipo de *Vibes Parfum Bolivia*,\n\n`;
  msg += `Un cordial saludo. Quisiera solicitar una cotización formal y asesoría personalizada para la siguiente fragancia:\n\n`;
  msg += `• *Fragancia:* ${productName}\n`;
  msg += `• *Casa / Diseñador:* ${brand}\n`;
  msg += `• *Presentación deseada:* ${variantLabel} (${formatPrice(price)})\n`;
  msg += `• *Destino de envío:* ${department}, Bolivia\n`;
  if (productUrl) {
    msg += `• *Enlace del producto:* ${productUrl}\n`;
  }
  msg += `\n¿Podrían informarme el costo del flete asegurado, tiempos de entrega y recomendaciones de conservación de decants? Quedo muy atento a su respuesta.`;
  return msg;
}

export function generateShippingQuoteWhatsAppMessage(
  department: string,
  city: string,
  perfumeQuery?: string,
  cost?: number,
  estimatedDays?: string
): string {
  let msg = `Estimado equipo de *Vibes Parfum Bolivia*,\n\n`;
  msg += `Un cordial saludo. Les escribo desde su cotizador web para confirmar el despacho hacia mi localidad:\n\n`;
  msg += `• *Departamento de Destino:* ${department}\n`;
  msg += `• *Ciudad / Zona:* ${city || "Capital"}\n`;
  if (cost !== undefined) {
    msg += `• *Tarifa de encomienda calculada:* ${formatPrice(cost)}\n`;
  }
  if (estimatedDays) {
    msg += `• *Tiempo estimado:* ${estimatedDays}\n`;
  }
  if (perfumeQuery) {
    msg += `• *Fragancia(s) de interés:* ${perfumeQuery}\n`;
  }
  msg += `\n¿Podrían indicarme la empresa de transporte o agencia que recomiendan para este destino y los datos de pago por QR? Agradezco mucho su gentil asesoría.`;
  return msg;
}

export function generateOrderWhatsAppMessage({
  items,
  subtotal,
  discount,
  couponCode,
  shippingCost,
  total,
  customer,
  isQuoteOnly = false,
}: {
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingCost: number;
  total: number;
  customer: CustomerOrderInfo;
  isQuoteOnly?: boolean;
}): string {
  const timestamp = new Date().toLocaleDateString("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  let message = `Estimado equipo de *Vibes Parfum Bolivia*,\n\n`;
  message += isQuoteOnly
    ? `Un cordial saludo. Deseo solicitar una *cotización formal* para la siguiente selección de fragancias:\n`
    : `Un cordial saludo. Deseo coordinar el *despacho y pago* de mi orden realizada en su tienda online:\n`;
  message += `_Registro: ${timestamp}_\n\n`;

  message += `*DATOS DEL DESTINATARIO*\n`;
  message += `• *Cliente:* ${customer.fullName}\n`;
  message += `• *Teléfono de contacto:* ${customer.phone}\n`;
  message += `• *Destino:* ${customer.city}, Departamento de ${customer.department}\n`;
  message += `• *Dirección / Agencia:* ${customer.address}\n`;
  if (customer.notes) {
    message += `• *Instrucciones de entrega:* ${customer.notes}\n`;
  }

  message += `\n*SELECCIÓN DE FRAGANCIAS*\n`;
  items.forEach((item, index) => {
    message += `${index + 1}. *${item.productName}* — ${item.brand}\n`;
    message += `   - ${item.variant.label} (Cantidad: ${item.quantity})\n`;
    message += `   - Subtotal: ${formatPrice(item.variant.price * item.quantity)}\n`;
  });

  message += `\n*RESUMEN DE LIQUIDACIÓN*\n`;
  message += `• Subtotal fragancias: ${formatPrice(subtotal)}\n`;
  if (discount > 0) {
    message += `• Descuento promocional (${couponCode || "Cupón"}): -${formatPrice(discount)}\n`;
  }
  message += `• Costo de envío (${customer.department}): ${shippingCost === 0 ? "GRATIS (Promoción)" : formatPrice(shippingCost)}\n`;
  message += `• *TOTAL ESTIMADO:* *${formatPrice(total)}*\n\n`;

  if (isQuoteOnly) {
    message += `Agradezco de antemano su asesoría sobre disponibilidad inmediata y confirmación de la cotización para proceder. Quedo atento a su gentil respuesta.`;
  } else {
    message += `Por favor facilitarme el código QR Simple o datos de transferencia bancaria para realizar el pago correspondiente y confirmar el empaque protegido de mi pedido. ¡Muchas gracias!`;
  }

  return message;
}
