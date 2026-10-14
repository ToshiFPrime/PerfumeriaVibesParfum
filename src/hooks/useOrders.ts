"use client";

import { useState, useCallback } from "react";
import type { AdminOrder } from "@/types/admin";
import type { CustomerOrder } from "@/lib/validation/schemas";
import { INITIAL_ORDERS } from "@/lib/data/adminMockData";

export interface OrderItemInput {
  productId: string;
  productName: string;
  variantId: string;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderPayload {
  customer: CustomerOrder;
  items: OrderItemInput[];
  couponCode?: string;
  shippingCost?: number;
}

export interface BackendOrderResponse {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  department: string;
  city: string;
  address: string;
  notes?: string | null;
  items: OrderItemInput[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: string;
  paymentMethod: string;
  createdAt: string;
}

export interface UseOrdersReturn {
  orders: AdminOrder[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  lastCreatedOrder: BackendOrderResponse | null;
  createOrder: (payload: CreateOrderPayload) => Promise<{ success: boolean; order?: BackendOrderResponse; error?: string }>;
  fetchAdminOrders: () => Promise<AdminOrder[]>;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<BackendOrderResponse | null>(null);

  const createOrder = useCallback(async (payload: CreateOrderPayload) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo registrar la orden en el servidor");
      }

      const created: BackendOrderResponse = data.order;
      setLastCreatedOrder(created);

      return { success: true, order: created };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al registrar el pedido";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const fetchAdminOrders = useCallback(async (): Promise<AdminOrder[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders");
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      const list = data.orders || INITIAL_ORDERS;
      setOrders(list);
      return list;
    } catch (err) {
      console.warn("Fallo al consultar /api/orders, usando datos locales:", err);
      setOrders(INITIAL_ORDERS);
      setError(err instanceof Error ? err.message : "Error al cargar pedidos");
      return INITIAL_ORDERS;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    orders,
    isLoading,
    isSubmitting,
    error,
    lastCreatedOrder,
    createOrder,
    fetchAdminOrders,
  };
}
