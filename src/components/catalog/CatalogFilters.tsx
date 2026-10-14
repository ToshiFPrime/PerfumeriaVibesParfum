"use client";

import React from "react";
import { RotateCcw, Check, Tag, SlidersHorizontal } from "lucide-react";
import type { OlfactoryFamily, Gender, Concentration, FilterState } from "@/types";

const ALL_FAMILIES: OlfactoryFamily[] = [
  "Amaderada",
  "Oriental / Ámbar",
  "Gourmand",
  "Cítrica",
  "Floral",
  "Cuero",
  "Acuática",
  "Aromática",
];

const ALL_GENDERS: Gender[] = ["Hombre", "Mujer", "Unisex"];

const ALL_CONCENTRATIONS: Concentration[] = [
  "Extrait de Parfum",
  "Eau de Parfum (EDP)",
  "Eau de Toilette (EDT)",
];

const ALL_BRANDS = [
  "Creed",
  "Maison Francis Kurkdjian",
  "Tom Ford Private Blend",
  "Tom Ford",
  "Parfums de Marly",
  "Dior",
  "Chanel",
  "Yves Saint Laurent",
  "Xerjoff",
  "Giorgio Armani",
];

const ALL_SIZES = [5, 10, 50, 100];

interface CatalogFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  totalMatches: number;
  onReset: () => void;
  isMobileModal?: boolean;
  onCloseMobile?: () => void;
}

export function CatalogFilters({
  filters,
  setFilters,
  totalMatches,
  onReset,
  isMobileModal = false,
  onCloseMobile,
}: CatalogFiltersProps) {
  const toggleFamily = (family: OlfactoryFamily) => {
    setFilters((prev) => ({
      ...prev,
      families: prev.families.includes(family)
        ? prev.families.filter((f) => f !== family)
        : [...prev.families, family],
    }));
  };

  const toggleGender = (gender: Gender) => {
    setFilters((prev) => ({
      ...prev,
      genders: prev.genders.includes(gender)
        ? prev.genders.filter((g) => g !== gender)
        : [...prev.genders, gender],
    }));
  };

  const toggleConcentration = (conc: Concentration) => {
    setFilters((prev) => ({
      ...prev,
      concentrations: prev.concentrations.includes(conc)
        ? prev.concentrations.filter((c) => c !== conc)
        : [...prev.concentrations, conc],
    }));
  };

  const toggleBrand = (brand: string) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const toggleSize = (size: number) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const hasActiveFilters =
    filters.families.length > 0 ||
    filters.genders.length > 0 ||
    filters.concentrations.length > 0 ||
    filters.brands.length > 0 ||
    filters.sizes.length > 0 ||
    filters.onlySale ||
    filters.priceRange[1] < 3000;

  return (
    <div className={`space-y-6 ${isMobileModal ? "p-6" : ""}`}>
      {/* Header with Results & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-white" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Filtros Avanzados
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[11px] text-zinc-300 font-mono">
            {totalMatches}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer</span>
          </button>
        )}
      </div>

      {/* Solo Ofertas Toggle */}
      <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-red-400" />
          <div>
            <p className="text-xs font-bold text-white">Solo Ofertas & Descuentos</p>
            <p className="text-[10px] text-zinc-400">Precios especiales vigentes</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setFilters((p) => ({ ...p, onlySale: !p.onlySale }))}
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
            filters.onlySale ? "bg-white" : "bg-zinc-800"
          }`}
        >
          <span
            className={`block w-4 h-4 rounded-full transition-transform duration-200 ${
              filters.onlySale
                ? "translate-x-6 bg-zinc-950"
                : "translate-x-1 bg-zinc-400"
            }`}
          />
        </button>
      </div>

      {/* Presentación / Mililitros */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
          Formato / Mililitros
        </label>
        <div className="grid grid-cols-2 gap-2">
          {ALL_SIZES.map((size) => {
            const isSelected = filters.sizes.includes(size);
            const label = size <= 10 ? `Decant ${size}ml` : `Frasco ${size}ml`;
            return (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all duration-150 active:scale-95 ${
                  isSelected
                    ? "bg-white text-zinc-950 border-white font-bold shadow-md"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                <span>{label}</span>
                {isSelected && <Check className="w-3 h-3 text-zinc-950" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Familias Olfativas */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
          Familia Olfativa
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ALL_FAMILIES.map((fam) => {
            const isSelected = filters.families.includes(fam);
            return (
              <button
                key={fam}
                type="button"
                onClick={() => toggleFamily(fam)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 active:scale-95 ${
                  isSelected
                    ? "bg-white text-zinc-950 border-white font-bold shadow-md"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                {fam}
              </button>
            );
          })}
        </div>
      </div>

      {/* Género */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
          Género
        </label>
        <div className="grid grid-cols-3 gap-2">
          {ALL_GENDERS.map((gender) => {
            const isSelected = filters.genders.includes(gender);
            return (
              <button
                key={gender}
                type="button"
                onClick={() => toggleGender(gender)}
                className={`py-2 rounded-xl text-xs font-semibold border text-center transition-all duration-150 active:scale-95 ${
                  isSelected
                    ? "bg-white text-zinc-950 border-white font-bold"
                    : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {gender}
              </button>
            );
          })}
        </div>
      </div>

      {/* Concentración */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
          Concentración
        </label>
        <div className="space-y-1.5">
          {ALL_CONCENTRATIONS.map((conc) => {
            const isSelected = filters.concentrations.includes(conc);
            return (
              <button
                key={conc}
                type="button"
                onClick={() => toggleConcentration(conc)}
                className={`w-full py-2 px-3 rounded-xl text-xs text-left border flex items-center justify-between transition-all duration-150 ${
                  isSelected
                    ? "bg-zinc-800 text-white border-zinc-600 font-semibold"
                    : "bg-zinc-900/50 border-zinc-800/80 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <span>{conc}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Marcas de Lujo y Nicho */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
          Marca
        </label>
        <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
          {ALL_BRANDS.map((brand) => {
            const isSelected = filters.brands.includes(brand);
            return (
              <button
                key={brand}
                type="button"
                onClick={() => toggleBrand(brand)}
                className={`w-full py-1.5 px-2.5 rounded-lg text-xs text-left flex items-center justify-between transition-colors ${
                  isSelected
                    ? "bg-zinc-800 text-white font-semibold"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                }`}
              >
                <span className="truncate">{brand}</span>
                {isSelected && <Check className="w-3 h-3 text-white shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rango de Precios */}
      <div className="space-y-2.5 pt-2 border-t border-zinc-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Precio Máximo
          </label>
          <span className="text-xs font-mono font-bold text-white">
            Bs. {filters.priceRange[1]}
          </span>
        </div>
        <input
          type="range"
          min="40"
          max="3000"
          step="50"
          value={filters.priceRange[1]}
          onChange={(e) =>
            setFilters((p) => ({
              ...p,
              priceRange: [p.priceRange[0], parseInt(e.target.value, 10)],
            }))
          }
          className="w-full accent-white bg-zinc-800 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>Bs. 40 (Decant)</span>
          <span>Bs. 3,000 (Nicho)</span>
        </div>
      </div>

      {isMobileModal && (
        <button
          type="button"
          onClick={onCloseMobile}
          className="w-full py-3.5 rounded-2xl bg-white text-zinc-950 font-bold text-sm shadow-xl active:scale-[0.98] transition-all"
        >
          Ver {totalMatches} Perfumes
        </button>
      )}
    </div>
  );
}
