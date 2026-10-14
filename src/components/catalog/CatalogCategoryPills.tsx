"use client";

import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { OlfactoryFamily } from "@/types";

interface CatalogCategoryPillsProps {
  selectedFamily: OlfactoryFamily | null;
  onSelectFamily: (family: OlfactoryFamily | null) => void;
}

const FAMILIES: { id: OlfactoryFamily | "all"; label: string; icon: string }[] = [
  { id: "all", label: "Todas las Familias", icon: "✨" },
  { id: "Gourmand", label: "Gourmand (Dulce)", icon: "🍫" },
  { id: "Oriental / Ámbar", label: "Oriental / Ámbar", icon: "🏺" },
  { id: "Amaderada", label: "Amaderada", icon: "🌲" },
  { id: "Cítrica", label: "Cítrica & Fresca", icon: "🍋" },
  { id: "Floral", label: "Floral", icon: "🌸" },
  { id: "Cuero", label: "Cuero & Ahumado", icon: "🧥" },
];

export function CatalogCategoryPills({
  selectedFamily,
  onSelectFamily,
}: CatalogCategoryPillsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const handleScroll = (dir: "left" | "right") => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center group mb-6">
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleScroll("left")}
          aria-label="Deslizar familias a la izquierda"
          className="absolute left-0 z-20 w-7 h-8 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-white shadow-lg flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-95"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
      )}

      <div
        className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
          canScrollLeft ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none scroll-smooth w-full select-none"
      >
        {FAMILIES.map((item) => {
          const isSelected =
            item.id === "all" ? selectedFamily === null : selectedFamily === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectFamily(item.id === "all" ? null : (item.id as OlfactoryFamily))}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98] ${
                isSelected
                  ? "bg-white text-zinc-950 font-bold shadow-md ring-2 ring-white/20"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
              }`}
            >
              <span>{item.icon}</span>
              <span className="whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div
        className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
          canScrollRight ? "opacity-100" : "opacity-0"
        }`}
      />

      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleScroll("right")}
          aria-label="Deslizar familias a la derecha"
          className="absolute right-0 z-20 w-7 h-8 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-white shadow-lg flex items-center justify-center transition-all cursor-pointer backdrop-blur-md active:scale-95"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
