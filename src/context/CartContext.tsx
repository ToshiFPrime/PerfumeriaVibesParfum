"use client";

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { CartItem, DiscountCoupon, Product, ProductVariant, ShippingRate } from "@/types";
import { ACTIVE_COUPONS, BOLIVIA_DEPARTMENTS } from "@/lib/data/shippingRates";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  itemsCount: number;
  subtotal: number;
  discount: number;
  coupon: DiscountCoupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  selectedShipping: ShippingRate | null;
  setSelectedShipping: (rate: ShippingRate | null) => void;
  shippingCost: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Sincronizador de almacén externo para React 19 (0 ms, sin errores de hidratación y sincro multi-pestaña)
function subscribeCart(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("vibes_cart_sync", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("vibes_cart_sync", callback);
  };
}

function getCartSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem("vibes_cart") || "[]";
}

function getCouponSnapshot(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("vibes_coupon") || "";
}

function getServerSnapshot(): string {
  return "[]";
}

function getServerCouponSnapshot(): string {
  return "";
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const rawCart = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerSnapshot);
  const rawCoupon = useSyncExternalStore(subscribeCart, getCouponSnapshot, getServerCouponSnapshot);

  const items = useMemo<CartItem[]>(() => {
    try {
      return JSON.parse(rawCart);
    } catch {
      return [];
    }
  }, [rawCart]);

  const coupon = useMemo<DiscountCoupon | null>(() => {
    if (!rawCoupon) return null;
    try {
      return JSON.parse(rawCoupon);
    } catch {
      return null;
    }
  }, [rawCoupon]);

  const persistCart = (newItems: CartItem[]) => {
    try {
      localStorage.setItem("vibes_cart", JSON.stringify(newItems));
      window.dispatchEvent(new Event("vibes_cart_sync"));
    } catch (e) {
      console.error("Error al persistir carrito", e);
    }
  };

  const persistCoupon = (newCoupon: DiscountCoupon | null) => {
    try {
      if (newCoupon) {
        localStorage.setItem("vibes_coupon", JSON.stringify(newCoupon));
      } else {
        localStorage.removeItem("vibes_coupon");
      }
      window.dispatchEvent(new Event("vibes_cart_sync"));
    } catch (e) {
      console.error("Error al persistir cupón", e);
    }
  };

  const [selectedShipping, setSelectedShipping] = useState<ShippingRate | null>(BOLIVIA_DEPARTMENTS[0]); // Default La Paz
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const addItem = (product: Product, variant: ProductVariant, quantity = 1) => {
    const itemId = `${product.id}-${variant.id}`;
    const existing = items.find((item) => item.id === itemId);
    let nextItems: CartItem[];
    if (existing) {
      nextItems = items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      nextItems = [
        ...items,
        {
          id: itemId,
          productId: product.id,
          productName: product.name,
          brand: product.brand,
          image: product.images[0] || "",
          variant,
          quantity,
        },
      ];
    }
    persistCart(nextItems);
    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    persistCart(items.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    persistCart(
      items.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    persistCart([]);
    persistCoupon(null);
  };

  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce(
    (acc, item) => acc + item.variant.price * item.quantity,
    0
  );

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const clean = code.trim().toUpperCase();
    const found = ACTIVE_COUPONS.find((c) => c.code === clean);

    if (!found) {
      return { success: false, message: "El cupón ingresado no es válido o ha expirado." };
    }

    if (found.minSubtotal && subtotal < found.minSubtotal) {
      return {
        success: false,
        message: `Este cupón requiere una compra mínima de Bs. ${found.minSubtotal}.`,
      };
    }

    persistCoupon(found);
    return {
      success: true,
      message: `¡Cupón ${found.code} aplicado! ${found.percentage}% de descuento.`,
    };
  };

  const removeCoupon = () => {
    persistCoupon(null);
  };

  const discount = coupon ? Math.round((subtotal * coupon.percentage) / 100) : 0;

  // Si el subtotal supera el umbral de envío gratis para el departamento, el envío es 0
  const isFreeShipping =
    selectedShipping?.freeShippingAbove &&
    subtotal >= selectedShipping.freeShippingAbove;

  const shippingCost = selectedShipping ? (isFreeShipping ? 0 : selectedShipping.cost) : 0;

  const total = Math.max(0, subtotal - discount + shippingCost);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemsCount,
        subtotal,
        discount,
        coupon,
        applyCoupon,
        removeCoupon,
        selectedShipping,
        setSelectedShipping,
        shippingCost,
        total,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe ser utilizado dentro de un CartProvider");
  }
  return context;
}
