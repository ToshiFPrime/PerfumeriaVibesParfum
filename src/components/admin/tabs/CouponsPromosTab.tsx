"use client";

import React from "react";
import { Plus } from "lucide-react";
import type { DiscountCoupon } from "@/types";

interface CouponsPromosTabProps {
  coupons: DiscountCoupon[];
  onOpenAddCoupon: () => void;
}

export function CouponsPromosTab({
  coupons,
  onOpenAddCoupon,
}: CouponsPromosTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Códigos Promocionales Activos</h3>
          <p className="text-xs text-zinc-400">
            Los clientes pueden aplicar estos códigos directamente en el carrito de compras.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenAddCoupon}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Cupón</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((cp) => (
          <div
            key={cp.code}
            className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 relative overflow-hidden"
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-lg bg-white text-zinc-950 font-mono text-sm font-extrabold tracking-wider">
                {cp.code}
              </span>
              <span className="text-emerald-400 font-extrabold text-sm">
                {cp.percentage}% OFF
              </span>
            </div>
            <p className="text-xs text-zinc-400">{cp.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
