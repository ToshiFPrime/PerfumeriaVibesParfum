"use client";

import React, { useState } from "react";
import {
  Truck,
  Building2,
  FileSpreadsheet,
  MapPin,
  PackageCheck,
  Phone,
} from "lucide-react";
import { BaseModal } from "../BaseModal";
import type { AdminOrder } from "@/types/admin";
import { formatPrice } from "@/lib/utils";

export interface CourierDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: AdminOrder | null;
  onConfirmDispatch: (
    orderId: string,
    courierName: string,
    trackingNumber: string,
    terminalPoint: string,
    freightNote: string
  ) => void;
}

const BOLIVIAN_COURIERS = [
  "Trans Copacabana MEM 1",
  "Flota El Dorado",
  "Expreso Bolívar",
  "Trans Azul",
  "Flota Cosmos",
  "Flota San Borja / Beni Express",
  "Terminal Bimodal (Santa Cruz)",
  "Terminal Minasa / Yungas (La Paz)",
  "Delivery Express Moto (Ciudad Local)",
  "Otro Servicio de Encomiendas",
];

interface CourierDispatchFormProps {
  order: AdminOrder;
  onClose: () => void;
  onConfirmDispatch: (
    orderId: string,
    courierName: string,
    trackingNumber: string,
    terminalPoint: string,
    freightNote: string
  ) => void;
}

function CourierDispatchForm({ order, onClose, onConfirmDispatch }: CourierDispatchFormProps) {
  const [courierCompany, setCourierCompany] = useState("Trans Copacabana MEM 1");
  const [customCourier, setCustomCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState(
    () => `GUIA-${order.orderNumber.replace(/[^0-9]/g, "") || Math.floor(10000 + Math.random() * 90000)}`
  );
  const [terminalPoint, setTerminalPoint] = useState(() =>
    order.department.toLowerCase().includes("santa cruz")
      ? "Terminal Bimodal Santa Cruz (Boletería de la Flota)"
      : order.department.toLowerCase().includes("la paz")
      ? "Terminal Central de Buses La Paz"
      : `Terminal Terrestre de ${order.city || order.department}`
  );
  const [freightNote, setFreightNote] = useState("Flete pagado por Vibes Parfum");
  const [openWhatsAppImmediately, setOpenWhatsAppImmediately] = useState(true);

  const resolvedCourier =
    courierCompany === "Otro Servicio de Encomiendas"
      ? customCourier.trim() || "Empresa de Transporte"
      : courierCompany;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalTracking = trackingNumber.trim() || "S/N";
    const finalTerminal = terminalPoint.trim() || "Terminal de Buses";
    const finalFreight = freightNote.trim() || "Pagado";

    // 1. Invocar callback de actualización de orden
    onConfirmDispatch(
      order.id,
      resolvedCourier,
      finalTracking,
      finalTerminal,
      finalFreight
    );

    // 2. Disparar mensaje de WhatsApp si está seleccionado
    if (openWhatsAppImmediately) {
      const cleanPhone = order.phone.replace(/[^0-9]/g, "");
      const finalPhone = cleanPhone.startsWith("591") ? cleanPhone : `591${cleanPhone}`;

      const message = `✨ *VIBES PARFUM BOLIVIA — DESPACHO DE ORDEN* 🚚✨\n\nEstimado(a) *${order.customerName}*,\n\nTe confirmamos con mucha alegría que tu pedido de fragancias *#${order.orderNumber}* ya fue entregado a la empresa de transporte para su despacho.\n\n📦 *DETALLE DE TU GUÍA DE ENCOMIENDA:*\n🏢 *Transporte:* ${resolvedCourier}\n🏷️ *N° de Guía / Rastreo:* *${finalTracking}*\n📍 *Destino:* ${order.city} (${order.department})\n📌 *Punto de Retiro:* ${finalTerminal}\n💳 *Flete:* ${finalFreight}\n🛍️ *Contenido:* ${order.itemsSummary}\n\n*Instrucciones de Retiro:*\nPuedes reclamar tu paquete presentando tu Cédula de Identidad original y el N° de Guía arriba indicado.\n\n¡Cualquier consulta estamos atentos! Muchas gracias por confiar en Vibes Parfum. 🌹`;

      window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`, "_blank");
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Resumen Destinatario */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-white text-sm">{order.customerName}</span>
          <span className="font-mono text-zinc-400">{order.phone}</span>
        </div>
        <div className="flex items-center justify-between text-zinc-400">
          <span>
            📍 {order.city} ({order.department})
          </span>
          <span className="font-bold text-white">{formatPrice(order.total)}</span>
        </div>
        <p className="text-[11px] text-zinc-500 truncate">
          {order.itemsSummary}
        </p>
      </div>

      {/* Inputs de la Empresa de Transporte */}
      <div className="space-y-3 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            Empresa de Transporte o Flota:
          </label>
          <select
            value={courierCompany}
            onChange={(e) => setCourierCompany(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-emerald-400 text-xs transition-colors cursor-pointer"
          >
            {BOLIVIAN_COURIERS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {courierCompany === "Otro Servicio de Encomiendas" && (
          <div className="space-y-1">
            <label className="font-medium text-zinc-400">Nombre de la Empresa o Servicio:</label>
            <input
              type="text"
              placeholder="Ej. Trans San Cristóbal / Expreso Mopar"
              value={customCourier}
              onChange={(e) => setCustomCourier(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
              N° de Guía de Encomienda / Talón:
            </label>
            <input
              type="text"
              placeholder="Ej. TC-948102"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Condición del Flete:</label>
            <select
              value={freightNote}
              onChange={(e) => setFreightNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-emerald-400 cursor-pointer"
            >
              <option value="Flete pagado por Vibes Parfum">Flete Pagado (Envío Gratis / Promoción)</option>
              <option value="Flete por pagar en destino (Boletería)">Por pagar en destino (Boletería)</option>
              <option value="Entrega a domicilio coordinada">Entrega a domicilio coordinada</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            Lugar / Ventanilla de Retiro del Paquete:
          </label>
          <input
            type="text"
            placeholder="Ej. Terminal Bimodal Santa Cruz - Ventanilla #14"
            value={terminalPoint}
            onChange={(e) => setTerminalPoint(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-xs focus:outline-none focus:border-emerald-400"
          />
        </div>

        <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={openWhatsAppImmediately}
            onChange={(e) => setOpenWhatsAppImmediately(e.target.checked)}
            className="w-4 h-4 rounded bg-zinc-950 border-zinc-800 text-emerald-500 focus:ring-0 cursor-pointer"
          />
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            Abrir WhatsApp inmediatamente con el mensaje formateado de despacho
          </span>
        </label>
      </div>

      {/* Acciones */}
      <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
        >
          Cancelar
        </button>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-950/40 active:scale-95 cursor-pointer"
        >
          <PackageCheck className="w-4 h-4" />
          <span>Confirmar Despacho & Enviar Guía</span>
        </button>
      </div>
    </form>
  );
}

export function CourierDispatchModal({
  isOpen,
  onClose,
  order,
  onConfirmDispatch,
}: CourierDispatchModalProps) {
  if (!order) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Rótulo y Guía de Despacho (Flota / Courier)"
      subtitle={`Genera el comprobante de envío y guía de transporte para la orden ${order.orderNumber}`}
      icon={<Truck className="w-5 h-5 text-emerald-400" />}
      maxWidth="lg"
    >
      {isOpen && (
        <CourierDispatchForm
          key={order.id}
          order={order}
          onClose={onClose}
          onConfirmDispatch={onConfirmDispatch}
        />
      )}
    </BaseModal>
  );
}
