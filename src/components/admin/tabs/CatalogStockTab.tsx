"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Ban,
  SlidersHorizontal,
  Zap,
  RotateCcw,
  Trash2,
  EyeOff,
  Download,
  Filter,
  Sparkles,
  ArrowUpDown,
  Tag,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types";
import { exportCatalogToCsv } from "@/lib/export/exportCsv";

export type StockFilterOption = "all" | "low" | "ok" | "out" | "paused";
export type CatalogSortOption = "name_asc" | "critical_stock" | "price_desc" | "price_asc";

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
  // Filtros internos avanzados
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [decantFilter, setDecantFilter] = useState<"all" | "with_decant" | "bottle_only">("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<CatalogSortOption>("name_asc");

  // Lista única de marcas para el dropdown
  const uniqueBrands = useMemo(() => {
    const brands = new Set(perfumes.map((p) => p.brand).filter(Boolean));
    return Array.from(brands).sort();
  }, [perfumes]);

  const lowStockCount = useMemo(() => {
    return perfumes.filter(
      (p) => p.isActive !== false && p.variants.some((v) => v.stock > 0 && v.stock <= 5)
    ).length;
  }, [perfumes]);

  const outStockCount = useMemo(() => {
    return perfumes.filter(
      (p) => p.isActive !== false && p.variants.some((v) => v.stock === 0)
    ).length;
  }, [perfumes]);

  const pausedCount = useMemo(() => {
    return perfumes.filter((p) => p.isActive === false).length;
  }, [perfumes]);

  // Filtrado y ordenamiento compuesto
  const filteredPerfumes = useMemo(() => {
    return perfumes
      .filter((p) => {
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.olfactoryFamily.toLowerCase().includes(term);

        const isPaused = p.isActive === false;
        const hasLowStock = p.variants.some((v) => v.stock > 0 && v.stock <= 5);
        const hasOutStock = p.variants.some((v) => v.stock === 0);

        // Filtro de Stock
        let matchesStock = true;
        if (stockFilter === "paused") matchesStock = isPaused;
        else if (stockFilter === "low") matchesStock = !isPaused && hasLowStock;
        else if (stockFilter === "out") matchesStock = !isPaused && hasOutStock;
        else if (stockFilter === "ok") matchesStock = !isPaused && !hasLowStock && !hasOutStock;

        // Filtro de Marca
        const matchesBrand = brandFilter === "all" || p.brand === brandFilter;

        // Filtro de Decant
        const hasDecants = p.variants.some(
          (v) => v.milliliters === 5 || v.milliliters === 10 || v.label.toLowerCase().includes("decant")
        );
        let matchesDecant = true;
        if (decantFilter === "with_decant") matchesDecant = hasDecants;
        else if (decantFilter === "bottle_only") matchesDecant = !hasDecants;

        // Filtro de Género
        const matchesGender = genderFilter === "all" || p.gender === genderFilter;

        return matchesSearch && matchesStock && matchesBrand && matchesDecant && matchesGender;
      })
      .sort((a, b) => {
        if (sortOption === "critical_stock") {
          // Menor stock total de variantes primero
          const totalStockA = a.variants.reduce((acc, v) => acc + v.stock, 0);
          const totalStockB = b.variants.reduce((acc, v) => acc + v.stock, 0);
          return totalStockA - totalStockB;
        }
        if (sortOption === "price_desc") {
          const maxPriceA = Math.max(...a.variants.map((v) => v.price));
          const maxPriceB = Math.max(...b.variants.map((v) => v.price));
          return maxPriceB - maxPriceA;
        }
        if (sortOption === "price_asc") {
          const minPriceA = Math.min(...a.variants.map((v) => v.price));
          const minPriceB = Math.min(...b.variants.map((v) => v.price));
          return minPriceA - minPriceB;
        }
        // name_asc
        return a.name.localeCompare(b.name);
      });
  }, [perfumes, searchTerm, stockFilter, brandFilter, decantFilter, genderFilter, sortOption]);

  const hasAdvancedFilters =
    searchTerm !== "" ||
    stockFilter !== "all" ||
    brandFilter !== "all" ||
    decantFilter !== "all" ||
    genderFilter !== "all" ||
    sortOption !== "name_asc";

  const handleResetFilters = () => {
    onSearchChange("");
    onStockFilterChange("all");
    setBrandFilter("all");
    setDecantFilter("all");
    setGenderFilter("all");
    setSortOption("name_asc");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Barra Superior con Acciones Principales */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>📦 Catálogo & Control de Existencias</span>
            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-[11px]">
              {filteredPerfumes.length} de {perfumes.length} fragancias
            </span>
          </h3>
          <p className="text-xs text-zinc-400">
            Ajusta unidades en tiempo real, marca decants o frascos completos agotados y exporta reportes de stock.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {hasAdvancedFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium flex items-center gap-1.5 transition-all text-xs cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar Filtros</span>
            </button>
          )}

          <button
            type="button"
            onClick={() =>
              exportCatalogToCsv(
                filteredPerfumes,
                `inventario_vibes_parfum_${new Date().toISOString().slice(0, 10)}.csv`
              )
            }
            className="px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-zinc-200 hover:text-white font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer active:scale-95 shrink-0"
            title="Exportar catálogo filtrado a Excel / CSV"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            type="button"
            onClick={onOpenAddPerfume}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Añadir Fragancia</span>
          </button>
        </div>
      </div>

      {/* Caja de Filtros Avanzados y Búsqueda */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 space-y-3.5 shadow-lg">
        {/* Fila 1: Búsqueda y Ordenamiento */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por fragancia, casa árabe / nicho, o familia olfativa..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as CatalogSortOption)}
              className="py-2.5 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-medium focus:outline-none focus:border-white cursor-pointer"
            >
              <option value="name_asc">Nombre (A - Z)</option>
              <option value="critical_stock">🚨 Stock Crítico Primero (≤ 3 u.)</option>
              <option value="price_desc">Mayor precio primero</option>
              <option value="price_asc">Menor precio primero</option>
            </select>
          </div>
        </div>

        {/* Fila 2: Píldoras de Estado de Stock */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => onStockFilterChange("all")}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
              stockFilter === "all"
                ? "bg-white text-zinc-950 font-bold shadow-md"
                : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            Todos ({perfumes.length})
          </button>
          <button
            type="button"
            onClick={() => onStockFilterChange("low")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              stockFilter === "low"
                ? "bg-amber-500 text-zinc-950 font-bold shadow-md"
                : "bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 border border-amber-500/30"
            }`}
          >
            <span>Stock Bajo</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span className="text-[11px] font-mono">({lowStockCount})</span>
          </button>
          <button
            type="button"
            onClick={() => onStockFilterChange("out")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              stockFilter === "out"
                ? "bg-red-500 text-white font-bold shadow-md"
                : "bg-red-950/40 text-red-300 hover:bg-red-900/50 border border-red-500/30"
            }`}
          >
            <span>Agotados</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="text-[11px] font-mono">({outStockCount})</span>
          </button>
          <button
            type="button"
            onClick={() => onStockFilterChange("paused")}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              stockFilter === "paused"
                ? "bg-zinc-800 text-amber-300 font-bold border border-amber-500/40"
                : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
            }`}
          >
            <EyeOff className="w-3 h-3 text-amber-400" />
            <span>Retirados</span>
            <span className="text-[11px] font-mono">({pausedCount})</span>
          </button>
        </div>

        {/* Fila 3: Filtros Dropdown Específicos (Casa, Decants, Género) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/60">
          {/* Dropdown de Casas / Marcas */}
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-white cursor-pointer"
            >
              <option value="all">Todas las Casas ({uniqueBrands.length})</option>
              {uniqueBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown de Disponibilidad de Decants */}
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <select
              value={decantFilter}
              onChange={(e) => setDecantFilter(e.target.value as "all" | "with_decant" | "bottle_only")}
              className="py-1.5 px-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-white cursor-pointer"
            >
              <option value="all">Presentaciones (Todas)</option>
              <option value="with_decant">Con Decant (5ml / 10ml)</option>
              <option value="bottle_only">Solo Frasco Completo</option>
            </select>
          </div>

          {/* Dropdown de Género */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-white cursor-pointer"
            >
              <option value="all">Género (Todos)</option>
              <option value="Unisex">Unisex</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Productos */}
      {filteredPerfumes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
          <SlidersHorizontal className="w-10 h-10 text-zinc-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">No hay fragancias que coincidan con estos filtros</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Prueba a seleccionar &quot;Todas las Casas&quot;, borrar la búsqueda o restablecer los filtros aplicados.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            Restablecer todos los filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPerfumes.map((perfume) => {
            const isPaused = perfume.isActive === false;
            const allVariantsExhausted = perfume.variants.every((v) => v.stock === 0);

            return (
              <div
                key={perfume.id}
                className={`p-4 sm:p-5 rounded-2xl border space-y-4 transition-all shadow-md flex flex-col justify-between ${
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

                  {/* Banner si el perfume está dado de baja o pausado */}
                  {isPaused && (
                    <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <EyeOff className="w-4 h-4 text-amber-400 shrink-0" />
                        <div className="min-w-0">
                          <span className="font-bold text-amber-300 text-[11px] block">Retirado de Tienda</span>
                          <span className="text-[10px] text-amber-400/80 truncate block">
                            {perfume.statusReason || "Pausado temporalmente"}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onReactivateProduct(perfume.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-[11px] font-bold transition-all shrink-0 cursor-pointer"
                      >
                        Reactivar
                      </button>
                    </div>
                  )}

                  {/* Variantes y stock */}
                  <div className="space-y-2 pt-1 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400">
                      <span>Presentaciones & Existencias:</span>
                      <span className="text-[10px] font-mono">Edición Directa</span>
                    </div>

                    <div className="space-y-1.5">
                      {perfume.variants.map((v) => {
                        const isOut = v.stock === 0;
                        const isLow = v.stock > 0 && v.stock <= 5;

                        return (
                          <div
                            key={v.id}
                            className={`p-2 rounded-xl flex items-center justify-between gap-2 border transition-colors ${
                              isOut
                                ? "bg-red-950/20 border-red-500/30 text-red-200"
                                : isLow
                                ? "bg-amber-950/20 border-amber-500/30 text-amber-200"
                                : "bg-zinc-950 border-zinc-800/80 text-zinc-300"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-xs font-medium truncate">{v.label}</span>
                              <span className="text-[10px] text-zinc-500 font-mono">
                                ({formatPrice(v.price)})
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* Botón Decrementar */}
                              <button
                                type="button"
                                onClick={() => onUpdateStock(perfume.id, v.id, -1)}
                                disabled={v.stock === 0}
                                className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                                title="Restar 1 unidad"
                              >
                                -
                              </button>

                              {/* Input Numérico Directo */}
                              <input
                                type="number"
                                min="0"
                                value={v.stock}
                                onChange={(e) =>
                                  onSetDirectStock(
                                    perfume.id,
                                    v.id,
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-12 py-0.5 text-center bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-mono font-bold text-white focus:outline-none focus:border-white"
                                title="Escribe la cantidad exacta para actualizar inmediatamente"
                              />

                              {/* Botón Incrementar */}
                              <button
                                type="button"
                                onClick={() => onUpdateStock(perfume.id, v.id, 1)}
                                className="w-6 h-6 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                                title="Sumar 1 unidad"
                              >
                                +
                              </button>

                              {/* Botón Agotar Inmediato */}
                              <button
                                type="button"
                                onClick={() => onSetDirectStock(perfume.id, v.id, 0)}
                                disabled={v.stock === 0}
                                className="p-1 rounded-lg bg-zinc-800/80 hover:bg-red-950 text-zinc-400 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                title="Marcar esta variante como agotada (Stock = 0)"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>

                              {/* Botón Motivo / Auditoría */}
                              <button
                                type="button"
                                onClick={() => onOpenAdjustmentModal(perfume, v)}
                                className="p-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                title="Ajuste especial con registro de motivo (Rotura, Muestra, Venta WhatsApp, etc.)"
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Acciones Rápidas Masivas */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {allVariantsExhausted ? (
                      <button
                        type="button"
                        onClick={() => onRestockAllVariants(perfume.id, 5)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="Reabastecer todas las presentaciones con 5 unidades"
                      >
                        <Zap className="w-3 h-3 text-emerald-400" />
                        <span>Reabastecer (+5)</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onExhaustAllVariants(perfume.id)}
                        className="px-2.5 py-1 rounded-lg bg-red-950/40 hover:bg-red-900 border border-red-500/30 text-red-300 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        title="Poner en 0 todas las presentaciones de este perfume"
                      >
                        <Ban className="w-3 h-3 text-red-400" />
                        <span>Agotar Todo</span>
                      </button>
                    )}
                  </div>

                  {/* Botón Retirar / Dar de baja con motivo */}
                  {!isPaused && (
                    <button
                      type="button"
                      onClick={() => onOpenRemoveModal(perfume)}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 text-[10px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                      title="Dar de baja o pausar producto en catálogo con motivo lógico"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Retirar</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
