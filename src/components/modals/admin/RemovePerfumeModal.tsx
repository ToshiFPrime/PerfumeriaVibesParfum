"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash2, AlertTriangle, Loader2, EyeOff } from "lucide-react";
import { BaseModal } from "@/components/modals/BaseModal";
import type { Product } from "@/types";

export type RemovalReason =
  | "distribuidor_agotado"
  | "descontinuado_marca"
  | "rotura_lote"
  | "probador_tienda"
  | "pausa_temporada"
  | "decision_comercial";

export interface RemovePerfumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirmRemoval: (
    productId: string,
    action: "pause" | "delete",
    reason: RemovalReason,
    reasonLabel: string,
    notes: string
  ) => void;
}

const REMOVAL_REASONS: {
  id: RemovalReason;
  label: string;
  description: string;
  icon: string;
}[] = [
  {
    id: "distribuidor_agotado",
    label: "Agotado en Proveedor / Dubai",
    description: "Sin existencias en fábrica ni distribuidor mayorista; imposible reabastecer a corto plazo.",
    icon: "🚫",
  },
  {
    id: "descontinuado_marca",
    label: "Descontinuado por la Casa Perfumera",
    description: "La marca (Armaf, Lattafa, etc.) ha dejado de fabricar este perfume oficialmente.",
    icon: "📉",
  },
  {
    id: "rotura_lote",
    label: "Pérdida o Rotura Total del Lote",
    description: "Daño físico o merma irreparable en los frascos durante transporte o almacén.",
    icon: "💥",
  },
  {
    id: "probador_tienda",
    label: "Destinado a Probador / Muestras Exclusivas",
    description: "El stock restante se retira de la venta pública para ser usado en el showroom o regalos.",
    icon: "🧪",
  },
  {
    id: "pausa_temporada",
    label: "Retiro por Temporada (Pausa)",
    description: "Fragancia estacional (ej. muy invernal o veraniega) que se pausará hasta la próxima temporada.",
    icon: "❄️",
  },
  {
    id: "decision_comercial",
    label: "Baja Demanda / Decisión Comercial",
    description: "Rotación baja o reemplazo por nueva versión con mejor rendimiento.",
    icon: "🏷️",
  },
];

export function RemovePerfumeModal({
  isOpen,
  onClose,
  product,
  onConfirmRemoval,
}: RemovePerfumeModalProps) {
  const [selectedReason, setSelectedReason] = useState<RemovalReason>("distribuidor_agotado");
  const [actionType, setActionType] = useState<"pause" | "delete">("pause");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const currentReasonObj =
    REMOVAL_REASONS.find((r) => r.id === selectedReason) || REMOVAL_REASONS[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Anti-spam
    setIsSubmitting(true);

    setTimeout(() => {
      onConfirmRemoval(
        product.id,
        actionType,
        selectedReason,
        currentReasonObj.label,
        notes.trim() || `${currentReasonObj.label}: producto ${actionType === "pause" ? "pausado" : "eliminado"} del catálogo`
      );
      setIsSubmitting(false);
      setNotes("");
      onClose();
    }, 400);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Dar de Baja / Retirar: ${product.name}`}
      subtitle="Justifica con lógica de negocio el motivo por el cual este perfume se retira de la tienda"
      icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1 text-xs">
        {/* Tarjeta del Perfume */}
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
            <span className="text-[10px] uppercase font-bold text-zinc-400">{product.brand}</span>
            <h4 className="text-sm font-bold text-white truncate">{product.name}</h4>
            <span className="text-[11px] text-zinc-400">
              {product.olfactoryFamily} • {product.variants.length} presentaciones activas
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/70 border border-amber-500/40 text-amber-300 shrink-0">
            {product.variants.reduce((s, v) => s + v.stock, 0)} u. en stock
          </span>
        </div>

        {/* 1. Selección de Acción (Pausar vs Eliminar) */}
        <div className="space-y-2">
          <label className="font-bold text-zinc-300 uppercase tracking-wider block">
            1. ¿Qué deseas hacer con esta fragancia?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setActionType("pause")}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                actionType === "pause"
                  ? "bg-zinc-850 border-white text-white shadow-md ring-1 ring-white/20"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <EyeOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Pausar / Ocultar de la Tienda (Recomendado)</span>
                <span className="text-[10px] text-zinc-400 block leading-tight mt-0.5">
                  Los clientes no podrán verla ni pedirla en el catálogo, pero conservas todas las reseñas e historial para reactivarla cuando llegue stock.
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActionType("delete")}
              className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                actionType === "delete"
                  ? "bg-red-950/40 border-red-500 text-red-200 shadow-md ring-1 ring-red-500/30"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-red-300"
              }`}
            >
              <Trash2 className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-red-300 block">Eliminar Permanentemente</span>
                <span className="text-[10px] text-zinc-400 block leading-tight mt-0.5">
                  Borra el perfume por completo de la base de datos de la tienda. Esta acción no se puede deshacer.
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Motivo Lógico del Retiro */}
        <div className="space-y-2">
          <label className="font-bold text-zinc-300 uppercase tracking-wider block">
            2. Motivo Lógico de la Baja (Se registrará en el Historial de Auditoría):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {REMOVAL_REASONS.map((r) => {
              const isSelected = selectedReason === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedReason(r.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-start gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-zinc-850 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400/20"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <span className="text-base shrink-0">{r.icon}</span>
                  <div>
                    <span className="font-bold text-zinc-200 block text-xs">{r.label}</span>
                    <span className="text-[10px] text-zinc-400 block leading-tight">
                      {r.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Observaciones Adicionales */}
        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">
            3. Justificación u Observaciones Específicas (Opcional):
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Ej. El proveedor en Dubai confirmó que ya no habrá más producción este año"
            className="w-full py-2.5 px-3.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Botones de Acción con Anti-Spam */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 text-zinc-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`min-h-[44px] px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer ${
              actionType === "delete"
                ? "bg-red-600 hover:bg-red-500 text-white"
                : "bg-white hover:bg-zinc-200 text-zinc-950"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : actionType === "delete" ? (
              <span>Confirmar Eliminación Definitiva</span>
            ) : (
              <span>Pausar Fragancia y Guardar en Logs</span>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
