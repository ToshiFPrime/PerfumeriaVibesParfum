"use client";

import React, { useState } from "react";
import {
  Truck,
  ShieldCheck,
  Clock,
  Phone,
  PackageCheck,
  MapPin,
} from "lucide-react";
import { BOLIVIA_DEPARTMENTS } from "@/lib/data/shippingRates";
import {
  formatPrice,
  WHATSAPP_NUMBERS,
  generateShippingQuoteWhatsAppMessage,
  buildWhatsAppLink,
} from "@/lib/utils";

export default function EnviosPage() {
  const [selectedDepartment, setSelectedDepartment] = useState(BOLIVIA_DEPARTMENTS[0]);
  const [customCity, setCustomCity] = useState("");
  const [fragranceQuery, setFragranceQuery] = useState("");

  const handleWhatsAppConsult = (targetPhone: string) => {
    const msg = generateShippingQuoteWhatsAppMessage(
      selectedDepartment.department,
      customCity || selectedDepartment.city,
      fragranceQuery || undefined
    );
    const url = buildWhatsAppLink(targetPhone, msg);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      {/* Top Hero */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold">
            <Truck className="w-3.5 h-3.5 text-zinc-300" />
            <span>Cobertura Nacional en los 9 Departamentos de Bolivia</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Cotizador y Tarifas de <span className="font-serif italic text-metallic">Envíos</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Despachamos todas nuestras fragancias y decants con triple embalaje térmico y amortiguación de impacto para garantizar que lleguen intactos a tus manos.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Interactive Quoter Card */}
        <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">Cotizar Envío Personalizado</h2>
              <p className="text-xs text-zinc-400">
                Selecciona tu ubicación para conocer la tarifa y el tiempo estimado de llegada:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">
                  1. Departamento:
                </label>
                <select
                  value={selectedDepartment.department}
                  onChange={(e) => {
                    const found = BOLIVIA_DEPARTMENTS.find(
                      (d) => d.department === e.target.value
                    );
                    if (found) setSelectedDepartment(found);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white text-sm focus:outline-none focus:border-white transition-colors cursor-pointer"
                >
                  {BOLIVIA_DEPARTMENTS.map((dept) => (
                    <option key={dept.department} value={dept.department}>
                      {dept.department}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">
                  2. Ciudad o Localidad:
                </label>
                <input
                  type="text"
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder={selectedDepartment.city}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300">
                  3. Fragancia a cotizar:
                </label>
                <input
                  type="text"
                  value={fragranceQuery}
                  onChange={(e) => setFragranceQuery(e.target.value)}
                  placeholder="Ej. Baccarat 540 / Aventus"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            {/* Calculated Quote Result */}
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">
                    Tarifa Oficial a {selectedDepartment.department}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-extrabold">
                    {formatPrice(selectedDepartment.cost)}
                  </span>
                </div>

                <p className="text-sm text-zinc-300 flex items-center justify-center md:justify-start gap-2">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  <span>Tiempo estimado de entrega: <strong className="text-white">{selectedDepartment.estimatedDays}</strong></span>
                </p>

                {selectedDepartment.freeShippingAbove && (
                  <p className="text-xs text-zinc-400">
                    ✨ Compra mínima para <strong className="text-white">Envío Gratis</strong>: {formatPrice(selectedDepartment.freeShippingAbove)}
                  </p>
                )}
              </div>

              {/* Dual WhatsApp Consultation CTAs */}
              <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => handleWhatsAppConsult(WHATSAPP_NUMBERS.primary.full)}
                  className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span>Cotizar con {WHATSAPP_NUMBERS.primary.raw}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWhatsAppConsult(WHATSAPP_NUMBERS.secondary.full)}
                  className="px-5 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] border border-zinc-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Cotizar con {WHATSAPP_NUMBERS.secondary.raw}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* National Rates Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Tabla Completa de Tarifas por Departamento
            </h3>
            <span className="text-xs text-zinc-400 font-mono">9 Departamentos</span>
          </div>

          <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-900/40">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Departamento</th>
                    <th className="py-3.5 px-4">Ciudad / Referencia</th>
                    <th className="py-3.5 px-4">Tarifa de Envío</th>
                    <th className="py-3.5 px-4">Tiempo Estimado</th>
                    <th className="py-3.5 px-4">Envío Gratis Desde</th>
                    <th className="py-3.5 px-4 text-right">Contacto Directo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {BOLIVIA_DEPARTMENTS.map((dept) => (
                    <tr key={dept.department} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        {dept.department}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-400">{dept.city}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        {formatPrice(dept.cost)}
                      </td>
                      <td className="py-3.5 px-4 text-zinc-300">{dept.estimatedDays}</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-medium">
                        {dept.freeShippingAbove ? formatPrice(dept.freeShippingAbove) : "N/A"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={`https://wa.me/${WHATSAPP_NUMBERS.primary.full}?text=${encodeURIComponent(
                            `Hola Vibes Parfum, quisiera confirmar un envío hacia ${dept.department} (${dept.city}).`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/60 text-[11px] font-semibold transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Consultar</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Security and Packing Guarantee */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
            <div className="p-3 rounded-xl bg-zinc-800 text-white w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Sellado con Teflón de Perfumería</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Cada decant es encintado con teflón especial de laboratorio para evitar cualquier micro-evaporación o derrame durante el transporte.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
            <div className="p-3 rounded-xl bg-zinc-800 text-white w-fit">
              <PackageCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Triple Capa Anti-Impacto</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Utilizamos cajas rígidas y burbujas de alta densidad para soportar trayectos terrestres o aéreos entre departamentos.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
            <div className="p-3 rounded-xl bg-zinc-800 text-white w-fit">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Seguimiento por WhatsApp</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Te enviamos foto de tu paquete y la guía de despacho de la empresa de transporte inmediatamente al despachar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
