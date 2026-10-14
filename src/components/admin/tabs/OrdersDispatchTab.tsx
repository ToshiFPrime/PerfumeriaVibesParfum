"use client";

import React, { useState } from "react";
import { Truck, Clock, Phone, FileText, Loader2, Download, PackageCheck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { AdminOrder } from "@/types/admin";
import { useReceipt } from "@/hooks/useReceipt";
import { exportOrdersToCsv } from "@/lib/export/exportCsv";
import { CourierDispatchModal } from "@/components/modals/admin/CourierDispatchModal";

interface OrdersDispatchTabProps {
  orders: AdminOrder[];
  onToggleOrderStatus: (orderId: string) => void;
  onNotifyCustomerWhatsApp: (order: AdminOrder) => void;
  onDispatchCourier?: (
    orderId: string,
    courierName: string,
    trackingNumber: string,
    terminalPoint: string,
    freightNote: string
  ) => void;
}

export function OrdersDispatchTab({
  orders,
  onToggleOrderStatus,
  onNotifyCustomerWhatsApp,
  onDispatchCourier,
}: OrdersDispatchTabProps) {
  const { downloadFromAdminOrder } = useReceipt();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<AdminOrder | null>(null);

  const handleDownloadPdf = async (order: AdminOrder) => {
    setGeneratingId(order.id);
    try {
      await downloadFromAdminOrder(order);
    } finally {
      setGeneratingId(null);
    }
  };

  const handleExportCsv = () => {
    exportOrdersToCsv(orders, `pedidos_vibes_parfum_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleConfirmDispatch = (
    orderId: string,
    courierName: string,
    trackingNumber: string,
    terminalPoint: string,
    freightNote: string
  ) => {
    if (onDispatchCourier) {
      onDispatchCourier(orderId, courierName, trackingNumber, terminalPoint, freightNote);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Barra Superior con Acciones y Exportación */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-zinc-300">
            Control de {orders.length} órdenes registradas. Genera guías de transporte interdepartamental o descarga comprobantes oficiales.
          </span>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
          title="Exportar órdenes a archivo CSV compatible con Excel"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Exportar Pedidos (CSV/Excel)</span>
        </button>
      </div>

      {/* Listado de Órdenes */}
      <div className="space-y-3">
        {orders.map((ord) => (
          <div
            key={ord.id}
            className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-md hover:border-zinc-700/70 transition-colors"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {ord.orderNumber}
                </span>
                <span className="text-sm font-bold text-white">{ord.customerName}</span>
                <span className="text-xs text-zinc-400 font-mono">({ord.phone})</span>
              </div>
              <p className="text-xs text-zinc-300">
                📍 {ord.city} ({ord.department}) • <strong className="text-white">{ord.itemsSummary}</strong>
              </p>
              <p className="text-[11px] text-zinc-500 flex items-center gap-2 flex-wrap">
                <span>Transporte: <strong className="text-zinc-300">{ord.courier || "Envío Express"}</strong></span>
                <span>•</span>
                <span>Fecha: {ord.date}</span>
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap justify-between xl:justify-end">
              <span className="text-base font-extrabold text-white font-mono mr-2">
                {formatPrice(ord.total)}
              </span>

              {/* Botón de cambio de estado */}
              <button
                type="button"
                onClick={() => onToggleOrderStatus(ord.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  ord.status === "Pendiente"
                    ? "bg-amber-950/70 border border-amber-500/50 text-amber-300 hover:bg-amber-900/80"
                    : ord.status === "Confirmado"
                    ? "bg-blue-950/70 border border-blue-500/50 text-blue-300 hover:bg-blue-900/80"
                    : ord.status === "Enviado"
                    ? "bg-purple-950/70 border border-purple-500/50 text-purple-300 hover:bg-purple-900/80"
                    : "bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80"
                }`}
                title="Clic para avanzar al siguiente estado"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{ord.status}</span>
              </button>

              {/* Botón de Generar Guía de Flota / Despacho */}
              <button
                type="button"
                onClick={() => setSelectedOrderForDispatch(ord)}
                className="px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                title="Generar Guía de Transporte (Flota / Courier) y notificar al cliente"
              >
                <PackageCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Guía Flota</span>
              </button>

              {/* Botón de Comprobante PDF Oficial */}
              <button
                type="button"
                onClick={() => handleDownloadPdf(ord)}
                disabled={generatingId === ord.id}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700/90 border border-zinc-700/80 text-amber-200 hover:text-amber-100 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Descargar Comprobante PDF de lujo para guía o empaque"
              >
                {generatingId === ord.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>PDF</span>
              </button>

              {/* Botón de Notificación WhatsApp Directa */}
              <button
                type="button"
                onClick={() => onNotifyCustomerWhatsApp(ord)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                title="Enviar mensaje de actualización por WhatsApp"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Despacho por Flota */}
      <CourierDispatchModal
        isOpen={!!selectedOrderForDispatch}
        onClose={() => setSelectedOrderForDispatch(null)}
        order={selectedOrderForDispatch}
        onConfirmDispatch={handleConfirmDispatch}
      />
    </div>
  );
}
