"use client";

import { useState, useCallback } from "react";
import {
  generateReceiptPdf,
  downloadReceiptPdf,
  type ReceiptData,
  type ReceiptItem,
} from "@/lib/pdf/generateReceipt";
import type { AdminOrder } from "@/types/admin";

export interface UseReceiptReturn {
  isGenerating: boolean;
  error: string | null;
  downloadReceipt: (data: ReceiptData) => Promise<boolean>;
  downloadFromAdminOrder: (order: AdminOrder) => Promise<boolean>;
  downloadFromServerEndpoint: (orderIdOrNumber: string) => Promise<boolean>;
}

export function useReceipt(): UseReceiptReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Genera y descarga el comprobante en el cliente con cero latencia
   */
  const downloadReceipt = useCallback(async (data: ReceiptData): Promise<boolean> => {
    setIsGenerating(true);
    setError(null);
    try {
      await downloadReceiptPdf(data);
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al generar comprobante PDF";
      console.error("useReceipt error:", err);
      setError(msg);
      return false;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Adapta un AdminOrder y descarga su comprobante de lujo en 1 clic
   */
  const downloadFromAdminOrder = useCallback(
    async (order: AdminOrder): Promise<boolean> => {
      // Formatear items desde itemsSummary
      const itemSegments = order.itemsSummary.split("+").map((s) => s.trim());
      const items: ReceiptItem[] = itemSegments.map((seg) => {
        const parts = seg.split(" x");
        const nameAndVariant = parts[0] || seg;
        const qty = parts[1] ? parseInt(parts[1], 10) || 1 : 1;
        return {
          productName: nameAndVariant,
          variantLabel: "Presentación Oficial",
          quantity: qty,
          unitPrice: Math.round(order.total / Math.max(1, qty)),
          totalPrice: order.total,
        };
      });

      const receiptData: ReceiptData = {
        orderNumber: order.orderNumber,
        date: order.date,
        customerName: order.customerName,
        customerPhone: order.phone,
        department: order.department,
        city: order.city,
        address: `Zona Central / Despacho a ${order.city}`,
        items: items.length > 0 ? items : [
          {
            productName: order.itemsSummary,
            variantLabel: "Original",
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

      return await downloadReceipt(receiptData);
    },
    [downloadReceipt]
  );

  /**
   * Descarga vía endpoint streaming del servidor
   */
  const downloadFromServerEndpoint = useCallback(
    async (orderIdOrNumber: string): Promise<boolean> => {
      setIsGenerating(true);
      setError(null);
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(orderIdOrNumber)}/receipt`);
        if (!res.ok) {
          throw new Error(`Error en servidor: ${res.statusText}`);
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Comprobante-${orderIdOrNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error al descargar comprobante del servidor";
        console.error("useReceipt server error:", err);
        setError(msg);
        return false;
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return {
    isGenerating,
    error,
    downloadReceipt,
    downloadFromAdminOrder,
    downloadFromServerEndpoint,
  };
}

export type { ReceiptData, ReceiptItem };
export { generateReceiptPdf, downloadReceiptPdf };
