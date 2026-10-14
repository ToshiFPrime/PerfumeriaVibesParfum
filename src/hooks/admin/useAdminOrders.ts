"use client";

import { useState } from "react";
import { INITIAL_ORDERS } from "@/lib/data/adminMockData";
import { formatPrice } from "@/lib/utils";
import type { AdminOrder } from "@/types/admin";

export function useAdminOrders() {
  const [ordersList, setOrdersList] = useState<AdminOrder[]>(INITIAL_ORDERS);

  const handleToggleOrderStatus = (orderId: string) => {
    let targetNextStatus: AdminOrder["status"] = "Pendiente";
    setOrdersList((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const nextStatus: Record<AdminOrder["status"], AdminOrder["status"]> = {
          Pendiente: "Confirmado",
          Confirmado: "Enviado",
          Enviado: "Entregado",
          Entregado: "Pendiente",
        };
        targetNextStatus = nextStatus[ord.status];
        return { ...ord, status: targetNextStatus };
      })
    );

    fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: targetNextStatus }),
    }).catch(() => {});
  };

  const handleNotifyCustomerWhatsApp = (order: AdminOrder) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("591") ? cleanPhone : `591${cleanPhone}`;

    const message = encodeURIComponent(
      `¡Hola ${order.customerName}! 🌸 Te escribimos de *Vibes Parfum Bolivia* respecto a tu orden *${order.orderNumber}*.\n\n` +
      `📦 *Detalle:* ${order.itemsSummary}\n` +
      `🚚 *Estado Actual:* *${order.status}*\n` +
      `📍 *Destino:* ${order.city} (${order.department})\n` +
      `💰 *Total:* ${formatPrice(order.total)}\n\n` +
      `¿Deseas el comprobante oficial o información de rastreo de tu envío? ¡Estamos atentos!`
    );

    window.open(`https://wa.me/${formattedPhone}?text=${message}`, "_blank");
  };

  const handleDispatchCourier = (
    orderId: string,
    courierName: string,
    trackingNumber: string,
    terminalPoint: string,
    freightNote: string
  ) => {
    const courierLabel = `${courierName} (Guía: ${trackingNumber})`;
    setOrdersList((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status: "Enviado",
          courier: courierLabel,
        };
      })
    );

    fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId,
        status: "Enviado",
        courier: courierLabel,
      }),
    }).catch(() => {});

    // Notificar automáticamente por WhatsApp con datos de guía de flota
    const targetOrder = ordersList.find((o) => o.id === orderId);
    if (targetOrder) {
      const cleanPhone = targetOrder.phone.replace(/[^0-9]/g, "");
      const formattedPhone = cleanPhone.startsWith("591") ? cleanPhone : `591${cleanPhone}`;
      const msg = encodeURIComponent(
        `¡Buenas noticias ${targetOrder.customerName}! 🚚 Tu pedido *${targetOrder.orderNumber}* de *Vibes Parfum* ya fue despachado.\n\n` +
        `🏢 *Empresa de Transporte:* ${courierName}\n` +
        `📋 *N° de Guía / Rastreo:* ${trackingNumber}\n` +
        `📍 *Punto de Retiro / Entrega:* ${terminalPoint}\n` +
        (freightNote ? `ℹ️ *Nota de Flete:* ${freightNote}\n` : "") +
        `\n¡Tu paquete va asegurado y con protección de alta perfumería! Te avisaremos al llegar.`
      );
      window.open(`https://wa.me/${formattedPhone}?text=${msg}`, "_blank");
    }
  };

  return {
    ordersList,
    setOrdersList,
    handleToggleOrderStatus,
    handleNotifyCustomerWhatsApp,
    handleDispatchCourier,
  };
}
