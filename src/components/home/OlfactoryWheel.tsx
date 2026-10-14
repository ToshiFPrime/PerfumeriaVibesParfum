"use client";

import React from "react";
import Link from "next/link";
import { Compass, Sparkles, Wind, Droplets, Sun, Flame, Flower2, Layers } from "lucide-react";
import type { OlfactoryFamily } from "@/types";

interface FamilyItem {
  name: OlfactoryFamily;
  tagline: string;
  notes: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FAMILIES: FamilyItem[] = [
  {
    name: "Amaderada",
    tagline: "Elegancia terrosa y noble",
    notes: "Sándalo, Cedro del Atlas, Oud, Vetiver",
    icon: Layers,
  },
  {
    name: "Oriental / Ámbar",
    tagline: "Misterio cálido y sensual",
    notes: "Ámbar gris, Azafrán, Incienso, Especias",
    icon: Flame,
  },
  {
    name: "Gourmand",
    tagline: "Dulzura adictiva y licorosa",
    notes: "Vainilla Bourbon, Miel, Haba Tonka, Tabaco",
    icon: Sparkles,
  },
  {
    name: "Cítrica",
    tagline: "Vitalidad chispeante y fresca",
    notes: "Bergamota de Calabria, Limón, Pomelo",
    icon: Sun,
  },
  {
    name: "Acuática",
    tagline: "Frescura oceánica y limpia",
    notes: "Notas marinas, Ozono, Brisa salada",
    icon: Droplets,
  },
  {
    name: "Floral",
    tagline: "Sofisticación botánica refinada",
    notes: "Jazmín Sambac, Rosa de Mayo, Azahar",
    icon: Flower2,
  },
  {
    name: "Cuero",
    tagline: "Carácter audaz y magnético",
    notes: "Cuero negro, Abedul ahumado, Gamuza",
    icon: Wind,
  },
  {
    name: "Aromática",
    tagline: "Hierbas silvestres y distinción",
    notes: "Lavanda de Nyons, Romero, Salvia, Menta",
    icon: Compass,
  },
];

export function OlfactoryWheel() {
  return (
    <section className="py-16 bg-zinc-950/40 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
              Biblioteca Olfativa
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Explora por <span className="font-serif italic text-metallic">Familia Olfativa</span>
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              Cada fragancia posee un temperamento único. Elige la familia que mejor resuene con tu personalidad y estilo de vida.
            </p>
          </div>

          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-zinc-300 underline underline-offset-4"
          >
            <span>Ver todas las familias</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {FAMILIES.map((fam) => {
            const Icon = fam.icon;
            return (
              <Link
                key={fam.name}
                href={`/catalogo?familia=${encodeURIComponent(fam.name)}`}
                className="group p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-500 hover:bg-zinc-800/70 transition-all duration-200 active:scale-[0.98] flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-zinc-800 text-zinc-200 group-hover:text-white group-hover:bg-zinc-700 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider group-hover:text-zinc-300">
                    Ver perfumes →
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white group-hover:text-white transition-colors">
                    {fam.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-medium">
                    {fam.tagline}
                  </p>
                  <p className="text-[11px] text-zinc-500 truncate pt-1">
                    {fam.notes}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
