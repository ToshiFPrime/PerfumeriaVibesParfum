"use client";

import React from "react";
import { Package, ShoppingCart, DollarSign, AlertTriangle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface AdminMetricsCardsProps {
  perfumesCount: number;
  totalRevenue: number;
  averageTicket: number;
  ordersCount: number;
  lowStockCount: number;
}

export function AdminMetricsCards({
  perfumesCount,
  totalRevenue,
  averageTicket,
  ordersCount,
  lowStockCount,
}: AdminMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 shadow-lg">
        <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
          <span>Catálogo Activo</span>
          <Package className="w-4 h-4 text-zinc-300" />
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-white">{perfumesCount}</p>
        <p className="text-[11px] text-zinc-400">Fragancias en tienda online</p>
      </div>

      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 shadow-lg">
        <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
          <span>Ventas Acumuladas</span>
          <DollarSign className="w-4 h-4 text-emerald-400" />
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{formatPrice(totalRevenue)}</p>
        <p className="text-[11px] text-zinc-400 font-mono">Ticket promedio: {formatPrice(averageTicket)}</p>
      </div>

      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 shadow-lg">
        <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
          <span>Pedidos Gestionados</span>
          <ShoppingCart className="w-4 h-4 text-zinc-300" />
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-white">{ordersCount}</p>
        <p className="text-[11px] text-emerald-400">Por WhatsApp y Web</p>
      </div>

      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 shadow-lg">
        <div className="flex items-center justify-between text-zinc-400 text-xs font-medium">
          <span>Alerta de Stock Bajo</span>
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        </div>
        <p className="text-2xl sm:text-3xl font-extrabold text-amber-300">{lowStockCount}</p>
        <p className="text-[11px] text-amber-400/80">Decants con ≤ 5 unidades</p>
      </div>
    </div>
  );
}
