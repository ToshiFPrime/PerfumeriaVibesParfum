"use client";

import React from "react";
import { Sparkles, ShieldCheck, Droplets, Zap } from "lucide-react";
import { BaseModal } from "@/components/common/BaseModal";

export interface DecantGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DecantGuideModal({ isOpen, onClose }: DecantGuideModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Guía de Decants & Rendimiento"
      subtitle="Todo lo que necesitas saber antes de comprar tu presentación ideal"
      icon={<Sparkles className="w-5 h-5 text-amber-400" />}
      maxWidth="md"
    >
      <div className="space-y-4 pt-1 text-xs text-zinc-300">
        <p className="leading-relaxed">
          Un <strong>decant</strong> es una muestra dosificada de perfume extraída directamente de la botella oficial original mediante jeringa estéril hacia un atomizador portátil de alta gama.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-center">
            <span className="text-2xl font-extrabold text-white">5 ml</span>
            <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
              ~80 Atomizaciones
            </p>
            <p className="text-[10px] text-zinc-400 leading-tight">
              Atomizador de vidrio grueso. Perfecto para probar 2 a 3 semanas o llevar en el bolsillo/cartera.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-center">
            <span className="text-2xl font-extrabold text-white">10 ml</span>
            <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
              ~160 Atomizaciones
            </p>
            <p className="text-[10px] text-zinc-400 leading-tight">
              Atomizador con carcasa de metal recargable. Más de 1 mes de uso diario continuo.
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-zinc-800/80">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              <strong>100% Auténtico:</strong> Mismo lote, misma concentración y notas olfativas sin alteración química.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <Droplets className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              <strong>Sellado Hermético:</strong> Sellamos cada atomizador con cinta de teflón para evitar fugas y evaporación durante el transporte.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-zinc-300 leading-relaxed">
              <strong>Economía Inteligente:</strong> Prueba 5 perfumes nicho distintos por el precio de una sola botella a ciegas.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs shadow-lg transition-all cursor-pointer active:scale-95"
        >
          Entendido, Elegir Mi Fragancia
        </button>
      </div>
    </BaseModal>
  );
}
