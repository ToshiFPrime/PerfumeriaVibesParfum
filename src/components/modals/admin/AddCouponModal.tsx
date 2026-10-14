"use client";

import React, { useState } from "react";
import { Tag, Loader2 } from "lucide-react";
import type { DiscountCoupon } from "@/types";
import { BaseModal } from "@/components/modals/BaseModal";

export interface AddCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCoupon: (coupon: DiscountCoupon) => void;
}

export function AddCouponModal({ isOpen, onClose, onAddCoupon }: AddCouponModalProps) {
  const [code, setCode] = useState("");
  const [percentage, setPercentage] = useState("10");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Anti-spam
    if (!code.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newCoupon: DiscountCoupon = {
        code: code.trim().toUpperCase(),
        percentage: parseInt(percentage, 10) || 10,
        description: description.trim() || `Descuento especial de ${percentage}%`,
        minSubtotal: 0,
      };

      onAddCoupon(newCoupon);
      setCode("");
      setPercentage("10");
      setDescription("");
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Cupón de Descuento"
      subtitle="Define el porcentaje y código promocional para el carrito y checkout"
      icon={<Tag className="w-5 h-5 text-emerald-400" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Código del Cupón *</label>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ej. VIBES20"
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono uppercase"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Porcentaje de Descuento (%) *</label>
          <input
            type="number"
            required
            min={1}
            max={90}
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Descripción Promocional</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ej. Válido en tu compra de decants o frascos"
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed text-zinc-950 font-bold text-xs shadow-lg transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
              <span>Activando Cupón...</span>
            </>
          ) : (
            <span>Activar Cupón en Checkout</span>
          )}
        </button>
      </form>
    </BaseModal>
  );
}
