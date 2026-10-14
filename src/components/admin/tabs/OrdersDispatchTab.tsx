"use client";

import React, { useState } from "react";
import { Truck, Clock, Phone, FileText, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { AdminOrder } from "@/types/admin";
import { useReceipt } from "@/hooks/useReceipt";

interface OrdersDispatchTabProps {
  orders: AdminOrder[];
  onToggleOrderStatus: (orderId: string) => void;
  onNotifyCustomerWhatsApp: (order: AdminOrder) => void;
}

export function OrdersDispatchTab({
  orders,
  onToggleOrderStatus,
  onNotifyCustomerWhatsApp,
}: OrdersDispatchTabProps) {
  const { downloadFromAdminOrder } = useReceipt();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const handleDownloadPdf = async (order: AdminOrder) => {
    setGeneratingId(order.id);
    try {
      await downloadFromAdminOrder(order);
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-zinc-300">
            Haz clic en el estado para avanzar la orden o usa el botón de WhatsApp para avisar al comprador con un solo toque.
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {orders.map((ord) => (
          <div
            key={ord.id}
            className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-mono text-xs font-bold text-zinc-400">{ord.orderNumber}</span>
                <span className="text-sm font-bold text-white">{ord.customerName}</span>
                <span className="text-xs text-zinc-400 font-mono">({ord.phone})</span>
              </div>
              <p className="text-xs text-zinc-300">
                📍 {ord.city} • <strong className="text-white">{ord.itemsSummary}</strong>
              </p>
              <p className="text-[11px] text-zinc-500">
                Transporte: {ord.courier || "Envío Express"} • Registrado: {ord.date}
              </p>
            </div>

            <div className="flex items-center gap-3 justify-between md:justify-end">
              <span className="text-base font-extrabold text-white font-mono">
                {formatPrice(ord.total)}
              </span>

              {/* Botón de cambio de estado */}
              <button
                type="button"
                onClick={() => onToggleOrderStatus(ord.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  ord.status === "Pendiente"
                    ? "bg-amber-950/70 border border-amber-500/50 text-amber-300"
                    : ord.status === "Confirmado"
                    ? "bg-blue-950/70 border border-blue-500/50 text-blue-300"
                    : ord.status === "Enviado"
                    ? "bg-purple-950/70 border border-purple-500/50 text-purple-300"
                    : "bg-emerald-950/70 border border-emerald-500/50 text-emerald-300"
                }`}
                title="Clic para cambiar al siguiente estado"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{ord.status}</span>
              </button>

              {/* Botón de Comprobante PDF Oficial */}
              <button
                type="button"
                onClick={() => handleDownloadPdf(ord)}
                disabled={generatingId === ord.id}
                className="px-3.5 py-2 rounded-xl bg-zinc-800/90 hover:bg-zinc-700/90 border border-zinc-700/80 text-amber-200 hover:text-amber-100 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Descargar Comprobante PDF de lujo para guía o empaque"
              >
                {generatingId === ord.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>Comprobante PDF</span>
              </button>

              {/* Botón de Notificación WhatsApp Directa */}
              <button
                type="button"
                onClick={() => onNotifyCustomerWhatsApp(ord)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                title="Enviar mensaje de actualización por WhatsApp"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Avisar WhatsApp</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
