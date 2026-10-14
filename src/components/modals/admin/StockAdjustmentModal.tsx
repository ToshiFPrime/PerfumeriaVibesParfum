"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Sliders, Loader2, AlertTriangle, Gift, ShoppingCart, RefreshCw, Ban, ClipboardCheck } from "lucide-react";
import { BaseModal } from "@/components/common/BaseModal";
import type { Product, ProductVariant } from "@/types";
import type { StockAdjustmentReason } from "@/types/admin";

export interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  variant: ProductVariant | null;
  onConfirmAdjustment: (
    productId: string,
    variantId: string,
    newStock: number,
    reason: StockAdjustmentReason,
    reasonLabel: string,
    notes: string
  ) => void;
}

const REASONS_LIST: {
  id: StockAdjustmentReason;
  label: string;
  description: string;
  icon: React.ReactNode;
  defaultMode: "set" | "subtract" | "add";
}[] = [
  {
    id: "rotura",
    label: "Rotura / Frasco Dañado",
    description: "Frasco o atomizador roto o dañado en almacén o durante empaque",
    icon: <AlertTriangle className="w-4 h-4 text-red-400" />,
    defaultMode: "subtract",
  },
  {
    id: "regalo_muestra",
    label: "Regalo / Muestra / Probador",
    description: "Muestra de cortesía a cliente VIP, influencer o probador de mostrador",
    icon: <Gift className="w-4 h-4 text-amber-400" />,
    defaultMode: "subtract",
  },
  {
    id: "venta_whatsapp",
    label: "Venta Manual / WhatsApp",
    description: "Venta cerrada directamente por chat sin pasar por el carrito web",
    icon: <ShoppingCart className="w-4 h-4 text-emerald-400" />,
    defaultMode: "subtract",
  },
  {
    id: "reingreso_lote",
    label: "Reingreso / Nuevo Lote",
    description: "Llegada de nueva importación desde Dubai o distribuidor mayorista",
    icon: <RefreshCw className="w-4 h-4 text-blue-400" />,
    defaultMode: "add",
  },
  {
    id: "ajuste_inventario",
    label: "Ajuste por Conteo Físico",
    description: "Corrección manual al comparar existencias reales en estante",
    icon: <ClipboardCheck className="w-4 h-4 text-purple-400" />,
    defaultMode: "set",
  },
  {
    id: "marcado_agotado",
    label: "Marcar como Agotado (0)",
    description: "Fijar existencia en 0 de inmediato por falta de stock",
    icon: <Ban className="w-4 h-4 text-zinc-400" />,
    defaultMode: "set",
  },
];

export function StockAdjustmentModal({
  isOpen,
  onClose,
  product,
  variant,
  onConfirmAdjustment,
}: StockAdjustmentModalProps) {
  const [selectedReason, setSelectedReason] = useState<StockAdjustmentReason>("rotura");
  const [amount, setAmount] = useState<number>(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product || !variant) return null;

  const currentStock = variant.stock;
  const reasonObj = REASONS_LIST.find((r) => r.id === selectedReason) || REASONS_LIST[0];

  // Calcular nuevo stock resultante
  let calculatedNewStock = currentStock;
  if (selectedReason === "marcado_agotado") {
    calculatedNewStock = 0;
  } else if (reasonObj.defaultMode === "subtract") {
    calculatedNewStock = Math.max(0, currentStock - amount);
  } else if (reasonObj.defaultMode === "add") {
    calculatedNewStock = currentStock + amount;
  } else {
    // set mode
    calculatedNewStock = Math.max(0, amount);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Anti-spam prevention
    setIsSubmitting(true);

    setTimeout(() => {
      onConfirmAdjustment(
        product.id,
        variant.id,
        calculatedNewStock,
        selectedReason,
        reasonObj.label,
        notes.trim() || `${reasonObj.label}: ajuste de ${currentStock} a ${calculatedNewStock}`
      );
      setIsSubmitting(false);
      setNotes("");
      setAmount(1);
      onClose();
    }, 350);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajuste de Existencias con Motivo"
      subtitle="Registra roturas, regalos, ventas o reingresos en el historial de auditoría"
      icon={<Sliders className="w-5 h-5 text-emerald-400" />}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        {/* Fragancia y Variante Info */}
        <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-700/60">
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase font-bold text-zinc-400">{product.brand}</p>
            <p className="text-sm font-bold text-white truncate">{product.name}</p>
            <p className="text-xs text-emerald-400 font-medium">{variant.label}</p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-[10px] text-zinc-400 block uppercase font-bold">Stock Actual</span>
            <span className="text-base font-extrabold font-mono text-white">{currentStock} u.</span>
          </div>
        </div>

        {/* Selector de Motivo */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
            1. Selecciona el Motivo del Movimiento:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {REASONS_LIST.map((r) => {
              const isSelected = selectedReason === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedReason(r.id)}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-zinc-850 border-white shadow-md text-white ring-1 ring-white/20"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 shrink-0 mt-0.5">
                    {r.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold block text-white">{r.label}</span>
                    <span className="text-[10px] text-zinc-400 leading-tight block">
                      {r.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Entrada de Cantidad mediante Teclado */}
        {selectedReason !== "marcado_agotado" && (
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
              2. Cantidad a {reasonObj.defaultMode === "subtract" ? "Descontar" : reasonObj.defaultMode === "add" ? "Sumar" : "Fijar"} (Edición Directa por Teclado):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-28 py-2 px-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white font-mono font-bold text-base focus:outline-none focus:border-white transition-colors text-center"
              />
              <div className="text-xs text-zinc-400">
                <span>{reasonObj.defaultMode === "subtract" ? "Se restará esta cantidad del inventario" : reasonObj.defaultMode === "add" ? "Se añadirá esta cantidad al inventario" : "Nuevo valor total en inventario"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Vista previa de Cambio de Stock */}
        <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-medium">Resultado en Inventario:</span>
          <div className="flex items-center gap-2 font-mono">
            <span className="text-zinc-400">{currentStock} u.</span>
            <span className="text-zinc-600">➔</span>
            <span className={`text-base font-extrabold ${calculatedNewStock === 0 ? "text-red-400" : calculatedNewStock <= 5 ? "text-amber-400" : "text-emerald-400"}`}>
              {calculatedNewStock} u.
            </span>
            <span className="text-[11px] text-zinc-500">
              ({calculatedNewStock - currentStock >= 0 ? `+${calculatedNewStock - currentStock}` : `${calculatedNewStock - currentStock}`})
            </span>
          </div>
        </div>

        {/* Notas / Detalle Adicional */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
            3. Detalle o Justificación (Opcional):
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej. Frasco quebrado al descargar caja / Muestra probador en mostrador"
            className="w-full py-2.5 px-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Botones de Acción con Anti-Spam */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                <span>Registrando...</span>
              </>
            ) : (
              <span>Confirmar Ajuste y Guardar en Logs</span>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
