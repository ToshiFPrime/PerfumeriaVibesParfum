"use client";

import React from "react";
import { QrCode, CheckCircle, Save } from "lucide-react";

interface StoreSettingsTabProps {
  bankName: string;
  setBankName: (val: string) => void;
  accountHolder: string;
  setAccountHolder: (val: string) => void;
  accountNumber: string;
  setAccountNumber: (val: string) => void;
  freeShippingThreshold: string;
  setFreeShippingThreshold: (val: string) => void;
  whatsappLine1: string;
  setWhatsappLine1: (val: string) => void;
  whatsappLine2: string;
  setWhatsappLine2: (val: string) => void;
  savedSettingsSuccess: boolean;
  onSaveSettings: (e: React.FormEvent) => void;
}

export function StoreSettingsTab({
  bankName,
  setBankName,
  accountHolder,
  setAccountHolder,
  accountNumber,
  setAccountNumber,
  freeShippingThreshold,
  setFreeShippingThreshold,
  whatsappLine1,
  setWhatsappLine1,
  whatsappLine2,
  setWhatsappLine2,
  savedSettingsSuccess,
  onSaveSettings,
}: StoreSettingsTabProps) {
  return (
    <form onSubmit={onSaveSettings} className="space-y-6 max-w-3xl animate-in fade-in duration-200">
      <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <QrCode className="w-5 h-5 text-emerald-400" />
            Datos de Cobro con QR Simple Oficial (Bolivia)
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Estos datos se envían automáticamente al cliente por WhatsApp al confirmar su pedido.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Entidad Bancaria:</label>
            <input
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Titular de la Cuenta:</label>
            <input
              type="text"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Número de Cuenta / Bimonetaria:</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Umbral para Envío Gratis (Bs.):</label>
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-white font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-800/80">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
            Líneas de WhatsApp Vinculadas
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-400">Línea 1 (Pedidos Principales):</label>
              <input
                type="text"
                value={whatsappLine1}
                onChange={(e) => setWhatsappLine1(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-emerald-400 font-mono focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-zinc-400">Línea 2 (Cotizaciones & Envíos):</label>
              <input
                type="text"
                value={whatsappLine2}
                onChange={(e) => setWhatsappLine2(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-emerald-400 font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {savedSettingsSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>¡Configuración de tienda y cobros QR guardada con éxito!</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Guardar Cambios de la Tienda</span>
        </button>
      </div>
    </form>
  );
}
