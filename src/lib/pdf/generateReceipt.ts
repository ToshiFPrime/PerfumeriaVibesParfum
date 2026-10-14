import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatPrice } from "@/lib/utils";

export interface ReceiptItem {
  productName: string;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

export interface ReceiptData {
  orderNumber: string;
  date?: string;
  customerName: string;
  customerPhone: string;
  department: string;
  city: string;
  address: string;
  items: ReceiptItem[];
  subtotal: number;
  discountAmount?: number;
  shippingCost: number;
  total: number;
  paymentMethod?: string;
  notes?: string;
}

/**
 * Genera un PDF de comprobante formal y elegante con la estética de Vibes Parfum.
 * Funciona tanto en cliente como en servidor Node.js sin dependencias nativas.
 */
export async function generateReceiptPdf(data: ReceiptData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  
  // Tamaño A4 estándar: 595.28 x 841.89 puntos
  const page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();

  // Fuentes estándar integradas (no requieren descargas de red)
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Paleta de Color Vibes Parfum (Obsidian, Oro suave, Zinc)
  const colorObsidian = rgb(0.06, 0.06, 0.08); // #0f0f14
  const colorGold = rgb(0.78, 0.65, 0.35);     // #c7a659
  const colorZincMuted = rgb(0.45, 0.45, 0.48); // #73737a
  const colorZincLight = rgb(0.94, 0.94, 0.95); // #f0f0f2
  const colorZincLine = rgb(0.85, 0.85, 0.87);  // #d9d9de
  const colorWhite = rgb(1, 1, 1);

  // Margen superior
  let y = height - 50;

  // 1. Barra superior decorativa de lujo (Oro)
  page.drawRectangle({
    x: 0,
    y: height - 12,
    width: width,
    height: 12,
    color: colorGold,
  });

  // 2. Encabezado de Marca
  page.drawText("V I B E S   P A R F U M", {
    x: 50,
    y: y,
    size: 20,
    font: fontBold,
    color: colorObsidian,
  });

  page.drawText("COMPROBANTE DE PEDIDO", {
    x: width - 230,
    y: y,
    size: 13,
    font: fontBold,
    color: colorGold,
  });

  y -= 16;

  page.drawText("ALTA PERFUMERÍA & DECANTS DE AUTOR — BOLIVIA", {
    x: 50,
    y: y,
    size: 8,
    font: fontBold,
    color: colorZincMuted,
  });

  page.drawText(`N° ${data.orderNumber}`, {
    x: width - 230,
    y: y,
    size: 11,
    font: fontBold,
    color: colorObsidian,
  });

  y -= 14;

  const orderDate = data.date || new Date().toLocaleDateString("es-BO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  page.drawText(`Fecha de Emisión: ${orderDate}`, {
    x: width - 230,
    y: y,
    size: 9,
    font: fontRegular,
    color: colorZincMuted,
  });

  y -= 25;

  // Línea divisoria elegante
  page.drawLine({
    start: { x: 50, y },
    end: { x: width - 50, y },
    thickness: 1,
    color: colorZincLine,
  });

  y -= 25;

  // 3. Bloques de Información (Cliente & Despacho)
  const colWidth = (width - 120) / 2;

  // Caja Cliente
  page.drawRectangle({
    x: 50,
    y: y - 80,
    width: colWidth,
    height: 90,
    color: colorZincLight,
    borderWidth: 1,
    borderColor: colorZincLine,
  });

  page.drawText("DATOS DEL CLIENTE", {
    x: 65,
    y: y - 5,
    size: 9,
    font: fontBold,
    color: colorGold,
  });

  page.drawText(`Nombre: ${data.customerName}`, {
    x: 65,
    y: y - 24,
    size: 10,
    font: fontBold,
    color: colorObsidian,
  });

  page.drawText(`Celular / WhatsApp: ${data.customerPhone}`, {
    x: 65,
    y: y - 40,
    size: 9,
    font: fontRegular,
    color: colorObsidian,
  });

  page.drawText(`Método de Pago: ${data.paymentMethod || "QR Simple BCP / WhatsApp"}`, {
    x: 65,
    y: y - 56,
    size: 9,
    font: fontRegular,
    color: colorZincMuted,
  });

  // Caja Envío
  const xCol2 = 50 + colWidth + 20;

  page.drawRectangle({
    x: xCol2,
    y: y - 80,
    width: colWidth,
    height: 90,
    color: colorZincLight,
    borderWidth: 1,
    borderColor: colorZincLine,
  });

  page.drawText("DESTINO DE ENTREGA", {
    x: xCol2 + 15,
    y: y - 5,
    size: 9,
    font: fontBold,
    color: colorGold,
  });

  page.drawText(`Departamento: ${data.department}`, {
    x: xCol2 + 15,
    y: y - 24,
    size: 10,
    font: fontBold,
    color: colorObsidian,
  });

  page.drawText(`Ciudad / Localidad: ${data.city}`, {
    x: xCol2 + 15,
    y: y - 40,
    size: 9,
    font: fontRegular,
    color: colorObsidian,
  });

  // Truncar dirección si es muy larga
  const cleanAddress = data.address.length > 40 ? data.address.substring(0, 37) + "..." : data.address;
  page.drawText(`Dirección: ${cleanAddress}`, {
    x: xCol2 + 15,
    y: y - 56,
    size: 9,
    font: fontRegular,
    color: colorZincMuted,
  });

  y -= 110;

  // 4. Tabla de Fragancias Compradas
  // Cabecera de la tabla
  page.drawRectangle({
    x: 50,
    y: y - 10,
    width: width - 100,
    height: 24,
    color: colorObsidian,
  });

  page.drawText("FRAGANCIA & PRESENTACIÓN", {
    x: 65,
    y: y - 3,
    size: 9,
    font: fontBold,
    color: colorWhite,
  });

  page.drawText("CANT.", {
    x: 350,
    y: y - 3,
    size: 9,
    font: fontBold,
    color: colorWhite,
  });

  page.drawText("PRECIO UNIT.", {
    x: 410,
    y: y - 3,
    size: 9,
    font: fontBold,
    color: colorWhite,
  });

  page.drawText("SUBTOTAL", {
    x: 495,
    y: y - 3,
    size: 9,
    font: fontBold,
    color: colorWhite,
  });

  y -= 25;

  // Filas de productos
  data.items.forEach((item, index) => {
    const isEven = index % 2 === 0;
    const rowHeight = 26;

    if (isEven) {
      page.drawRectangle({
        x: 50,
        y: y - 8,
        width: width - 100,
        height: rowHeight,
        color: rgb(0.98, 0.98, 0.98),
      });
    }

    // Nombre recortado si excede ancho
    const title = item.productName.length > 36 ? item.productName.substring(0, 33) + "..." : item.productName;
    page.drawText(`${title}`, {
      x: 65,
      y: y + 3,
      size: 9,
      font: fontBold,
      color: colorObsidian,
    });

    page.drawText(`(${item.variantLabel})`, {
      x: 65,
      y: y - 7,
      size: 7.5,
      font: fontItalic,
      color: colorZincMuted,
    });

    page.drawText(`${item.quantity}`, {
      x: 360,
      y: y,
      size: 9,
      font: fontRegular,
      color: colorObsidian,
    });

    page.drawText(`${formatPrice(item.unitPrice)}`, {
      x: 410,
      y: y,
      size: 9,
      font: fontRegular,
      color: colorObsidian,
    });

    const itemTotal = item.totalPrice ?? item.unitPrice * item.quantity;
    page.drawText(`${formatPrice(itemTotal)}`, {
      x: 495,
      y: y,
      size: 9,
      font: fontBold,
      color: colorObsidian,
    });

    // Línea tenue entre filas
    page.drawLine({
      start: { x: 50, y: y - 8 },
      end: { x: width - 50, y: y - 8 },
      thickness: 0.5,
      color: colorZincLine,
    });

    y -= rowHeight;
  });

  y -= 20;

  // 5. Resumen de Totales (Alineado a la derecha)
  const totalsX = width - 230;

  page.drawText("Subtotal Productos:", {
    x: totalsX - 30,
    y: y,
    size: 9.5,
    font: fontRegular,
    color: colorZincMuted,
  });

  page.drawText(`${formatPrice(data.subtotal)}`, {
    x: totalsX + 80,
    y: y,
    size: 9.5,
    font: fontBold,
    color: colorObsidian,
  });

  if (data.discountAmount && data.discountAmount > 0) {
    y -= 16;
    page.drawText("Descuento Promocional:", {
      x: totalsX - 30,
      y: y,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.1, 0.6, 0.3),
    });

    page.drawText(`- ${formatPrice(data.discountAmount)}`, {
      x: totalsX + 80,
      y: y,
      size: 9.5,
      font: fontBold,
      color: rgb(0.1, 0.6, 0.3),
    });
  }

  y -= 16;

  page.drawText(`Envío (${data.department}):`, {
    x: totalsX - 30,
    y: y,
    size: 9.5,
    font: fontRegular,
    color: colorZincMuted,
  });

  page.drawText(data.shippingCost === 0 ? "GRATIS" : `${formatPrice(data.shippingCost)}`, {
    x: totalsX + 80,
    y: y,
    size: 9.5,
    font: fontBold,
    color: data.shippingCost === 0 ? rgb(0.1, 0.6, 0.3) : colorObsidian,
  });

  y -= 25;

  // Rectángulo Total Destacado
  page.drawRectangle({
    x: totalsX - 40,
    y: y - 8,
    width: 220,
    height: 32,
    color: colorGold,
  });

  page.drawText("TOTAL A PAGAR:", {
    x: totalsX - 25,
    y: y + 3,
    size: 11,
    font: fontBold,
    color: colorWhite,
  });

  page.drawText(`${formatPrice(data.total)}`, {
    x: totalsX + 75,
    y: y + 3,
    size: 13,
    font: fontBold,
    color: colorWhite,
  });

  // 6. Pie de Página: Garantía de Autenticidad & Seguridad
  const footerY = 70;

  page.drawRectangle({
    x: 50,
    y: footerY - 15,
    width: width - 100,
    height: 48,
    color: colorZincLight,
    borderWidth: 1,
    borderColor: colorGold,
  });

  page.drawText("GARANTÍA DE AUTENTICIDAD & PROTECCIÓN VIBES PARFUM", {
    x: 65,
    y: footerY + 18,
    size: 8,
    font: fontBold,
    color: colorGold,
  });

  page.drawText(
    "Todas nuestras fragancias completas y decants proceden de distribuidores autorizados. Cada gota es 100% original.",
    {
      x: 65,
      y: footerY + 5,
      size: 7.5,
      font: fontRegular,
      color: colorObsidian,
    }
  );

  page.drawText(
    "Embalaje anti-impacto asegurado para envíos a toda Bolivia. Coordinación directa WhatsApp: 65947174 / 65867500.",
    {
      x: 65,
      y: footerY - 7,
      size: 7.5,
      font: fontRegular,
      color: colorZincMuted,
    }
  );

  return await pdfDoc.save();
}

/**
 * Dispara la descarga del PDF directamente en el navegador del usuario
 */
export async function downloadReceiptPdf(data: ReceiptData): Promise<void> {
  const pdfBytes = await generateReceiptPdf(data);
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `Comprobante-${data.orderNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
