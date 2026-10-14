"use client";

import { useState, useCallback } from "react";
import type { Product } from "@/types";

export interface StockMutationParams {
  productId: string;
  variantId: string;
  delta?: number;
  newStock?: number;
  reason?: string;
  notes?: string;
}

export interface UseStockMutationOptions {
  onSuccess?: (productId: string, variantId: string, updatedStock: number) => void;
  onError?: (error: string, rollbackStock: number) => void;
}

export function useStockMutation(
  products: Product[],
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
  options: UseStockMutationOptions = {}
) {
  const [isPending, setIsPending] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const mutateStock = useCallback(
    async ({ productId, variantId, delta, newStock, reason, notes }: StockMutationParams) => {
      // 1. Localizar producto y variante objetivo
      const targetProduct = products.find((p) => p.id === productId);
      const targetVariant = targetProduct?.variants.find((v) => v.id === variantId);

      if (!targetProduct || !targetVariant) {
        setLastError("Producto o variante no encontrada");
        return { success: false, error: "No encontrado" };
      }

      // 2. Guardar snapshot previo para rollback ante fallos
      const previousStock = targetVariant.stock;

      // 3. Calcular nuevo stock optimista
      let calculatedStock = previousStock;
      if (typeof newStock === "number") {
        calculatedStock = Math.max(0, newStock);
      } else if (typeof delta === "number") {
        calculatedStock = Math.max(0, previousStock + delta);
      }

      // 4. Actualización optimista inmediata en la UI (Cero Latencia)
      setProducts((prev) =>
        prev.map((prod) => {
          if (prod.id !== productId) return prod;
          return {
            ...prod,
            variants: prod.variants.map((v) =>
              v.id === variantId ? { ...v, stock: calculatedStock } : v
            ),
          };
        })
      );

      setIsPending(true);
      setLastError(null);

      // 5. Enviar mutación al backend
      try {
        const res = await fetch(`/api/products/${productId}/stock`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            variantId,
            delta,
            newStock: typeof newStock === "number" ? calculatedStock : undefined,
            reason: reason || "ajuste_manual",
            notes: notes || "Ajuste optimista de existencias",
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Error ${res.status}: Fallo al actualizar stock`);
        }

        options.onSuccess?.(productId, variantId, calculatedStock);
        return { success: true, newStock: calculatedStock };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Error de sincronización";
        console.error("Error al actualizar existencias, ejecutando rollback:", err);

        // 6. Rollback automático al estado anterior
        setProducts((prev) =>
          prev.map((prod) => {
            if (prod.id !== productId) return prod;
            return {
              ...prod,
              variants: prod.variants.map((v) =>
                v.id === variantId ? { ...v, stock: previousStock } : v
              ),
            };
          })
        );

        setLastError(errorMsg);
        options.onError?.(errorMsg, previousStock);
        return { success: false, error: errorMsg, rollbackStock: previousStock };
      } finally {
        setIsPending(false);
      }
    },
    [products, setProducts, options]
  );

  return {
    mutateStock,
    isPending,
    lastError,
  };
}
