"use client";

import React, { useState } from "react";
import {
  Calculator,
  TrendingUp,
  Percent,
  Layers,
  FlaskConical,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface DecantingCalculatorTabProps {
  perfumes?: Product[];
}

interface FragrancePreset {
  name: string;
  brand: string;
  bottleSizeMl: number;
  bottleCostBs: number;
  suggestedDecants: {
    sizeMl: number;
    priceBs: number;
  }[];
}

const POPULAR_PRESETS: FragrancePreset[] = [
  {
    name: "Club de Nuit Intense Man",
    brand: "Armaf",
    bottleSizeMl: 105,
    bottleCostBs: 380,
    suggestedDecants: [
      { sizeMl: 5, priceBs: 40 },
      { sizeMl: 10, priceBs: 75 },
    ],
  },
  {
    name: "Khamrah",
    brand: "Lattafa",
    bottleSizeMl: 100,
    bottleCostBs: 340,
    suggestedDecants: [
      { sizeMl: 5, priceBs: 45 },
      { sizeMl: 10, priceBs: 85 },
    ],
  },
  {
    name: "Asad",
    brand: "Lattafa",
    bottleSizeMl: 100,
    bottleCostBs: 290,
    suggestedDecants: [
      { sizeMl: 5, priceBs: 35 },
      { sizeMl: 10, priceBs: 65 },
    ],
  },
  {
    name: "Sauvage Elixir",
    brand: "Dior",
    bottleSizeMl: 60,
    bottleCostBs: 1350,
    suggestedDecants: [
      { sizeMl: 5, priceBs: 180 },
      { sizeMl: 10, priceBs: 320 },
    ],
  },
  {
    name: "Baccarat Rouge 540 Extrait",
    brand: "Maison Francis Kurkdjian",
    bottleSizeMl: 70,
    bottleCostBs: 2900,
    suggestedDecants: [
      { sizeMl: 3, priceBs: 210 },
      { sizeMl: 5, priceBs: 320 },
      { sizeMl: 10, priceBs: 580 },
    ],
  },
];

export function DecantingCalculatorTab({ perfumes = [] }: DecantingCalculatorTabProps) {
  const [fragranceName, setFragranceName] = useState("Lattafa Khamrah");
  const [bottleCostBs, setBottleCostBs] = useState(340);
  const [bottleSizeMl, setBottleSizeMl] = useState(100);
  const [targetDecantSizeMl, setTargetDecantSizeMl] = useState(5);
  const [decantPriceBs, setDecantPriceBs] = useState(45);
  const [vialAtomizerCostBs, setVialAtomizerCostBs] = useState(3.5);
  const [wasteLossPercentage, setWasteLossPercentage] = useState(4); // 4% de pérdida de líquido

  // Cálculos en tiempo real
  const effectiveMl = bottleSizeMl * (1 - wasteLossPercentage / 100);
  const costPerMl = bottleCostBs / bottleSizeMl;
  const decantJuiceCost = costPerMl * targetDecantSizeMl;
  const totalUnitCostPerDecant = decantJuiceCost + vialAtomizerCostBs;
  const netProfitPerDecant = decantPriceBs - totalUnitCostPerDecant;
  const totalDecantsYield = Math.floor(effectiveMl / targetDecantSizeMl);

  const totalGrossRevenue = totalDecantsYield * decantPriceBs;
  const totalInvestment = bottleCostBs + totalDecantsYield * vialAtomizerCostBs;
  const totalNetProfit = totalGrossRevenue - totalInvestment;

  const profitMarginPercent = totalUnitCostPerDecant > 0
    ? (netProfitPerDecant / totalUnitCostPerDecant) * 100
    : 0;

  const breakEvenDecants = netProfitPerDecant > 0
    ? Math.ceil(bottleCostBs / (decantPriceBs - vialAtomizerCostBs))
    : 0;

  const handleApplyPreset = (preset: FragrancePreset) => {
    setFragranceName(`${preset.brand} - ${preset.name}`);
    setBottleCostBs(preset.bottleCostBs);
    setBottleSizeMl(preset.bottleSizeMl);
    const defaultDecant = preset.suggestedDecants[0];
    if (defaultDecant) {
      setTargetDecantSizeMl(defaultDecant.sizeMl);
      setDecantPriceBs(defaultDecant.priceBs);
    }
  };

  const handleSelectCatalogPerfume = (perfumeId: string) => {
    const found = perfumes.find((p) => p.id === perfumeId);
    if (!found) return;
    const bottleVariant =
      found.variants.find((v) => v.milliliters >= 50 || v.label.toLowerCase().includes("frasco")) ||
      found.variants[0];
    if (bottleVariant) {
      setBottleCostBs(Math.round(bottleVariant.price * 0.7)); // estimado de costo de compra mayorista
      if (bottleVariant.milliliters) {
        setBottleSizeMl(bottleVariant.milliliters);
      }
    }
    const decantVariant = found.variants.find(
      (v) => v.milliliters <= 15 || v.label.toLowerCase().includes("decant")
    );
    if (decantVariant) {
      setDecantPriceBs(decantVariant.price);
      if (decantVariant.milliliters === 5 || decantVariant.label.includes("5")) setTargetDecantSizeMl(5);
      else if (decantVariant.milliliters === 10 || decantVariant.label.includes("10")) setTargetDecantSizeMl(10);
    }
  };

  // Comparador de presentaciones (2ml, 3ml, 5ml, 10ml)
  const sizesToCompare = [2, 3, 5, 10];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Banner de Presentación */}
      <div className="p-5 rounded-3xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Calculator className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Calculadora de Márgenes & Precios de Decants
              <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                Boutique Pro
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Simula costos de frasco, atomizadores, mermas de pipeta y fija precios ideales en Bolivianos (Bs.) para maximizar tu retorno de inversión.
            </p>
          </div>
        </div>

        {/* Presets Rápidos */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-zinc-500 font-medium mr-1">Presets:</span>
          {POPULAR_PRESETS.map((pr) => (
            <button
              key={pr.name}
              type="button"
              onClick={() => handleApplyPreset(pr)}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              {pr.name.split(" ")[0]} ({pr.bottleCostBs} Bs)
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMNA IZQUIERDA: INPUTS DE COSTOS (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-5">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-amber-400" />
              1. Datos del Frasco Matriz (Original)
            </h4>

            {/* Perfume Nombre */}
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-zinc-300">Nombre de la Fragancia:</label>
              <input
                type="text"
                value={fragranceName}
                onChange={(e) => setFragranceName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-amber-400/80 transition-colors"
              />
            </div>

            {/* Selector de perfume de catálogo si está disponible */}
            {perfumes.length > 0 && (
              <div className="space-y-1.5 text-xs">
                <label className="text-zinc-400 text-[11px]">O importar de tu catálogo:</label>
                <select
                  onChange={(e) => handleSelectCatalogPerfume(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs focus:outline-none focus:border-amber-400/80 transition-colors cursor-pointer"
                >
                  <option value="">-- Seleccionar perfume del catálogo --</option>
                  {perfumes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.brand} - {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Costo del Frasco */}
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Costo Frasco (Bs.):</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={bottleCostBs}
                    onChange={(e) => setBottleCostBs(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-amber-400/80 transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">
                    Bs.
                  </span>
                </div>
              </div>

              {/* Volumen Frasco */}
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Capacidad (ml):</label>
                <select
                  value={bottleSizeMl}
                  onChange={(e) => setBottleSizeMl(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-amber-400/80 transition-colors cursor-pointer"
                >
                  <option value="50">50 ml</option>
                  <option value="60">60 ml</option>
                  <option value="70">70 ml</option>
                  <option value="75">75 ml</option>
                  <option value="100">100 ml</option>
                  <option value="105">105 ml (Armaf)</option>
                  <option value="125">125 ml</option>
                  <option value="200">200 ml</option>
                </select>
              </div>
            </div>

            {/* Costo por ml info */}
            <div className="p-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Costo líquido por mililitro:</span>
              <span className="font-mono font-bold text-amber-300">
                {costPerMl.toFixed(2)} Bs./ml
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-5">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              2. Parámetros del Decant
            </h4>

            {/* Selector de Tamaño Decant */}
            <div className="space-y-2 text-xs">
              <label className="font-semibold text-zinc-300">Tamaño del Decant:</label>
              <div className="grid grid-cols-4 gap-2">
                {[2, 3, 5, 10].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setTargetDecantSizeMl(size);
                      if (size === 2) setDecantPriceBs(Math.round(costPerMl * 2 * 2.8 + vialAtomizerCostBs));
                      if (size === 3) setDecantPriceBs(Math.round(costPerMl * 3 * 2.5 + vialAtomizerCostBs));
                      if (size === 5) setDecantPriceBs(Math.round(costPerMl * 5 * 2.3 + vialAtomizerCostBs));
                      if (size === 10) setDecantPriceBs(Math.round(costPerMl * 10 * 2.0 + vialAtomizerCostBs));
                    }}
                    className={`py-2 rounded-xl font-bold font-mono text-xs transition-all cursor-pointer ${
                      targetDecantSizeMl === size
                        ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-950/40"
                        : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    {size} ml
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Precio de Venta al Público */}
              <div className="space-y-1.5">
                <label className="font-semibold text-emerald-400">PVP Venta (Bs.):</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    value={decantPriceBs}
                    onChange={(e) => setDecantPriceBs(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-emerald-500/50 text-emerald-300 font-mono font-bold text-xs focus:outline-none focus:border-emerald-400 transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">
                    Bs.
                  </span>
                </div>
              </div>

              {/* Costo Atomizador/Envase */}
              <div className="space-y-1.5">
                <label className="font-semibold text-zinc-300">Costo Envase/Spray (Bs.):</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={vialAtomizerCostBs}
                    onChange={(e) => setVialAtomizerCostBs(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-amber-400/80 transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">
                    Bs.
                  </span>
                </div>
              </div>
            </div>

            {/* Merma de llenado */}
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <label className="text-zinc-400 text-[11px]">Merma / Pérdida en pipeta o jeringa:</label>
                <span className="font-mono text-zinc-300 text-xs">{wasteLossPercentage}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="1"
                value={wasteLossPercentage}
                onChange={(e) => setWasteLossPercentage(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: RESULTADOS FINANCIEROS & DASHBOARD DE MARGEN (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card Principal de Resumen con ROI */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800/80 space-y-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                  Rendimiento Estimado
                </span>
                <h3 className="text-lg font-bold text-white font-serif mt-0.5">
                  Decant de {targetDecantSizeMl}ml — {fragranceName}
                </h3>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                  profitMarginPercent >= 100
                    ? "bg-emerald-950/70 border-emerald-500/50 text-emerald-300"
                    : profitMarginPercent >= 50
                    ? "bg-amber-950/70 border-amber-500/50 text-amber-300"
                    : "bg-rose-950/70 border-rose-500/50 text-rose-300"
                }`}
              >
                <Percent className="w-3.5 h-3.5" />
                <span>ROI +{profitMarginPercent.toFixed(0)}%</span>
              </div>
            </div>

            {/* Grid de 4 Métricas Clave */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Costo Unitario</span>
                <p className="text-base font-extrabold text-white font-mono">
                  {totalUnitCostPerDecant.toFixed(2)} <span className="text-xs text-zinc-400">Bs</span>
                </p>
                <p className="text-[10px] text-zinc-500">
                  {decantJuiceCost.toFixed(1)} liq + {vialAtomizerCostBs.toFixed(1)} env
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Ganancia / Decant</span>
                <p className="text-base font-extrabold text-emerald-400 font-mono">
                  +{netProfitPerDecant.toFixed(2)} <span className="text-xs text-emerald-500">Bs</span>
                </p>
                <p className="text-[10px] text-emerald-500/80">
                  {((netProfitPerDecant / decantPriceBs) * 100).toFixed(0)}% sobre PVP
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Decants Totales</span>
                <p className="text-base font-extrabold text-amber-300 font-mono">
                  {totalDecantsYield} <span className="text-xs text-zinc-400">unids</span>
                </p>
                <p className="text-[10px] text-zinc-500">
                  de {bottleSizeMl}ml (-{wasteLossPercentage}% merma)
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Recuperación (P.E.)</span>
                <p className="text-base font-extrabold text-cyan-300 font-mono">
                  {breakEvenDecants} <span className="text-xs text-zinc-400">decants</span>
                </p>
                <p className="text-[10px] text-cyan-500/80">
                  Inversión recuperada
                </p>
              </div>
            </div>

            {/* Barra de Ganancia Total del Frasco Decantado */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Ganancia Neta Total al vaciar el frasco en {targetDecantSizeMl}ml:
                </span>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Ingreso total: {formatPrice(totalGrossRevenue)} — Costo total: {formatPrice(totalInvestment)}
                </p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  +{formatPrice(totalNetProfit)}
                </span>
              </div>
            </div>
          </div>

          {/* TABLA COMPARATIVA RÁPIDA: 2ml vs 3ml vs 5ml vs 10ml */}
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>Comparativa Multi-Tamaño para esta Fragancia</span>
              <span className="text-[11px] text-zinc-400 normal-case font-normal">
                Base frasco: {bottleSizeMl}ml ({formatPrice(bottleCostBs)})
              </span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="pb-3 font-semibold">Tamaño</th>
                    <th className="pb-3 font-semibold">Decants</th>
                    <th className="pb-3 font-semibold">Costo C/U</th>
                    <th className="pb-3 font-semibold">PVP Sugerido</th>
                    <th className="pb-3 font-semibold">Ganancia C/U</th>
                    <th className="pb-3 font-semibold">Beneficio Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {sizesToCompare.map((sz) => {
                    const decCost = costPerMl * sz + vialAtomizerCostBs;
                    const yieldDecants = Math.floor(effectiveMl / sz);
                    // Precio sugerido con markup estándar de perfumería
                    const suggestedPrice = Math.round(
                      sz === 2
                        ? decCost * 2.8
                        : sz === 3
                        ? decCost * 2.5
                        : sz === 5
                        ? decCost * 2.3
                        : decCost * 2.0
                    );
                    const netProfitUnit = suggestedPrice - decCost;
                    const totalProfitForSize = yieldDecants * netProfitUnit;

                    const isCurrent = targetDecantSizeMl === sz;

                    return (
                      <tr
                        key={sz}
                        className={`transition-colors ${
                          isCurrent ? "bg-amber-500/10 font-bold" : "hover:bg-zinc-800/40"
                        }`}
                      >
                        <td className="py-3 font-mono text-white flex items-center gap-1.5">
                          {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                          <span>{sz} ml</span>
                        </td>
                        <td className="py-3 font-mono text-zinc-300">{yieldDecants} unids</td>
                        <td className="py-3 font-mono text-zinc-400">{decCost.toFixed(1)} Bs</td>
                        <td className="py-3 font-mono text-emerald-400">{suggestedPrice} Bs</td>
                        <td className="py-3 font-mono text-white">+{netProfitUnit.toFixed(1)} Bs</td>
                        <td className="py-3 font-mono font-bold text-amber-300">
                          +{formatPrice(totalProfitForSize)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-zinc-500 pt-1">
              * Los decants más pequeños (2ml y 3ml) tienen el markup porcentual más alto del mercado boliviano, ideales para packs de descubrimiento (&quot;Discovery Sets&quot;).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
