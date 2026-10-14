"use client";

import React from "react";
import { Sparkles, Building2, TrendingUp } from "lucide-react";

export function SalesFinancesTab() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Fragancias Más Vendidas */}
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Top 5 Fragancias Más Deseadas
            </h3>
            <span className="text-[10px] text-zinc-400">Este mes</span>
          </div>
          <div className="space-y-3">
            {[
              { name: "Odyssey Marshmallow", brand: "Armaf", sales: "42 decants / 6 frascos", amount: "Bs. 4.800" },
              { name: "9 PM", brand: "Afnan", sales: "38 decants / 5 frascos", amount: "Bs. 4.200" },
              { name: "Eclaire", brand: "Lattafa", sales: "35 decants / 4 frascos", amount: "Bs. 3.950" },
              { name: "Hawas Ice", brand: "Rasasi", sales: "29 decants / 4 frascos", amount: "Bs. 3.820" },
              { name: "Pack Yara (4 en 1)", brand: "Lattafa", sales: "14 packs completos", amount: "Bs. 7.000" },
            ].map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <div>
                  <p className="font-bold text-white">{idx + 1}. {item.name}</p>
                  <p className="text-[10px] text-zinc-400">{item.brand} • {item.sales}</p>
                </div>
                <span className="font-mono font-bold text-emerald-400">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ventas por Departamento de Bolivia */}
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            Demanda por Departamento
          </h3>
          <div className="space-y-3">
            {[
              { dept: "La Paz (Sede & El Alto)", percent: "38%", orders: "16 pedidos" },
              { dept: "Santa Cruz de la Sierra", percent: "32%", orders: "14 pedidos" },
              { dept: "Cochabamba", percent: "18%", orders: "8 pedidos" },
              { dept: "Chuquisaca & Tarija", percent: "8%", orders: "4 pedidos" },
              { dept: "Oruro, Potosí, Beni, Pando", percent: "4%", orders: "2 pedidos" },
            ].map((dept) => (
              <div key={dept.dept} className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-300 font-medium">{dept.dept}</span>
                  <span className="font-mono font-bold text-white">{dept.percent}</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: dept.percent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rentabilidad: Decants vs Frascos */}
        <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Modelo de Negocio: Decants
          </h3>
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs space-y-2 text-zinc-300">
            <p className="font-bold text-white">¿Por qué triunfan los decants?</p>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              Un frasco de 100ml dosificado en 10 decants de 10ml a Bs. 80 genera <strong>Bs. 800</strong>, frente a Bs. 450 del frasco cerrado (+77% de margen comercial neto).
            </p>
            <div className="pt-2 flex items-center justify-between border-t border-zinc-800 font-mono text-[11px]">
              <span className="text-zinc-400">Ingresos por Decants:</span>
              <span className="text-emerald-400 font-bold">64% del total</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-zinc-400">Ingresos por Frascos:</span>
              <span className="text-white font-bold">36% del total</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
