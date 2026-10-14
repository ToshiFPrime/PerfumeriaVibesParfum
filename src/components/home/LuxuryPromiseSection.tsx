import React from "react";
import { Droplets, ShieldCheck, Truck, PhoneCall } from "lucide-react";
import { WHATSAPP_NUMBERS } from "@/lib/utils";

export function LuxuryPromiseSection() {
  return (
    <section className="py-16 bg-zinc-900/40 border-t border-zinc-800/80 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
            Nuestra Promesa
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            La Experiencia <span className="font-serif italic text-metallic">Vibes Parfum</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Cuidamos cada detalle desde la extracción milimétrica del perfume hasta la entrega segura en tu domicilio.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3 hover:border-zinc-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-white">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Decants Dosificados</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Atomizadores de 5ml (80 sprays) y 10ml (160 sprays) en vidrio y metal recargable de alta calidad.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3 hover:border-zinc-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">100% Original</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Sin réplicas ni formulaciones rebajadas. Cada gota conserva su concentración y notas aromáticas exactas.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3 hover:border-zinc-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-white">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Envíos Asegurados</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Despachos rápidos a La Paz, Santa Cruz, Cochabamba y los 9 departamentos con embalaje anti-rotura.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3 hover:border-zinc-700 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-white">
              <PhoneCall className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white">Asesoría Olfativa</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Escríbenos a nuestras líneas oficiales ({WHATSAPP_NUMBERS.primary.raw} / {WHATSAPP_NUMBERS.secondary.raw}) y te ayudamos a elegir.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
