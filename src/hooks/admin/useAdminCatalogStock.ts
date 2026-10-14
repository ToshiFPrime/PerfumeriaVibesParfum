"use client";

import { useState } from "react";
import { MOCK_PERFUMES } from "@/lib/data/mockPerfumes";
import type { Product, ProductVariant } from "@/types";
import type { StockMovementLog, StockAdjustmentReason } from "@/types/admin";
import type { RemovalReason } from "@/components/modals";

export function useAdminCatalogStock(
  onLogCreated?: (log: StockMovementLog) => void
) {
  const [perfumesList, setPerfumesList] = useState<Product[]>(MOCK_PERFUMES);
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "ok" | "out" | "paused">("all");
  const [isAddPerfumeOpen, setIsAddPerfumeOpen] = useState(false);
  const [adjustmentTarget, setAdjustmentTarget] = useState<{ product: Product; variant: ProductVariant } | null>(null);
  const [removalTarget, setRemovalTarget] = useState<Product | null>(null);

  // Sincronización en segundo plano con endpoints API (Optimistic UI)
  const syncStockToApi = async (
    productId: string,
    variantId: string,
    payload: { delta?: number; newStock?: number; reason?: string; notes?: string }
  ) => {
    try {
      await fetch(`/api/products/${productId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, ...payload }),
      });
    } catch (err) {
      console.warn("Sincronización de stock en segundo plano no disponible:", err);
    }
  };

  const handleUpdateStock = (productId: string, variantId: string, delta: number) => {
    syncStockToApi(productId, variantId, { delta });
    setPerfumesList((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const targetVariant = prod.variants.find((v) => v.id === variantId);
        if (targetVariant && onLogCreated) {
          const newStock = Math.max(0, targetVariant.stock + delta);
          const log: StockMovementLog = {
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            perfumeId: prod.id,
            perfumeName: prod.name,
            brand: prod.brand,
            variantId: targetVariant.id,
            variantLabel: targetVariant.label,
            previousStock: targetVariant.stock,
            newStock,
            delta,
            reason: delta > 0 ? "reingreso_lote" : "ajuste_inventario",
            reasonLabel: delta > 0 ? "Reingreso Rápido (+)" : "Descuento Rápido (-)",
            notes: delta > 0 ? "Aumento rápido de 1 unidad" : "Descuento de 1 unidad desde panel",
            adminName: "Juan Pablo V. (Super Admin)",
          };
          onLogCreated(log);
        }
        return {
          ...prod,
          variants: prod.variants.map((v) => {
            if (v.id !== variantId) return v;
            return { ...v, stock: Math.max(0, v.stock + delta) };
          }),
        };
      })
    );
  };

  const handleSetDirectStock = (productId: string, variantId: string, newStock: number) => {
    syncStockToApi(productId, variantId, { newStock });
    setPerfumesList((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const targetVariant = prod.variants.find((v) => v.id === variantId);
        if (targetVariant && onLogCreated) {
          const delta = newStock - targetVariant.stock;
          const log: StockMovementLog = {
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            perfumeId: prod.id,
            perfumeName: prod.name,
            brand: prod.brand,
            variantId: targetVariant.id,
            variantLabel: targetVariant.label,
            previousStock: targetVariant.stock,
            newStock,
            delta,
            reason: newStock === 0 ? "marcado_agotado" : "ajuste_inventario",
            reasonLabel: newStock === 0 ? "Marcado Agotado" : "Ajuste Directo Teclado",
            notes: `Edición directa de stock de ${targetVariant.stock} a ${newStock} u.`,
            adminName: "Juan Pablo V. (Super Admin)",
          };
          onLogCreated(log);
        }
        return {
          ...prod,
          variants: prod.variants.map((v) => {
            if (v.id !== variantId) return v;
            return { ...v, stock: Math.max(0, newStock) };
          }),
        };
      })
    );
  };

  const handleExhaustAllVariants = (productId: string) => {
    setPerfumesList((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        if (onLogCreated) {
          prod.variants.forEach((v) => {
            if (v.stock > 0) {
              syncStockToApi(prod.id, v.id, { newStock: 0, reason: "marcado_agotado" });
              onLogCreated({
                id: `log-${Date.now()}-${v.id}`,
                timestamp: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                perfumeId: prod.id,
                perfumeName: prod.name,
                brand: prod.brand,
                variantId: v.id,
                variantLabel: v.label,
                previousStock: v.stock,
                newStock: 0,
                delta: -v.stock,
                reason: "marcado_agotado",
                reasonLabel: "Agotado Masivo",
                notes: "Todas las variantes marcadas en 0 unidades",
                adminName: "Juan Pablo V. (Super Admin)",
              });
            }
          });
        }
        return {
          ...prod,
          variants: prod.variants.map((v) => ({ ...v, stock: 0 })),
        };
      })
    );
  };

  const handleRestockAllVariants = (productId: string, amount: number) => {
    setPerfumesList((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        if (onLogCreated) {
          prod.variants.forEach((v) => {
            syncStockToApi(prod.id, v.id, { delta: amount, reason: "reingreso_lote" });
            onLogCreated({
              id: `log-${Date.now()}-${v.id}`,
              timestamp: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              perfumeId: prod.id,
              perfumeName: prod.name,
              brand: prod.brand,
              variantId: v.id,
              variantLabel: v.label,
              previousStock: v.stock,
              newStock: v.stock + amount,
              delta: amount,
              reason: "reingreso_lote",
              reasonLabel: "Reingreso Lote (+5)",
              notes: `Añadidas ${amount} unidades a la presentación ${v.label}`,
              adminName: "Juan Pablo V. (Super Admin)",
            });
          });
        }
        return {
          ...prod,
          variants: prod.variants.map((v) => ({ ...v, stock: v.stock + amount })),
        };
      })
    );
  };

  const handleConfirmAdjustment = (
    productId: string,
    variantId: string,
    delta: number,
    reason: StockAdjustmentReason,
    notes: string
  ) => {
    syncStockToApi(productId, variantId, { delta, reason, notes });
    setPerfumesList((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const targetVariant = prod.variants.find((v) => v.id === variantId);
        if (targetVariant && onLogCreated) {
          const newStock = Math.max(0, targetVariant.stock + delta);
          const reasonLabels: Record<StockAdjustmentReason, string> = {
            rotura: "Rotura / Daño",
            regalo_muestra: "Regalo / Muestra",
            venta_whatsapp: "Venta WhatsApp",
            reingreso_lote: "Reingreso Lote",
            ajuste_inventario: "Ajuste Auditoría",
            marcado_agotado: "Agotado",
            baja_producto: "Baja de Producto",
          };
          onLogCreated({
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            perfumeId: prod.id,
            perfumeName: prod.name,
            brand: prod.brand,
            variantId: targetVariant.id,
            variantLabel: targetVariant.label,
            previousStock: targetVariant.stock,
            newStock,
            delta,
            reason,
            reasonLabel: reasonLabels[reason] || "Ajuste Especial",
            notes: notes || "Sin notas adicionales",
            adminName: "Juan Pablo V. (Super Admin)",
          });
        }
        return {
          ...prod,
          variants: prod.variants.map((v) => {
            if (v.id !== variantId) return v;
            return { ...v, stock: Math.max(0, v.stock + delta) };
          }),
        };
      })
    );
    setAdjustmentTarget(null);
  };

  const handleConfirmRemoval = (
    productId: string,
    action: "pause" | "delete",
    reason: RemovalReason,
    reasonLabel: string,
    notes: string
  ) => {
    setPerfumesList((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        if (onLogCreated) {
          onLogCreated({
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            perfumeId: prod.id,
            perfumeName: prod.name,
            brand: prod.brand,
            variantId: "all",
            variantLabel: "Todas las variantes",
            previousStock: prod.variants.reduce((acc, v) => acc + v.stock, 0),
            newStock: 0,
            delta: 0,
            reason: "baja_producto",
            reasonLabel: reasonLabel || "Baja de Producto",
            notes: `Acción: ${action} • Motivo: ${reasonLabel}${notes ? ` • ${notes}` : ""}`,
            adminName: "Juan Pablo V. (Super Admin)",
          });
        }
        return {
          ...prod,
          isActive: false,
          statusReason: reason,
        };
      })
    );
    setRemovalTarget(null);
  };

  const handleReactivateProduct = (productId: string) => {
    setPerfumesList((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        if (onLogCreated) {
          onLogCreated({
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            perfumeId: prod.id,
            perfumeName: prod.name,
            brand: prod.brand,
            variantId: "all",
            variantLabel: "Todas las variantes",
            previousStock: 0,
            newStock: prod.variants.reduce((acc, v) => acc + v.stock, 0),
            delta: 0,
            reason: "reingreso_lote",
            reasonLabel: "Reactivación de Catálogo",
            notes: "Producto reactivado en la tienda visible",
            adminName: "Juan Pablo V. (Super Admin)",
          });
        }
        return { ...prod, isActive: true, statusReason: undefined };
      })
    );
  };

  const handleAddPerfume = (newPerfume: Product) => {
    setPerfumesList((prev) => [newPerfume, ...prev]);
    setIsAddPerfumeOpen(false);
  };

  return {
    perfumesList,
    searchTerm,
    setSearchTerm,
    stockFilter,
    setStockFilter,
    isAddPerfumeOpen,
    setIsAddPerfumeOpen,
    adjustmentTarget,
    setAdjustmentTarget,
    removalTarget,
    setRemovalTarget,
    handleUpdateStock,
    handleSetDirectStock,
    handleExhaustAllVariants,
    handleRestockAllVariants,
    handleConfirmAdjustment,
    handleConfirmRemoval,
    handleReactivateProduct,
    handleAddPerfume,
  };
}
