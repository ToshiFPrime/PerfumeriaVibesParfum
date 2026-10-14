"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Star,
  ShoppingBag,
  PhoneCall,
  Check,
  ArrowLeft,
  Share2,
  FileText,
  Sparkles,
} from "lucide-react";
import type { Product, ProductVariant, Review } from "@/types";
import { useCart } from "@/context/CartContext";
import {
  formatPrice,
  WHATSAPP_NUMBERS,
  generateProductWhatsAppMessage,
  generateProductQuoteWhatsAppMessage,
  buildWhatsAppLink,
} from "@/lib/utils";
import { MOCK_REVIEWS } from "@/lib/data/mockPerfumes";
import {
  ShareProductModal,
  WriteReviewModal,
  DecantGuideModal,
} from "@/components/modals";
import {
  ProductGallery,
  ProductOlfactoryPyramid,
  ProductReviewsSection,
  ProductRelatedSection,
} from "@/components/product";

interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [selectedWhatsAppLine, setSelectedWhatsAppLine] = useState<"65947174" | "65867500">("65947174");

  // Sistema de Reseñas
  const [reviewsList, setReviewsList] = useState<Review[]>(
    MOCK_REVIEWS[product.slug] || [
      {
        id: "default-rev",
        productId: product.id,
        authorName: "Cliente Verificado",
        rating: 5,
        comment: "Excelente fijación y proyección. Envío muy rápido por encomienda.",
        isVerifiedPurchase: true,
        date: "Hace 1 semana",
      },
    ]
  );

  const [showShareModal, setShowShareModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDecantGuide, setShowDecantGuide] = useState(false);

  const getProductShareUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/producto/${product.slug}`;
    }
    return `https://vibesparfum.vercel.app/producto/${product.slug}`;
  };

  const handleAddToCart = () => {
    if (addedAnimation) return; // Anti-spam prevention
    addItem(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleWhatsAppPurchase = () => {
    const msg = generateProductWhatsAppMessage(
      product.name,
      product.brand,
      selectedVariant.label,
      selectedVariant.price * quantity,
      getProductShareUrl()
    );
    const phone =
      selectedWhatsAppLine === "65947174"
        ? WHATSAPP_NUMBERS.primary.full
        : WHATSAPP_NUMBERS.secondary.full;
    const url = buildWhatsAppLink(phone, msg);
    window.open(url, "_blank");
  };

  const handleWhatsAppQuote = () => {
    const msg = generateProductQuoteWhatsAppMessage(
      product.name,
      product.brand,
      selectedVariant.label,
      selectedVariant.price * quantity,
      "Bolivia",
      getProductShareUrl()
    );
    const phone =
      selectedWhatsAppLine === "65947174"
        ? WHATSAPP_NUMBERS.primary.full
        : WHATSAPP_NUMBERS.secondary.full;
    const url = buildWhatsAppLink(phone, msg);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-24 text-zinc-100">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/40 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Catálogo</span>
          </Link>

          <div className="flex items-center gap-2">
            <span>{product.brand}</span>
            <span>/</span>
            <span className="text-white font-medium truncate max-w-[160px] sm:max-w-none">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Main Product Display Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Column 1: Image Gallery & Trust (6 cols) */}
          <div className="lg:col-span-6">
            <ProductGallery
              images={product.images}
              name={product.name}
              isOnSale={product.isOnSale}
              discountPercent={product.discountPercent}
            />
          </div>

          {/* Column 2: Details, Variant Selector, Olfactory Pyramid & Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header info */}
            <div className="space-y-2 border-b border-zinc-800/80 pb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-400 font-bold">
                  {product.brand}
                </span>
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="flex items-center text-white">
                    <Star className="w-4 h-4 fill-white text-white" />
                  </div>
                  <span className="font-bold text-white">{product.rating}</span>
                  <span className="text-zinc-500">({reviewsList.length} valoraciones)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-medium">
                  {product.concentration}
                </span>
                <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-medium">
                  Familia: {product.olfactoryFamily}
                </span>
                <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 font-medium">
                  {product.gender}
                </span>
              </div>
            </div>

            {/* Price display */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {formatPrice(selectedVariant.price * quantity)}
                </span>
                {selectedVariant.compareAtPrice && (
                  <span className="text-base text-zinc-500 line-through">
                    {formatPrice(selectedVariant.compareAtPrice * quantity)}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400">
                Presentación activa: <strong className="text-white">{selectedVariant.label}</strong>
              </p>
            </div>

            {/* Variant Selector (Milliliters & Format) */}
            <div className="space-y-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white uppercase tracking-wider">
                  Elige la Presentación:
                </span>
                <button
                  type="button"
                  onClick={() => setShowDecantGuide(true)}
                  className="text-amber-400 hover:text-amber-300 font-medium underline flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>¿Qué es un decant? (Guía 5ml / 10ml)</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {product.variants.map((variant) => {
                  const isSelected = selectedVariant.id === variant.id;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      className={`min-h-[64px] p-3 rounded-xl border text-left flex flex-col justify-between transition-all duration-150 active:scale-95 ${
                        isSelected
                          ? "bg-white text-zinc-950 border-white shadow-xl"
                          : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? "text-zinc-950" : "text-white"}`}>
                          {variant.label}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-zinc-950" />}
                      </div>
                      <span className={`text-xs font-extrabold mt-2 ${isSelected ? "text-zinc-950" : "text-white"}`}>
                        {formatPrice(variant.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Cantidad:
              </span>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 text-lg font-bold transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="text-sm font-bold text-white w-6 text-center font-mono">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 text-lg font-bold transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Primary Purchasing CTA Actions */}
            <div className="space-y-3 pt-2">
              {/* WhatsApp Purchase Button */}
              <button
                type="button"
                onClick={handleWhatsAppPurchase}
                className="w-full min-h-[48px] py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-emerald-950/50 transition-all duration-200 cursor-pointer"
              >
                <PhoneCall className="w-5 h-5" />
                <span>Comprar por WhatsApp ({formatPrice(selectedVariant.price * quantity)})</span>
              </button>

              {/* WhatsApp Quotation Button */}
              <button
                type="button"
                onClick={handleWhatsAppQuote}
                className="w-full min-h-[44px] py-3.5 px-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/80 active:scale-[0.98] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Solicitar Cotización Formal & Asesoría</span>
              </button>

              {/* Add to Cart & Share Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={addedAnimation}
                  className={`min-h-[48px] py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all duration-200 active:scale-[0.98] ${
                    addedAnimation
                      ? "bg-white text-zinc-950 border-white disabled:cursor-not-allowed"
                      : "bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-700 cursor-pointer"
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-zinc-950" />
                      <span>¡Añadido!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-white" />
                      <span>Añadir al Carrito</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="min-h-[48px] py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-zinc-300" />
                  <span>Compartir</span>
                </button>
              </div>

              {/* WhatsApp Line Selector */}
              <div className="flex items-center justify-center gap-3 text-xs text-zinc-400 pt-1">
                <span>Línea para pedido:</span>
                <button
                  type="button"
                  onClick={() => setSelectedWhatsAppLine("65947174")}
                  className={`underline decoration-dotted ${
                    selectedWhatsAppLine === "65947174" ? "text-emerald-400 font-bold" : "text-zinc-500"
                  }`}
                >
                  {WHATSAPP_NUMBERS.primary.raw}
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => setSelectedWhatsAppLine("65867500")}
                  className={`underline decoration-dotted ${
                    selectedWhatsAppLine === "65867500" ? "text-emerald-400 font-bold" : "text-zinc-500"
                  }`}
                >
                  {WHATSAPP_NUMBERS.secondary.raw}
                </button>
              </div>
            </div>

            {/* Description */}
            <div className="pt-4 border-t border-zinc-800/80 space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Descripción Olfativa
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal">
                {product.description}
              </p>
            </div>

            {/* Interactive Olfactory Pyramid (Modular) */}
            <ProductOlfactoryPyramid pyramid={product.pyramid} />
          </div>
        </div>

        {/* Customer Reviews & Star Rating Section (Modular) */}
        <ProductReviewsSection
          reviews={reviewsList}
          onOpenWriteReview={() => setShowReviewModal(true)}
        />

        {/* Related Fragrances Section (Modular) */}
        <ProductRelatedSection products={relatedProducts} />

        {/* Modales Modulares del Producto */}
        <ShareProductModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          product={product}
          selectedVariant={selectedVariant}
          shareUrl={getProductShareUrl()}
        />

        <WriteReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          product={product}
          onSubmitReview={(newRev) => setReviewsList([newRev, ...reviewsList])}
        />

        <DecantGuideModal
          isOpen={showDecantGuide}
          onClose={() => setShowDecantGuide(false)}
        />
      </div>
    </div>
  );
}
