"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import type { AdminTabId } from "@/types/admin";

interface TabItem {
  id: AdminTabId;
  label: string;
  icon: string;
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [mobileSelectOpen, setMobileSelectOpen] = useState(false);

  const tabs: TabItem[] = [
    {
      id: "perfumes",
      label: "Catálogo & Stock",
      icon: "📦",
      badge: perfumesCount,
      badgeColor: "default",
    },
    {
      id: "brands",
      label: "Casas & Categorías",
      icon: "🏛️",
      badge: brandsCount,
      badgeColor: "default",
    },
    {
      id: "orders",
      label: "Pedidos & Despachos",
      icon: "🚚",
      badge: ordersCount,
      badgeColor: "default",
    },
    {
      id: "reviews",
      label: "Moderación Reseñas",
      icon: "⭐",
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} pend` : reviewsCount,
      badgeColor: pendingReviewsCount > 0 ? "amber" : "default",
    },
    {
      id: "users",
      label: "Clientes & Perfiles",
      icon: "👥",
      badge: vipUsersCount > 0 ? `${vipUsersCount} VIP` : usersCount,
      badgeColor: vipUsersCount > 0 ? "emerald" : "default",
    },
    {
      id: "logs",
      label: "Historial & Auditoría",
      icon: "📋",
      badge: logsCount,
      badgeColor: "default",
    },
    {
      id: "finances",
      label: "Ventas & Finanzas",
      icon: "📊",
    },
    {
      id: "coupons",
      label: "Cupones & Promos",
      icon: "🏷️",
      badge: couponsCount,
      badgeColor: "default",
    },
    {
      id: "calculator",
      label: "Calculadora de Decants",
      icon: "🧮",
      badge: "PRO",
      badgeColor: "amber",
    },
    {
      id: "settings",
      label: "Tienda & Cobros QR",
      icon: "⚙️",
    },
  ];

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
  }, [checkScroll]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const offset = direction === "left" ? -240 : 240;
    el.scrollBy({ left: offset, behavior: "smooth" });
  };

  const handleTabClick = (tabId: AdminTabId, buttonEl?: HTMLButtonElement | null) => {
    onSelectTab(tabId);
    setMobileSelectOpen(false);
    if (buttonEl) {
      buttonEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  // Center active tab when mounted or changed
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeTab]);

  const currentTabObj = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div className="space-y-2 border-b border-zinc-800/80 pb-3">
      {/* Selector Rápido para Móvil (< md) */}
      <div className="md:hidden flex items-center justify-between p-2 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center gap-2 pl-2 text-xs">
          <span className="text-zinc-400">Pestaña activa:</span>
          <span className="font-bold text-white flex items-center gap-1.5">
            <span>{currentTabObj.icon}</span>
            <span>{currentTabObj.label}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileSelectOpen(!mobileSelectOpen)}
          className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center gap-1 transition-all"
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>Cambiar</span>
        </button>
      </div>

      {/* Menú Desplegable Móvil */}
      {mobileSelectOpen && (
        <div className="md:hidden grid grid-cols-2 gap-2 p-3 rounded-2xl bg-zinc-900/95 border border-zinc-800 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all flex items-center justify-between ${
                  isActive
                    ? "bg-white text-zinc-950 shadow-md"
                    : "bg-zinc-950/60 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span>{tab.icon}</span>
                  <span className="truncate">{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                      isActive
                        ? "bg-zinc-200 text-zinc-950"
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
              </button>
            );
          })}
        </div>
      )}

      {/* Barra Deslizable con Controles Laterales (Desktop y Touch) */}
      <div className="relative flex items-center group">
        {/* Botón Deslizar Izquierda */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Deslizar pestañas a la izquierda"
            className="absolute left-0 z-20 w-8 h-9 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-white shadow-xl flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Gradiente izquierdo para indicar que hay más pestañas */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
            canScrollLeft ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Contenedor de pestañas con scroll horizontal táctil */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex items-center gap-2 overflow-x-auto py-1 px-1 text-xs font-bold scrollbar-none scroll-smooth w-full select-none"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={isActive ? activeTabRef : null}
                type="button"
                onClick={(e) => handleTabClick(tab.id, e.currentTarget)}
                className={`px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-2 active:scale-[0.98] ${
                  isActive
                    ? "bg-white text-zinc-950 shadow-lg font-extrabold ring-2 ring-white/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800"
                }`}
              >
                <span>{tab.icon}</span>
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

        {/* Gradiente derecho para indicar que hay más pestañas */}
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
            className="absolute right-0 z-20 w-8 h-9 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-white shadow-xl flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
