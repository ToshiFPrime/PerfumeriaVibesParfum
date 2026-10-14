import type { Product } from "@/types";
import type { AdminOrder } from "@/types/admin";

/**
 * Escapa un campo para CSV cumpliendo con el estándar RFC 4180
 */
function escapeCsvValue(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Descarga una cadena de texto en formato CSV con BOM UTF-8 (\uFEFF)
 * para compatibilidad perfecta con Microsoft Excel en español/Windows.
 */
function triggerCsvDownload(csvContent: string, filename: string) {
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporta el catálogo completo de perfumes, variantes y stocks a Excel/CSV
 */
export function exportCatalogToCsv(perfumes: Product[], filename = "catalogo_vibes_parfum.csv") {
  const headers = [
    "ID",
    "Fragancia",
    "Marca / Casa",
    "Género",
    "Familia Olfativa",
    "Variantes",
    "Precios (Bs)",
    "Stock Total",
    "Estado Stock",
    "Catálogo Activo",
  ];

  const rows = perfumes.map((p) => {
    const variantsSummary = p.variants.map((v) => `${v.label} (Stock: ${v.stock})`).join(" | ");
    const pricesSummary = p.variants.map((v) => `${v.milliliters}ml: ${v.price} Bs`).join(" | ");
    const totalStock = p.variants.reduce((acc, v) => acc + (v.stock || 0), 0);
    const hasLowStock = p.variants.some((v) => v.stock > 0 && v.stock <= 5);
    const isOut = totalStock === 0;

    const stockStatus = isOut ? "Agotado" : hasLowStock ? "Stock Bajo (Alerta)" : "Disponible";

    return [
      escapeCsvValue(p.id),
      escapeCsvValue(p.name),
      escapeCsvValue(p.brand),
      escapeCsvValue(p.gender),
      escapeCsvValue(p.olfactoryFamily),
      escapeCsvValue(variantsSummary),
      escapeCsvValue(pricesSummary),
      escapeCsvValue(totalStock),
      escapeCsvValue(stockStatus),
      escapeCsvValue(p.isActive !== false ? "Activo" : "En Pausa"),
    ].join(",");
  });

  const csv = [headers.map(escapeCsvValue).join(","), ...rows].join("\r\n");
  triggerCsvDownload(csv, filename);
}

/**
 * Exporta el listado de pedidos y guías de transporte a Excel/CSV
 */
export function exportOrdersToCsv(orders: AdminOrder[], filename = "pedidos_vibes_parfum.csv") {
  const headers = [
    "N° de Orden",
    "Fecha",
    "Nombre del Cliente",
    "Teléfono / WhatsApp",
    "Departamento",
    "Ciudad / Localidad",
    "Detalle de Productos",
    "Total (Bs.)",
    "Estado",
    "Empresa de Transporte / Guía",
  ];

  const rows = orders.map((o) => {
    return [
      escapeCsvValue(o.orderNumber),
      escapeCsvValue(o.date),
      escapeCsvValue(o.customerName),
      escapeCsvValue(o.phone),
      escapeCsvValue(o.department),
      escapeCsvValue(o.city),
      escapeCsvValue(o.itemsSummary),
      escapeCsvValue(o.total),
      escapeCsvValue(o.status),
      escapeCsvValue(o.courier || "Envío Express"),
    ].join(",");
  });

  const csv = [headers.map(escapeCsvValue).join(","), ...rows].join("\r\n");
  triggerCsvDownload(csv, filename);
}
