"use client";

import React from "react";
import { Layers, Plus, Eye, EyeOff, Globe } from "lucide-react";
import type { PerfumeBrand } from "@/types/admin";

interface BrandsCategoriesTabProps {
  brands: PerfumeBrand[];
  brandFilter: string;
  onBrandFilterChange: (category: string) => void;
  onToggleBrandActive: (id: string) => void;
  onOpenAddBrand: () => void;
}

export function BrandsCategoriesTab({
  brands,
  brandFilter,
  onBrandFilterChange,
  onToggleBrandActive,
  onOpenAddBrand,
}: BrandsCategoriesTabProps) {
  const filteredBrands = brands.filter((b) => {
    if (brandFilter === "all") return true;
    return b.category === brandFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Casas de Perfumería & Categorías
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Controla las casas oficiales visibles en los filtros de la tienda online (Árabes, Diseñador y Nicho).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
            {["all", "Árabe / Dubai", "Diseñador Lujo", "Nicho / Exclusivo"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onBrandFilterChange(cat)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  brandFilter === cat
                    ? "bg-zinc-800 text-white font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {cat === "all" ? "Todas" : cat.split(" / ")[0]}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenAddBrand}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Casa</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map((brand) => (
          <div
            key={brand.id}
            className={`p-5 rounded-2xl border transition-all shadow-md space-y-4 ${
              brand.isActive
                ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                : "bg-zinc-950/40 border-zinc-800/40 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 uppercase tracking-wider">
                  {brand.category}
                </span>
                <h4 className="text-base font-extrabold text-white mt-2">
                  {brand.name}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => onToggleBrandActive(brand.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  brand.isActive
                    ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                    : "bg-zinc-800 text-zinc-400"
                }`}
                title="Activar u ocultar de los filtros de la tienda"
              >
                {brand.isActive ? (
                  <>
                    <Eye className="w-3 h-3" />
                    <span>Visible</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3" />
                    <span>Oculta</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 border-t border-zinc-800/80 space-y-1.5 text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                <span>Origen: <strong className="text-zinc-200">{brand.origin}</strong></span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span>Fragancias en tienda:</span>
                <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-zinc-800">
                  {brand.perfumesCount} activos
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
