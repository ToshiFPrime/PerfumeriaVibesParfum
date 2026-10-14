import React from "react";
import { Layers } from "lucide-react";
import type { OlfactoryPyramid } from "@/types";

interface ProductOlfactoryPyramidProps {
  pyramid: OlfactoryPyramid;
}

export function ProductOlfactoryPyramid({ pyramid }: ProductOlfactoryPyramidProps) {
  return (
    <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-zinc-300" />
          Pirámide Olfativa
        </span>
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
          Evolución en Piel
        </span>
      </div>

      {/* Notas de Salida */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-zinc-300 shrink-0" />
          <span>Notas de Salida (Primeros 15-30 min):</span>
        </div>
        <div className="flex flex-wrap gap-1.5 pl-4">
          {pyramid.top.map((note) => (
            <span
              key={note}
              className="px-2.5 py-1 rounded-md bg-zinc-800/90 text-zinc-200 text-xs font-medium border border-zinc-700/60"
            >
              {note}
            </span>
          ))}
        </div>
      </div>

      {/* Notas de Corazón */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-zinc-400 shrink-0" />
          <span>Notas de Corazón (2 a 6 horas):</span>
        </div>
        <div className="flex flex-wrap gap-1.5 pl-4">
          {pyramid.heart.map((note) => (
            <span
              key={note}
              className="px-2.5 py-1 rounded-md bg-zinc-800/90 text-zinc-200 text-xs font-medium border border-zinc-700/60"
            >
              {note}
            </span>
          ))}
        </div>
      </div>

      {/* Notas de Fondo */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-white shrink-0" />
          <span>Notas de Fondo (Fijación profunda +8 horas):</span>
        </div>
        <div className="flex flex-wrap gap-1.5 pl-4">
          {pyramid.base.map((note) => (
            <span
              key={note}
              className="px-2.5 py-1 rounded-md bg-zinc-800/90 text-zinc-200 text-xs font-medium border border-zinc-700/60"
            >
              {note}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
