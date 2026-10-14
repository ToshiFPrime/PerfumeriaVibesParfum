"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, PhoneCall, Sparkles, Check, Share2 } from "lucide-react";
import type { Product, ProductVariant } from "@/types";
import { useCart } from "@/context/CartContext";
import {
  formatPrice,
  WHATSAPP_NUMBERS,
  generateProductWhatsAppMessage,
  buildWhatsAppLink,
} from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addedAnimation) return; // Anti-spam prevention
    addItem(product, selectedVariant, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleQuickWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/producto/${product.slug}`
        : `https://vibesparfum.vercel.app/producto/${product.slug}`;
    const msg = generateProductWhatsAppMessage(
      product.name,
      product.brand,
      selectedVariant.label,
      selectedVariant.price,
      url
    );
    const link = buildWhatsAppLink(WHATSAPP_NUMBERS.primary.full, msg);
    window.open(link, "_blank");
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/producto/${product.slug}`
        : `https://vibesparfum.vercel.app/producto/${product.slug}`;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="group relative rounded-3xl card-luxury flex flex-col overflow-hidden">
      {/* Top Media Container */}
      <Link href={`/producto/${product.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-zinc-900">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-black/30 opacity-70" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isOnSale && (
            <span className="px-2.5 py-1 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              Oferta {product.discountPercent ? `-${product.discountPercent}%` : ""}
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2.5 py-1 rounded-full bg-zinc-900/80 border border-zinc-600 text-white text-[10px] font-semibold tracking-wider backdrop-blur-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-zinc-300" />
              Más Vendido
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-full bg-zinc-950/80 border border-zinc-700/60 text-zinc-300 text-[10px] font-medium backdrop-blur-md">
            {product.gender}
          </span>
        </div>

        {/* Subtle Olfactory Tag */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between text-[11px] text-zinc-300 backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-xl border border-white/10">
          <span className="truncate font-medium">{product.olfactoryFamily}</span>
          <span className="text-zinc-400 shrink-0">{product.concentration.split(" ")[0]}</span>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-semibold truncate">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-zinc-300 text-xs">
              <Star className="w-3.5 h-3.5 fill-white text-white" />
              <span className="font-bold">{product.rating}</span>
              <span className="text-zinc-500">({product.reviewsCount})</span>
            </div>
          </div>

          <Link href={`/producto/${product.slug}`} className="block group-hover:text-zinc-200 transition-colors">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Variant Selector (Milliliters Pills) */}
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">
            Seleccionar presentación:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {product.variants.map((v) => {
              const isSelected = selectedVariant.id === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVariant(v)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 active:scale-95 ${
                    isSelected
                      ? "bg-white text-zinc-950 shadow-md font-bold"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  {v.milliliters}ml
                </button>
              );
            })}
          </div>
        </div>

        {/* Price & Primary Actions */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                {formatPrice(selectedVariant.price)}
              </span>
              {selectedVariant.compareAtPrice && (
                <span className="text-xs text-zinc-500 line-through">
                  {formatPrice(selectedVariant.compareAtPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-400 block font-medium">
              {selectedVariant.label}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Compartir fragancia"
              className={`min-w-[40px] min-h-[40px] p-2.5 rounded-xl border flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
                copiedLink
                  ? "bg-white text-zinc-950 border-white shadow-md"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
              }`}
              title={copiedLink ? "¡Enlace de fragancia copiado!" : "Compartir fragancia"}
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-emerald-600 animate-in zoom-in-50" />
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={handleQuickWhatsApp}
              aria-label="Consultar por WhatsApp"
              className="min-w-[40px] min-h-[40px] p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/60 hover:border-emerald-400 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
              title="Consultar disponibilidad por WhatsApp"
            >
              <PhoneCall className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addedAnimation}
              aria-label="Añadir al carrito"
              className={`min-w-[40px] min-h-[40px] p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 disabled:cursor-not-allowed ${
                addedAnimation
                  ? "bg-emerald-500 text-white shadow-lg"
                  : "bg-white text-zinc-950 hover:bg-zinc-200 shadow-md cursor-pointer"
              }`}
              title="Añadir a mi carrito"
            >
              {addedAnimation ? (
                <Check className="w-4 h-4 text-white animate-in zoom-in-50" />
              ) : (
                <ShoppingBag className="w-4 h-4 text-zinc-950" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
