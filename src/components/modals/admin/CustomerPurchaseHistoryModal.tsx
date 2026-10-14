"use client";

import React from "react";
import Image from "next/image";
import { ShoppingBag, PhoneCall, CheckCircle2, Clock, Truck, Tag } from "lucide-react";
import { BaseModal } from "@/components/common/BaseModal";
import { formatPrice } from "@/lib/utils";
import type { CustomerPurchaseHistory } from "@/types/admin";

export interface CustomerPurchaseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: CustomerPurchaseHistory | null;
}

export function CustomerPurchaseHistoryModal({
  isOpen,
  onClose,
  history,
}: CustomerPurchaseHistoryModalProps) {
  if (!isOpen || !history) return null;

  const handleWhatsAppContact = () => {
    const cleanPhone = history.phone.replace(/[^0-9]/g, "");
    const finalPhone = cleanPhone.startsWith("591") ? cleanPhone : `591${cleanPhone}`;
    const message =
      `Hola *${history.userName}*, un cordial saludo de *Vibes Parfum Bolivia* ✨\n\n` +
      `Revisando tu historial de compras con nosotros, queremos agradecerte por tu preferencia continua.\n` +
      `¿Cómo ha sido tu experiencia con tus fragancias favoritas? ¿Te gustaría conocer los nuevos decants que llegaron esta semana?`;

    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const totalSpentAllOrders = history.orders.reduce((sum, ord) => sum + ord.total, 0);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Historial de Compras: ${history.userName}`}
      subtitle={`Cliente registrado de ${history.department} • ${history.role}`}
      icon={<ShoppingBag className="w-5 h-5 text-emerald-400" />}
      maxWidth="xl"
    >
      <div className="space-y-6 pt-1">
        {/* Resumen del Cliente */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-lg text-white shrink-0">
              {history.userName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">{history.userName}</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/70 border border-emerald-500/40 text-emerald-400">
                  {history.role}
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                📱 {history.phone} • 📍 {history.department}, Bolivia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold block">
                Total Acumulado
              </span>
              <span className="text-base font-extrabold text-emerald-400 font-mono">
                {formatPrice(totalSpentAllOrders)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleWhatsAppContact}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer shrink-0"
              title="Contactar al cliente por WhatsApp"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Listado de Órdenes Confirmadas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Órdenes Registradas y Entregadas ({history.orders.length})
            </h4>
            <span className="text-[11px] text-zinc-500 font-mono">Registro completo de auditoría</span>
          </div>

          {history.orders.length === 0 ? (
            <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center text-xs text-zinc-400">
              No se registran compras confirmadas para este cliente aún.
            </div>
          ) : (
            history.orders.map((order) => (
              <div
                key={order.orderId}
                className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4 hover:border-zinc-700 transition-all shadow-md"
              >
                {/* Cabecera de la Orden */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-800/80">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-700">
                      {order.orderNumber}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      {order.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      {order.status}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300">
                      💳 {order.paymentMethod}
                    </span>
                  </div>
                </div>

                {/* Items de la Orden */}
                <div className="space-y-2.5">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/70 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.productName}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-zinc-400">{item.brand}</p>
                          <p className="font-bold text-white">{item.productName}</p>
                          <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                            <Tag className="w-3 h-3 text-zinc-500" />
                            {item.variantLabel} × <strong className="text-zinc-200">{item.quantity}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono font-bold text-white">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-zinc-500 block font-mono">
                            ({formatPrice(item.price)} c/u)
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pie de la Orden */}
                <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="text-zinc-400 flex items-center gap-1.5 text-[11px]">
                    <Truck className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Entrega: {order.courier || "Encomienda Express"} • Destino: {order.city}</span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto font-mono">
                    <span className="text-zinc-400">Total Pedido:</span>
                    <span className="text-sm font-extrabold text-emerald-400">
                      {formatPrice(order.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Botón de Cierre */}
        <div className="pt-2 border-t border-zinc-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-6 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Cerrar Historial
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
