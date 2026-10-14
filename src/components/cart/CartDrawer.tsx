"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Tag,
  ArrowRight,
  Truck,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { BOLIVIA_DEPARTMENTS } from "@/lib/data/shippingRates";
import { formatPrice } from "@/lib/utils";
import dynamic from "next/dynamic";
import { BaseDrawer } from "@/components/modals";

const WhatsAppCheckoutModal = dynamic(
  () => import("@/components/modals").then((m) => m.WhatsAppCheckoutModal),
  { ssr: false }
);

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    itemsCount,
    subtotal,
    discount,
    coupon,
    applyCoupon,
    removeCoupon,
    shippingCost,
    total,
    selectedShipping,
    setSelectedShipping,
    isCartOpen,
    setIsCartOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim() || isApplyingCoupon) return;
    setIsApplyingCoupon(true);
    setTimeout(() => {
      const result = applyCoupon(couponCode);
      setCouponFeedback(result);
      if (result.success) {
        setCouponCode("");
      }
      setIsApplyingCoupon(false);
    }, 250);
  };

  const footerContent =
    items.length > 0 ? (
      <div className="space-y-3">
        <div className="space-y-1.5 text-xs text-zinc-400">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-white font-medium">{formatPrice(subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-emerald-400 font-medium">
              <span>Descuento ({coupon?.code})</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Envío ({selectedShipping?.department})</span>
            <span className={shippingCost === 0 ? "text-emerald-400 font-bold" : "text-white"}>
              {shippingCost === 0 ? "GRATIS" : formatPrice(shippingCost)}
            </span>
          </div>
          <div className="pt-2 border-t border-zinc-800 flex justify-between text-base font-bold text-white">
            <span>Total Estimado</span>
            <span className="text-emerald-400 text-lg">{formatPrice(total)}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsCheckoutOpen(true)}
          className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-zinc-200 active:scale-[0.98] text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl transition-all duration-200 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-zinc-950" />
          <span>Pedir por WhatsApp ({formatPrice(total)})</span>
        </button>

        <p className="text-[11px] text-center text-zinc-500">
          Coordinación personalizada • Envío seguro a tu puerta
        </p>
      </div>
    ) : null;

  return (
    <>
      <BaseDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title={`Tu Carrito de Fragancias (${itemsCount})`}
        icon={<ShoppingBag className="w-5 h-5 text-white" />}
        maxWidth="md"
        footer={footerContent}
      >
        <div className="p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-12">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-bold text-white">Tu carrito está vacío</p>
                <p className="text-xs text-zinc-400 max-w-xs">
                  Explora nuestro catálogo de decants de lujo y descubre tu nueva fragancia firma.
                </p>
              </div>
              <Link
                href="/catalogo"
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 rounded-full bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-all flex items-center gap-1.5"
              >
                <span>Explorar Perfumes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 flex gap-3.5 items-center"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider truncate">
                        {item.brand}
                      </p>
                      <p className="text-xs font-bold text-white truncate">
                        {item.productName}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        {item.variant.label}
                      </p>
                      <p className="text-xs font-bold text-emerald-400 mt-1">
                        {formatPrice(item.variant.price * item.quantity)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-zinc-850 transition-colors cursor-pointer"
                        title="Eliminar producto"
                        aria-label="Eliminar producto del carrito"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-xl p-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer active:scale-90"
                          aria-label="Disminuir cantidad"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white px-1.5 min-w-[22px] text-center font-mono">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer active:scale-90"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Estimator */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-zinc-400" />
                    Destino de Envío
                  </span>
                  <span className="text-zinc-400 font-medium text-[11px]">
                    {selectedShipping?.department}
                  </span>
                </div>
                <select
                  value={selectedShipping?.department}
                  onChange={(e) => {
                    const found = BOLIVIA_DEPARTMENTS.find((d) => d.department === e.target.value);
                    if (found) setSelectedShipping(found);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
                >
                  {BOLIVIA_DEPARTMENTS.map((dept) => (
                    <option key={dept.department} value={dept.department}>
                      {dept.department} ({dept.estimatedDays}) — {formatPrice(dept.cost)}
                    </option>
                  ))}
                </select>
                {selectedShipping?.freeShippingAbove && (
                  <p className="text-[10px] text-zinc-400">
                    {subtotal >= selectedShipping.freeShippingAbove ? (
                      <span className="text-emerald-400 font-semibold">
                        ¡Felicidades! Tienes Envío GRATIS a {selectedShipping.department}.
                      </span>
                    ) : (
                      <span>
                        Agrega{" "}
                        <strong className="text-white">
                          {formatPrice(selectedShipping.freeShippingAbove - subtotal)}
                        </strong>{" "}
                        más para envío GRATIS a {selectedShipping.department}.
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Coupon Code Form */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/70 space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Cupón (ej. VIBES10)"
                      className="w-full pl-8 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors uppercase"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    className="px-4 py-2 min-h-[38px] rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-xs font-semibold text-white transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    {isApplyingCoupon ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Aplicar</span>
                    )}
                  </button>
                </form>

                {coupon && (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {coupon.code} ({coupon.percentage}% OFF)
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-zinc-400 hover:text-white text-[11px] underline cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                )}

                {couponFeedback && !coupon && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {couponFeedback.message}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </BaseDrawer>

      {/* WhatsApp Checkout Modal */}
      <WhatsAppCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
}
