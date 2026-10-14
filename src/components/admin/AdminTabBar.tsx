"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Search,
  X,
  Command,
} from "lucide-react";
import type { AdminTabId } from "@/types/admin";

export type AdminModuleCategory = "all" | "inventory" | "operations" | "crm" | "system";

export interface TabItem {
  id: AdminTabId;
  label: string;
  shortLabel: string;
  icon: string;
  category: "inventory" | "operations" | "crm" | "system";
  categoryLabel: string;
  description: string;
  badge?: string | number;
  badgeColor?: "amber" | "emerald" | "default";
}

interface AdminTabBarProps {
  activeTab: AdminTabId;
  onSelectTab: (tab: AdminTabId) => void;
  perfumesCount: number;
  brandsCount: number;
  ordersCount: number;
  reviewsCount: number;
  pendingReviewsCount: number;
  usersCount: number;
  vipUsersCount: number;
  couponsCount: number;
  logsCount?: number;
}

export function AdminTabBar({
  activeTab,
  onSelectTab,
  perfumesCount,
  brandsCount,
  ordersCount,
  reviewsCount,
  pendingReviewsCount,
  usersCount,
  vipUsersCount,
  couponsCount,
  logsCount,
}: AdminTabBarProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<AdminModuleCategory>("all");
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [moduleSearchQuery, setModuleSearchQuery] = useState("");
  const [showFloatingPill, setShowFloatingPill] = useState(false);

  // Definición completa y categorizada de módulos
  const tabs: TabItem[] = useMemo(
    () => [
      {
        id: "perfumes",
        label: "Catálogo & Stock",
        shortLabel: "Stock",
        icon: "📦",
        category: "inventory",
        categoryLabel: "Inventario",
        description: "Existencias en tiempo real, decants y alertas de stock",
        badge: perfumesCount,
        badgeColor: "default",
      },
      {
        id: "brands",
        label: "Casas & Categorías",
        shortLabel: "Casas",
        icon: "🏛️",
        category: "inventory",
        categoryLabel: "Inventario",
        description: "Marcas árabes, francesas, de diseñador y nicho",
        badge: brandsCount,
        badgeColor: "default",
      },
      {
        id: "calculator",
        label: "Calculadora Decants",
        shortLabel: "Decants",
        icon: "🧮",
        category: "inventory",
        categoryLabel: "Inventario",
        description: "Márgenes de ganancia, costos de frascos y viales de 5/10ml",
        badge: "PRO",
        badgeColor: "amber",
      },
      {
        id: "orders",
        label: "Pedidos & Despachos",
        shortLabel: "Pedidos",
        icon: "🚚",
        category: "operations",
        categoryLabel: "Operaciones",
        description: "Control de órdenes de Bolivia, guías de flota y PDF",
        badge: ordersCount,
        badgeColor: "default",
      },
      {
        id: "finances",
        label: "Ventas & Finanzas",
        shortLabel: "Ventas",
        icon: "📊",
        category: "operations",
        categoryLabel: "Operaciones",
        description: "Ingresos por departamentos, ticket promedio y ganancias",
      },
      {
        id: "coupons",
        label: "Cupones & Promos",
        shortLabel: "Cupones",
        icon: "🏷️",
        category: "operations",
        categoryLabel: "Operaciones",
        description: "Códigos de descuento temporal y promociones especiales",
        badge: couponsCount,
        badgeColor: "default",
      },
      {
        id: "users",
        label: "Clientes & CRM",
        shortLabel: "Clientes",
        icon: "👥",
        category: "crm",
        categoryLabel: "Comunidad",
        description: "Directorio de compradores, historial VIP y WhatsApp",
        badge: vipUsersCount > 0 ? `${vipUsersCount} VIP` : usersCount,
        badgeColor: vipUsersCount > 0 ? "emerald" : "default",
      },
      {
        id: "reviews",
        label: "Moderación Reseñas",
        shortLabel: "Reseñas",
        icon: "⭐",
        category: "crm",
        categoryLabel: "Comunidad",
        description: "Opiniones de compradores y testimonios destacados",
        badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} pend` : reviewsCount,
        badgeColor: pendingReviewsCount > 0 ? "amber" : "default",
      },
      {
        id: "settings",
        label: "Tienda & Cobros QR",
        shortLabel: "Ajustes",
        icon: "⚙️",
        category: "system",
        categoryLabel: "Configuración",
        description: "Líneas WhatsApp, datos de cuenta bancaria y banner",
      },
      {
        id: "logs",
        label: "Historial & Auditoría",
        shortLabel: "Auditoría",
        icon: "📋",
        category: "system",
        categoryLabel: "Configuración",
        description: "Registro de movimientos de stock con motivos y admin",
        badge: logsCount,
        badgeColor: "default",
      },
    ],
    [
      perfumesCount,
      brandsCount,
      ordersCount,
      reviewsCount,
      pendingReviewsCount,
      usersCount,
      vipUsersCount,
      couponsCount,
      logsCount,
    ]
  );

  // Filtrado de pestañas por categoría activa en la barra superior
  const visibleTabs = useMemo(() => {
    if (selectedCategory === "all") return tabs;
    return tabs.filter((t) => t.category === selectedCategory);
  }, [tabs, selectedCategory]);

  // Búsqueda en el modal de módulos
  const modalFilteredTabs = useMemo(() => {
    const q = moduleSearchQuery.toLowerCase().trim();
    if (!q) return tabs;
    return tabs.filter(
      (t) =>
        t.label.toLowerCase().includes(q) ||
        t.shortLabel.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.categoryLabel.toLowerCase().includes(q)
    );
  }, [tabs, moduleSearchQuery]);

  // Manejador de Scroll
  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll, visibleTabs]);

  // Control de scroll de página para mostrar píldora flotante
  useEffect(() => {
    const handleWindowScroll = () => {
      setShowFloatingPill(window.scrollY > 320);
    };
    window.addEventListener("scroll", handleWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  // Atajo de teclado global Ctrl+K / Cmd+K para abrir buscador de módulos
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setModuleModalOpen((prev) => !prev);
      } else if (e.key === "Escape" && moduleModalOpen) {
        setModuleModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [moduleModalOpen]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const offset = direction === "left" ? -240 : 240;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  const handleSelectModule = (tabId: AdminTabId) => {
    onSelectTab(tabId);
    setModuleModalOpen(false);
    setModuleSearchQuery("");

    // Si la categoría del tab seleccionado no es visible, poner "all"
    const targetTab = tabs.find((t) => t.id === tabId);
    if (targetTab && selectedCategory !== "all" && targetTab.category !== selectedCategory) {
      setSelectedCategory("all");
    }
  };

  const currentTabObj = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <>
      {/* =========================================================================
          BARRA DE NAVEGACIÓN SUPERIOR (DESKTOP, TABLET Y MÓVIL)
          ========================================================================= */}
      <div className="space-y-2.5 border-b border-zinc-800/80 pb-3">
        {/* Fila Superior: Selector de Categorías + Buscador Rápido de Módulo */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Píldoras de Categoría */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-white text-zinc-950 font-bold shadow-md"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              Todos ({tabs.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("inventory")}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "inventory"
                  ? "bg-white text-zinc-950 font-bold shadow-md"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              <span>📦</span>
              <span>Inventario</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("operations")}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "operations"
                  ? "bg-white text-zinc-950 font-bold shadow-md"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              <span>🚚</span>
              <span>Operaciones</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("crm")}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "crm"
                  ? "bg-white text-zinc-950 font-bold shadow-md"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              <span>👥</span>
              <span>Clientes</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("system")}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === "system"
                  ? "bg-white text-zinc-950 font-bold shadow-md"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              <span>⚙️</span>
              <span>Ajustes</span>
            </button>
          </div>

          {/* Botón de Lanzador de Módulos / Command Palette */}
          <button
            type="button"
            onClick={() => setModuleModalOpen(true)}
            className="flex items-center justify-between sm:justify-start gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold shadow-sm transition-all cursor-pointer group shrink-0 active:scale-95"
            title="Abrir menú completo de módulos (Atajo: Ctrl + K)"
          >
            <div className="flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
              <span>Ver los 10 Módulos</span>
            </div>
            <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-700/80 text-[10px] text-zinc-400 font-mono">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>
        </div>

        {/* Barra Deslizable de Pestañas con Controles Laterales */}
        <div className="relative flex items-center group">
          {/* Botón Deslizar Izquierda */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => handleScroll("left")}
              aria-label="Deslizar pestañas a la izquierda"
              className="absolute left-0 z-20 w-8 h-9 rounded-xl bg-zinc-900/95 hover:bg-zinc-800 border border-zinc-700 text-white shadow-xl flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Gradiente izquierdo */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
              canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Contenedor de pestañas horizontal */}
          <div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex items-center gap-2 overflow-x-auto py-1 px-1 text-xs font-bold scrollbar-none scroll-smooth w-full select-none"
          >
            {visibleTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={isActive ? activeTabRef : null}
                  type="button"
                  onClick={() => handleSelectModule(tab.id)}
                  className={`px-3.5 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-2 active:scale-[0.98] ${
                    isActive
                      ? "bg-white text-zinc-950 shadow-lg font-extrabold ring-2 ring-white/30"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono tracking-tight ${
                        isActive
                          ? "bg-zinc-200 text-zinc-950 font-bold"
                          : tab.badgeColor === "amber"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                          : tab.badgeColor === "emerald"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Gradiente derecho */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
              canScrollRight ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Botón Deslizar Derecha */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => handleScroll("right")}
              aria-label="Deslizar pestañas a la derecha"
              className="absolute right-0 z-20 w-8 h-9 rounded-xl bg-zinc-900/95 hover:bg-zinc-800 border border-zinc-700 text-white shadow-xl flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          BARRA DE NAVEGACIÓN INFERIOR PARA MÓVILES (STICKY BOTTOM BAR - < md)
          ========================================================================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-xl px-2 py-2 flex items-center justify-around shadow-2xl safe-area-pb">
        <button
          type="button"
          onClick={() => handleSelectModule("perfumes")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "perfumes" ? "text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <span className="text-lg">📦</span>
          <span className="text-[10px] tracking-tight">Stock</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectModule("orders")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer relative ${
            activeTab === "orders" ? "text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <span className="text-lg">🚚</span>
          <span className="text-[10px] tracking-tight">Pedidos</span>
          {ordersCount > 0 && (
            <span className="absolute top-0.5 right-1 w-4 h-4 rounded-full bg-amber-500 text-zinc-950 font-bold text-[9px] flex items-center justify-center font-mono">
              {ordersCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => handleSelectModule("calculator")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "calculator" ? "text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <span className="text-lg">🧮</span>
          <span className="text-[10px] tracking-tight">Decants</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectModule("finances")}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "finances" ? "text-white font-bold" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <span className="text-lg">📊</span>
          <span className="text-[10px] tracking-tight">Ventas</span>
        </button>

        <button
          type="button"
          onClick={() => setModuleModalOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer active:scale-95"
        >
          <div className="w-6 h-6 rounded-lg bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
            <LayoutGrid className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] font-bold">Módulos</span>
        </button>
      </div>

      {/* =========================================================================
          PÍLDORA FLOTANTE EN DESKTOP / TABLET AL HACER SCROLL DOWN
          ========================================================================= */}
      {showFloatingPill && (
        <div className="hidden sm:flex fixed bottom-6 right-6 z-40 items-center gap-2 p-1.5 pl-3 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-2 text-xs">
            <span>{currentTabObj.icon}</span>
            <span className="font-bold">{currentTabObj.shortLabel}</span>
          </div>

          <button
            type="button"
            onClick={() => setModuleModalOpen(true)}
            className="px-2.5 py-1 rounded-xl bg-white text-zinc-950 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer hover:bg-zinc-200 active:scale-95"
          >
            <LayoutGrid className="w-3 h-3" />
            <span>Módulos</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          MODAL / BOTTOM SHEET DE TODOS LOS MÓDULOS (CENTRO DE CONTROL)
          ========================================================================= */}
      {moduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[90vh] bg-zinc-900 border border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
            {/* Header del Modal */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <LayoutGrid className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    Centro de Módulos Vibes Parfum
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Navega con 1 clic a cualquier área operativa de la boutique
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModuleModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Buscador de Módulos */}
            <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/40">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={moduleSearchQuery}
                  onChange={(e) => setModuleSearchQuery(e.target.value)}
                  placeholder="Escribe para buscar un módulo (ej. pedidos, stock, decants, cupones, qr)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
                  autoFocus
                />
              </div>
            </div>

            {/* Contenido scrolleable categorizado */}
            <div className="p-4 overflow-y-auto space-y-4">
              {modalFilteredTabs.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  No se encontró ningún módulo que coincida con &quot;{moduleSearchQuery}&quot;.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {modalFilteredTabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleSelectModule(tab.id)}
                        className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer active:scale-[0.98] ${
                          isActive
                            ? "bg-white text-zinc-950 border-white shadow-xl ring-2 ring-white/30"
                            : "bg-zinc-950/70 border-zinc-800/80 hover:bg-zinc-800/80 hover:border-zinc-700 text-white"
                        }`}
                      >
                        <span className="text-2xl shrink-0 p-1 rounded-xl bg-zinc-900/60">
                          {tab.icon}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <span
                              className={`text-xs font-bold truncate ${
                                isActive ? "text-zinc-950" : "text-white"
                              }`}
                            >
                              {tab.label}
                            </span>

                            {tab.badge !== undefined && (
                              <span
                                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                                  isActive
                                    ? "bg-zinc-900 text-white font-bold"
                                    : tab.badgeColor === "amber"
                                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                    : tab.badgeColor === "emerald"
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                    : "bg-zinc-800 text-zinc-400"
                                }`}
                              >
                                {tab.badge}
                              </span>
                            )}
                          </div>

                          <p
                            className={`text-[11px] line-clamp-2 mt-0.5 ${
                              isActive ? "text-zinc-700" : "text-zinc-400"
                            }`}
                          >
                            {tab.description}
                          </p>

                          <span
                            className={`text-[9px] uppercase font-bold tracking-wider inline-block mt-1 ${
                              isActive ? "text-zinc-500" : "text-zinc-500"
                            }`}
                          >
                            {tab.categoryLabel}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer con ayuda */}
            <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Atajo de teclado: pulsa <kbd className="text-zinc-300">Esc</kbd> para cerrar</span>
              <span className="font-mono">10 Módulos de Administración</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
