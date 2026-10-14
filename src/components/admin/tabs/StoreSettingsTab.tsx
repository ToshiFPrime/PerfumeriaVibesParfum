"use client";

import React from "react";
import { QrCode, CheckCircle, Save, Megaphone, Sparkles, Eye } from "lucide-react";

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
  announcementText?: string;
  setAnnouncementText?: (val: string) => void;
  isAnnouncementActive?: boolean;
  setIsAnnouncementActive?: (val: boolean) => void;
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
  announcementText = "Envíos asegurados a toda Bolivia (La Paz, Santa Cruz, Cochabamba y departamentos) • Cupón 10% OFF: VIBES10",
  setAnnouncementText,
  isAnnouncementActive = true,
  setIsAnnouncementActive,
  savedSettingsSuccess,
  onSaveSettings,
}: StoreSettingsTabProps) {
  return (
    <form onSubmit={onSaveSettings} className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      {/* 1. SECCIÓN: BANNER DE ANUNCIOS SUPERIOR */}
      <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-400" />
              Barra de Anuncios y Promociones (Top Bar)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              El texto que ven todos los visitantes en la parte superior de la boutique.
            </p>
          </div>

          {setIsAnnouncementActive && (
            <label className="flex items-center gap-2 text-xs text-zinc-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={isAnnouncementActive}
                onChange={(e) => setIsAnnouncementActive(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-amber-500 focus:ring-0 cursor-pointer"
              />
              <span>Banner Activo en la Tienda</span>
            </label>
          )}
        </div>

        <div className="space-y-2 text-xs">
          <label className="font-semibold text-zinc-300">Mensaje Promocional Destacado:</label>
          <input
            type="text"
            value={announcementText}
            onChange={(e) => setAnnouncementText?.(e.target.value)}
            placeholder="Ej. Envíos gratis a partir de 350 Bs. a toda Bolivia | Cupón VIBES10"
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Vista previa en tiempo real */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            Vista Previa en Tienda:
          </span>
          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs flex items-center justify-center gap-2 text-zinc-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
            <span className="truncate">{announcementText || "Sin mensaje de anuncio configurado"}</span>
          </div>
        </div>
      </div>

      {/* 2. SECCIÓN: DATOS DE COBRO QR SIMPLE (BOLIVIA) */}
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
