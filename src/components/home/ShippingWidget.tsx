"use client";

import React, { useState } from "react";
import { Truck, Clock, Phone } from "lucide-react";
import { BOLIVIA_DEPARTMENTS } from "@/lib/data/shippingRates";
import {
  formatPrice,
  WHATSAPP_NUMBERS,
  generateShippingQuoteWhatsAppMessage,
  buildWhatsAppLink,
} from "@/lib/utils";

export function ShippingWidget() {
  const [selectedDept, setSelectedDept] = useState(BOLIVIA_DEPARTMENTS[0]);
  const [cityName, setCityName] = useState("");
  const [perfumeName, setPerfumeName] = useState("");

  const handleWhatsAppQuote = (targetPhone: string) => {
    const msg = generateShippingQuoteWhatsAppMessage(
      selectedDept.department,
      cityName || selectedDept.city,
      perfumeName || undefined,
      selectedDept.cost,
      selectedDept.estimatedDays
    );
    const link = buildWhatsAppLink(targetPhone, msg);
    window.open(link, "_blank");
  };

  return (
    <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold">
            <Truck className="w-3.5 h-3.5 text-zinc-200" />
            <span>Cotizador Oficial de Envíos</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Calcula el costo y tiempo de envío a tu ciudad
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto">
            Despachamos con embalaje acolchado de protección extrema a cualquiera de los 9 departamentos de Bolivia.
          </p>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400">
              Departamento de Destino:
            </label>
            <select
              value={selectedDept.department}
              onChange={(e) => {
                const found = BOLIVIA_DEPARTMENTS.find(
                  (d) => d.department === e.target.value
                );
                if (found) setSelectedDept(found);
              }}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700/80 text-white text-sm focus:outline-none focus:border-white transition-colors cursor-pointer"
            >
              {BOLIVIA_DEPARTMENTS.map((dept) => (
                <option key={dept.department} value={dept.department}>
                  {dept.department}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400">
              Ciudad / Zona o Municipio:
            </label>
            <input
              type="text"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder={selectedDept.city}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400">
              Perfume de interés (opcional):
            </label>
            <input
              type="text"
              value={perfumeName}
              onChange={(e) => setPerfumeName(e.target.value)}
              placeholder="Ej. Aventus / Decant 10ml"
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700/80 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>

        {/* Result Card */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                Tarifa Estimada ({selectedDept.department})
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold">
                {formatPrice(selectedDept.cost)}
              </span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Tiempo de entrega estimado: <strong>{selectedDept.estimatedDays}</strong></span>
            </div>
            {selectedDept.freeShippingAbove && (
              <p className="text-[11px] text-zinc-400">
                ✨ Envío <strong className="text-white">GRATIS</strong> en compras mayores a {formatPrice(selectedDept.freeShippingAbove)}.
              </p>
            )}
          </div>

          {/* Direct WhatsApp Actions with Both Numbers */}
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handleWhatsAppQuote(WHATSAPP_NUMBERS.primary.full)}
              className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Cotizar a {WHATSAPP_NUMBERS.primary.raw}</span>
            </button>

            <button
              type="button"
              onClick={() => handleWhatsAppQuote(WHATSAPP_NUMBERS.secondary.full)}
              className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] border border-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cotizar a {WHATSAPP_NUMBERS.secondary.raw}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
