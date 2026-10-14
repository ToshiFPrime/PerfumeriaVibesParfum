"use client";

import React from "react";
import Image from "next/image";
import { Search, Plus, Ban, SlidersHorizontal, Zap, RotateCcw, Trash2, EyeOff, Download } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types";
import { exportCatalogToCsv } from "@/lib/export/exportCsv";

export type StockFilterOption = "all" | "low" | "ok" | "out" | "paused";

interface CatalogStockTabProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  stockFilter: StockFilterOption;
  onStockFilterChange: (value: StockFilterOption) => void;
  perfumes: Product[];
  onUpdateStock: (productId: string, variantId: string, delta: number) => void;
  onSetDirectStock: (productId: string, variantId: string, newStock: number) => void;
  onExhaustAllVariants: (productId: string) => void;
  onRestockAllVariants: (productId: string, amount: number) => void;
  onOpenAdjustmentModal: (product: Product, variant: ProductVariant) => void;
  onOpenRemoveModal: (product: Product) => void;
  onReactivateProduct: (productId: string) => void;
  onOpenAddPerfume: () => void;
}

export function CatalogStockTab({
  searchTerm,
  onSearchChange,
  stockFilter,
  onStockFilterChange,
  perfumes,
  onUpdateStock,
  onSetDirectStock,
  onExhaustAllVariants,
  onRestockAllVariants,
  onOpenAdjustmentModal,
  onOpenRemoveModal,
  onReactivateProduct,
  onOpenAddPerfume,
}: CatalogStockTabProps) {
  const lowStockCount = perfumes.filter(
    (p) => p.isActive !== false && p.variants.some((v) => v.stock > 0 && v.stock <= 5)
  ).length;

  const outStockCount = perfumes.filter(
    (p) => p.isActive !== false && p.variants.some((v) => v.stock === 0)
  ).length;

  const pausedCount = perfumes.filter((p) => p.isActive === false).length;

  const filteredPerfumes = perfumes.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.olfactoryFamily.toLowerCase().includes(searchTerm.toLowerCase());

    const isPaused = p.isActive === false;
    const hasLowStock = p.variants.some((v) => v.stock > 0 && v.stock <= 5);
    const hasOutStock = p.variants.some((v) => v.stock === 0);

    if (stockFilter === "paused") return matchesSearch && isPaused;
    if (stockFilter === "low") return matchesSearch && !isPaused && hasLowStock;
    if (stockFilter === "out") return matchesSearch && !isPaused && hasOutStock;
    if (stockFilter === "ok") return matchesSearch && !isPaused && !hasLowStock && !hasOutStock;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por fragancia, marca o familia..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Filtros de stock y estado */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs flex-wrap gap-1">
            <button
              type="button"
              onClick={() => onStockFilterChange("all")}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                stockFilter === "all" ? "bg-zinc-800 text-white font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              Todos ({perfumes.length})
            </button>
            <button
              type="button"
              onClick={() => onStockFilterChange("low")}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                stockFilter === "low"
                  ? "bg-amber-950 text-amber-300 font-bold border border-amber-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>Stock Bajo</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[10px] opacity-80">({lowStockCount})</span>
            </button>
            <button
              type="button"
              onClick={() => onStockFilterChange("out")}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                stockFilter === "out"
                  ? "bg-red-950 text-red-300 font-bold border border-red-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>Agotados</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-[10px] opacity-80">({outStockCount})</span>
            </button>
            <button
              type="button"
              onClick={() => onStockFilterChange("paused")}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                stockFilter === "paused"
                  ? "bg-zinc-800 text-amber-300 font-bold border border-amber-500/40"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <EyeOff className="w-3 h-3 text-amber-400" />
              <span>Retirados</span>
              <span className="text-[10px] opacity-80">({pausedCount})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() =>
              exportCatalogToCsv(
                perfumes,
                `inventario_vibes_parfum_${new Date().toISOString().slice(0, 10)}.csv`
              )
            }
            className="min-h-[44px] px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
            title="Exportar catálogo e inventario completo a Excel / CSV"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Exportar Inventario</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddPerfume}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Añadir Fragancia</span>
          </button>
        </div>
      </div>

      {/* Grid de Productos con Controles de Stock Avanzados (Teclado, Botón Agotado, Agotar Todo y Dar de Baja con Motivo) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPerfumes.map((perfume) => {
          const isPaused = perfume.isActive === false;
          const allVariantsExhausted = perfume.variants.every((v) => v.stock === 0);

          return (
            <div
              key={perfume.id}
              className={`p-5 rounded-2xl border space-y-4 transition-all shadow-md flex flex-col justify-between ${
                isPaused
                  ? "bg-zinc-900/40 border-amber-500/30 ring-1 ring-amber-500/20"
                  : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-zinc-950 shrink-0 border border-zinc-800">
                      {perfume.images[0] && (
                        <Image
                          src={perfume.images[0]}
                          alt={perfume.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                          {perfume.brand}
                        </span>
                        {isPaused && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-950 text-amber-300 border border-amber-500/40">
                            PAUSADO
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white leading-tight">
                        {perfume.name}
                      </h3>
                      <span className="text-[11px] text-zinc-400">
                        {perfume.olfactoryFamily} • {perfume.gender}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Banner si el perfume está dado de baja o pausado con motivo */}
                {isPaused && (
                  <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="font-bold text-amber-300 text-[11px] block">Retirado de Tienda</span>
                        <span className="text-[10px] text-zinc-300 block truncate" title={perfume.statusReason}>
                          {perfume.statusReason || "Pausado temporalmente"}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onReactivateProduct(perfume.id)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold transition-all cursor-pointer shrink-0 active:scale-95"
                      title="Volver a activar en la tienda"
                    >
                      ▶ Reactivar
                    </button>
                  </div>
                )}

                {/* Barra de Acciones Rápidas: Agotar Todo de 1 Clic / Dar de Baja con Motivo */}
                <div className="flex items-center gap-2">
                  {!allVariantsExhausted ? (
                    <button
                      type="button"
                      onClick={() => onExhaustAllVariants(perfume.id)}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      title="Fijar 0 existencias en todas las presentaciones con un solo clic"
                    >
                      <Zap className="w-3.5 h-3.5 text-red-400" />
                      <span>⚡ Agotar Todo</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRestockAllVariants(perfume.id, 10)}
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      title="Reponer 10 unidades a todas las presentaciones"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                      <span>↺ Reponer Todo (+10)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onOpenRemoveModal(perfume)}
                    className="py-1.5 px-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 hover:border-amber-500/40 text-zinc-300 hover:text-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shrink-0"
                    title="Dar de baja con motivo lógico o pausar"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dar de Baja...</span>
                  </button>
                </div>
              </div>

            {/* Variantes y Control de Stock en Vivo con Edición Directa por Teclado */}
            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                Control de Existencias (Edición por Teclado o Botón):
              </span>
              <div className="space-y-2">
                {perfume.variants.map((v) => {
                  const isOut = v.stock === 0;
                  const isLow = v.stock > 0 && v.stock <= 5;

                  return (
                    <div
                      key={v.id}
                      className={`p-2.5 rounded-xl border text-xs space-y-2 transition-all ${
                        isOut
                          ? "bg-red-950/20 border-red-500/30"
                          : isLow
                          ? "bg-amber-950/20 border-amber-500/30"
                          : "bg-zinc-950/80 border-zinc-800/70"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-zinc-200">{v.label.split("(")[0]}</span>
                          <span className="text-[11px] text-zinc-400 block font-mono">
                            {formatPrice(v.price)}
                          </span>
                        </div>

                        {/* Botón rápido "Marcar como Agotado" / Estado */}
                        {isOut ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-900/60 text-red-300 border border-red-500/40 uppercase">
                              Sin Stock
                            </span>
                            <button
                              type="button"
                              onClick={() => onSetDirectStock(perfume.id, v.id, 10)}
                              className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all cursor-pointer"
                              title="Reponer 10 unidades rápidamente"
                            >
                              +10
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSetDirectStock(perfume.id, v.id, 0)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold bg-zinc-900 hover:bg-red-950/80 text-zinc-400 hover:text-red-300 border border-zinc-800 hover:border-red-500/40 transition-all cursor-pointer active:scale-95"
                            title="Fijar stock en 0 de inmediato"
                          >
                            <Ban className="w-3 h-3" />
                            <span>Agotar</span>
                          </button>
                        )}
                      </div>

                      {/* Control Numérico Directo por Teclado + Botones +/- + Botón Ajuste con Motivo */}
                      <div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-800/60">
                        {/* Selector Numérico Manual con Teclado */}
                        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => onUpdateStock(perfume.id, v.id, -1)}
                            className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center justify-center transition-colors cursor-pointer active:scale-90"
                            title="Descontar 1 unidad"
                          >
                            -
                          </button>

                          {/* Input de Teclado */}
                          <input
                            type="number"
                            min={0}
                            value={v.stock}
                            onChange={(e) =>
                              onSetDirectStock(
                                perfume.id,
                                v.id,
                                Math.max(0, parseInt(e.target.value) || 0)
                              )
                            }
                            aria-label={`Stock de ${v.label}`}
                            className={`w-12 py-0.5 text-center font-mono font-bold text-xs bg-zinc-950 border border-zinc-800 rounded text-white focus:outline-none focus:border-white transition-colors ${
                              isOut ? "text-red-400 font-extrabold" : isLow ? "text-amber-400" : "text-white"
                            }`}
                            title="Escribe directamente la cantidad con el teclado"
                          />

                          <button
                            type="button"
                            onClick={() => onUpdateStock(perfume.id, v.id, 1)}
                            className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center justify-center transition-colors cursor-pointer active:scale-90"
                            title="Sumar 1 unidad"
                          >
                            +
                          </button>
                        </div>

                        {/* Botón de Ajuste Especial (Rotura, Regalo/Muestra, etc.) */}
                        <button
                          type="button"
                          onClick={() => onOpenAdjustmentModal(perfume, v)}
                          className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-bold text-zinc-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          title="Registrar rotura, regalo o venta con justificación"
                        >
                          <SlidersHorizontal className="w-3 h-3 text-emerald-400" />
                          <span>Motivo...</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
      </div>
    </div>
  );
}
