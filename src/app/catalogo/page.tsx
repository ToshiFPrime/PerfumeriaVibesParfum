"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  X,
  Sparkles,
  PhoneCall,
  Loader2,
} from "lucide-react";
import { WHATSAPP_NUMBERS, buildWhatsAppLink } from "@/lib/utils";
import { MOCK_PERFUMES } from "@/lib/data/mockPerfumes";
import { ProductCard } from "@/components/product/ProductCard";
import { CatalogFilters } from "@/components/catalog/CatalogFilters";
import { CatalogCategoryPills } from "@/components/catalog/CatalogCategoryPills";
import { MobileFiltersDrawer } from "@/components/modals";
import { useDebounce } from "@/hooks/useDebounce";
import type { FilterState, OlfactoryFamily, Gender, Product } from "@/types";

function CatalogContent() {
  const searchParams = useSearchParams();

  const [allProducts, setAllProducts] = useState<Product[]>(MOCK_PERFUMES);

  useEffect(() => {
    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        const res = await fetch("/api/products?limit=100");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.products) {
            setAllProducts(data.products);
          }
        }
      } catch (err) {
        console.warn("Fallo al cargar catálogo dinámico:", err);
      }
    };
    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, []);

  const initialFamily = searchParams.get("familia") as OlfactoryFamily | null;
  const initialGender = searchParams.get("genero") as Gender | null;
  const initialSale = searchParams.get("ofertas") === "true";
  const initialQuery = searchParams.get("q") || "";

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialQuery,
    families: initialFamily ? [initialFamily] : [],
    genders: initialGender ? [initialGender] : [],
    concentrations: [],
    brands: [],
    sizes: [],
    priceRange: [0, 3000],
    onlySale: initialSale,
    inStockOnly: false,
    sortBy: "popular",
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Debounced search query to eliminate unnecessary re-renders on fast keystrokes
  const debouncedSearchQuery = useDebounce(filters.searchQuery, 250);
  const isSearching = filters.searchQuery !== debouncedSearchQuery;

  // Filtrado y ordenación
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Ignorar fragancias pausadas o retiradas del catálogo
      if (product.isActive === false) return false;

      // Búsqueda por texto debounced (nombre, marca, familia o notas)
      if (debouncedSearchQuery.trim()) {
        const q = debouncedSearchQuery.toLowerCase().trim();
        const matchName = product.name.toLowerCase().includes(q);
        const matchBrand = product.brand.toLowerCase().includes(q);
        const matchFamily = product.olfactoryFamily.toLowerCase().includes(q);
        const matchNotes = [
          ...product.pyramid.top,
          ...product.pyramid.heart,
          ...product.pyramid.base,
        ].some((note) => note.toLowerCase().includes(q));

        if (!matchName && !matchBrand && !matchFamily && !matchNotes) {
          return false;
        }
      }

      // Familia
      if (
        filters.families.length > 0 &&
        !filters.families.includes(product.olfactoryFamily)
      ) {
        return false;
      }

      // Género
      if (
        filters.genders.length > 0 &&
        !filters.genders.includes(product.gender)
      ) {
        return false;
      }

      // Concentración
      if (
        filters.concentrations.length > 0 &&
        !filters.concentrations.includes(product.concentration)
      ) {
        return false;
      }

      // Marca
      if (
        filters.brands.length > 0 &&
        !filters.brands.includes(product.brand)
      ) {
        return false;
      }

      // Formato / Mililitros
      if (filters.sizes.length > 0) {
        const hasSize = product.variants.some((v) =>
          filters.sizes.includes(v.milliliters)
        );
        if (!hasSize) return false;
      }

      // Solo ofertas
      if (filters.onlySale && !product.isOnSale) {
        return false;
      }

      // Precio (compara si al menos una variante está dentro del rango)
      const minVariantPrice = Math.min(...product.variants.map((v) => v.price));
      if (minVariantPrice > filters.priceRange[1]) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price-asc") {
        const minA = Math.min(...a.variants.map((v) => v.price));
        const minB = Math.min(...b.variants.map((v) => v.price));
        return minA - minB;
      }
      if (filters.sortBy === "price-desc") {
        const maxA = Math.max(...a.variants.map((v) => v.price));
        const maxB = Math.max(...b.variants.map((v) => v.price));
        return maxB - maxA;
      }
      if (filters.sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (filters.sortBy === "newest") {
        return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      }
      return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [filters, debouncedSearchQuery, allProducts]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      families: [],
      genders: [],
      concentrations: [],
      brands: [],
      sizes: [],
      priceRange: [0, 3000],
      onlySale: false,
      inStockOnly: false,
      sortBy: "popular",
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* Top Banner */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/30 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
            <span>Catálogo Exclusivo</span>
            <span>•</span>
            <span className="text-emerald-400">Decants y Frascos 100% Originales</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Colección de <span className="font-serif italic text-metallic">Fragancias</span>
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                Explora por notas, familias olfativas, tamaños o marcas prestigiosas con entrega a toda Bolivia.
              </p>
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, searchQuery: e.target.value }))
                }
                placeholder="Buscar perfume, marca o notas..."
                className="w-full min-h-[44px] pl-10 pr-12 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-700/80 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-white transition-colors"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {isSearching && (
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                )}
                {filters.searchQuery && !isSearching && (
                  <button
                    type="button"
                    onClick={() => setFilters((p) => ({ ...p, searchQuery: "" }))}
                    className="p-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                    title="Borrar búsqueda"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid & Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Toggle & Sort Bar */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-800 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs font-bold active:scale-95"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filtros ({filteredProducts.length})</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Ordenar:</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((p) => ({ ...p, sortBy: e.target.value as FilterState["sortBy"] }))
              }
              className="px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="popular">Más Populares</option>
              <option value="price-asc">Menor Precio</option>
              <option value="price-desc">Mayor Precio</option>
              <option value="rating">Mejor Calificación</option>
              <option value="newest">Nuevos Ingresos</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 backdrop-blur-md">
            <CatalogFilters
              filters={filters}
              setFilters={setFilters}
              totalMatches={filteredProducts.length}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Catalog Products Area (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            {/* Desktop Sort & Active Tags */}
            <div className="hidden lg:flex items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span>Mostrando</span>
                <strong className="text-white font-mono">{filteredProducts.length}</strong>
                <span>fragancias</span>
                {isSearching && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 ml-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Buscando...</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 font-medium">Ordenar por:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, sortBy: e.target.value as FilterState["sortBy"] }))
                  }
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                >
                  <option value="popular">Más Populares</option>
                  <option value="price-asc">Menor Precio</option>
                  <option value="price-desc">Mayor Precio</option>
                  <option value="rating">Mejor Calificación</option>
                  <option value="newest">Nuevos Ingresos</option>
                </select>
              </div>
            </div>

            {/* Selector Deslizable de Familias Olfativas */}
            <CatalogCategoryPills
              selectedFamily={filters.families[0] || null}
              onSelectFamily={(fam) =>
                setFilters((p) => ({ ...p, families: fam ? [fam] : [] }))
              }
            />

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-zinc-900/40 border border-zinc-800/80 p-8 sm:p-12 space-y-6 backdrop-blur-md">
                <div className="w-16 h-16 rounded-2xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center mx-auto text-amber-400 shadow-xl shadow-amber-950/20">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Concierge Olfativo Personalizado
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    No encontramos fragancias con esos filtros específicos en stock inmediato. Si buscas una edición especial, nicho o descontinuada, nuestro sommelier puede importarla para ti.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-all cursor-pointer active:scale-95"
                  >
                    Restablecer todos los filtros
                  </button>
                  <a
                    href={buildWhatsAppLink(
                      WHATSAPP_NUMBERS.primary.full,
                      "¡Hola Vibes Parfum! Estaba buscando una fragancia en su catálogo pero no la encontré. ¿Podrían asesorarme si pueden conseguirla o tienen un aroma similar?"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Consultar por WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-200 ${
                  isSearching ? "opacity-60 pointer-events-none" : "opacity-100"
                }`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over Modal */}
      <MobileFiltersDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        filters={filters}
        setFilters={setFilters}
        totalMatches={filteredProducts.length}
        onReset={handleResetFilters}
      />
    </div>
  );
}

export default function CatalogoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400 text-xs">Cargando catálogo...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
