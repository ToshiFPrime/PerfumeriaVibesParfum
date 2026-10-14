"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Share2, PhoneCall, Copy, Check, ExternalLink, Image as ImageIcon } from "lucide-react";
import { BaseModal } from "@/components/common/BaseModal";
import { formatPrice, WHATSAPP_NUMBERS } from "@/lib/utils";
import type { Product, ProductVariant } from "@/types";

export interface ShareProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedVariant: ProductVariant;
  shareUrl: string;
}

export function ShareProductModal({
  isOpen,
  onClose,
  product,
  selectedVariant,
  shareUrl,
}: ShareProductModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPhotoMessage, setCopiedPhotoMessage] = useState(false);

  if (!isOpen) return null;

  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "https://perfumeria-vibes-parfum.vercel.app";
  const primaryImage = product.images[0] || "/images/logo-clean.jpg";
  const fullImageUrl = primaryImage.startsWith("http") ? primaryImage : `${siteUrl}${primaryImage}`;

  const handleShareWhatsApp = () => {
    const rawText =
      `✨ *${product.name}* — ${product.brand}\n` +
      `Presentación: *${selectedVariant.label}*\n` +
      `Precio: *${formatPrice(selectedVariant.price)}*\n` +
      `Familia: ${product.olfactoryFamily} • ${product.concentration}\n\n` +
      `📷 *Foto Oficial del Perfume:* ${fullImageUrl}\n` +
      `🔗 *Enlace con Vista Previa:* ${shareUrl}\n\n` +
      `🚚 Envíos asegurados a toda Bolivia por Vibes Parfum ✨`;

    const cleanNumber = WHATSAPP_NUMBERS.primary.raw.replace(/[^0-9]/g, "");
    const waNumber = cleanNumber.startsWith("591") ? cleanNumber : `591${cleanNumber}`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(rawText)}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} - ${product.brand} | Vibes Parfum`,
          text: `Mira ${product.name} (${selectedVariant.label} - ${formatPrice(selectedVariant.price)}) en Vibes Parfum Bolivia:`,
          url: shareUrl,
        });
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyPhotoMessage = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      const fullText =
        `✨ *${product.name}* (${product.brand})\n` +
        `${selectedVariant.label} — ${formatPrice(selectedVariant.price)}\n\n` +
        `📷 Foto del Producto:\n${fullImageUrl}\n\n` +
        `🔗 Comprar en línea:\n${shareUrl}`;
      navigator.clipboard.writeText(fullText);
      setCopiedPhotoMessage(true);
      setTimeout(() => setCopiedPhotoMessage(false), 2500);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Compartir Fragancia con Foto"
      subtitle="Genera un enlace personalizado que incluye foto de alta resolución y vista previa interactiva"
      icon={<Share2 className="w-5 h-5 text-emerald-400" />}
      maxWidth="md"
    >
      <div className="space-y-4 pt-1">
        {/* Tarjeta de Vista Previa Visual del Enlace */}
        <div className="rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl space-y-0">
          <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900/90 border-b border-zinc-800 text-[10px] text-zinc-400 font-medium">
            <span className="flex items-center gap-1.5 text-zinc-300 font-bold">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              Vista Previa con Foto (WhatsApp & Redes)
            </span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              og:image HD
            </span>
          </div>

          <div className="relative aspect-video w-full bg-zinc-950 group">
            {product.images[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/25 to-transparent" />
            
            <div className="absolute top-3 right-3">
              <a
                href={fullImageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 text-[10px] text-white flex items-center gap-1 hover:bg-black/80 transition-colors"
                title="Abrir foto en tamaño completo"
              >
                <span>Ver Foto HD</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="absolute bottom-3 left-3 right-3">
              <span className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                {product.brand}
              </span>
              <p className="text-base font-bold text-white leading-tight">
                {product.name}
              </p>
              <p className="text-xs text-zinc-300 mt-0.5">
                {selectedVariant.label} • <strong className="text-white font-mono">{formatPrice(selectedVariant.price)}</strong>
              </p>
            </div>
          </div>

          <div className="p-3.5 space-y-1 bg-zinc-900/90 text-xs border-t border-zinc-800/80">
            <p className="text-zinc-400 font-mono text-[11px] truncate">
              {shareUrl}
            </p>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
              ✓ Incluye foto del frasco, precio oficial y cotización para Bolivia
            </p>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="space-y-2 pt-1">
          {/* WhatsApp con Foto y Enlace */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Compartir por WhatsApp (con Foto & Enlace)</span>
          </button>

          {/* Copiar Mensaje Completo con Enlace a Foto */}
          <button
            type="button"
            onClick={handleCopyPhotoMessage}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-200 hover:text-white border border-zinc-700/80 text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            {copiedPhotoMessage ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-bold">¡Texto y Enlace de Foto Copiados!</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-4 h-4 text-zinc-400" />
                <span>Copiar Mensaje Completo (con Foto Directa)</span>
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleNativeShare}
              className="min-h-[44px] py-2.5 px-3 rounded-xl bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-zinc-400" />
              <span>Redes Sociales</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className={`min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all active:scale-[0.98] cursor-pointer ${
                copiedLink
                  ? "bg-white text-zinc-950 border-white font-extrabold"
                  : "bg-zinc-900/70 hover:bg-zinc-800 text-zinc-300 border-zinc-800"
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400" />
                  <span>Copiar Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
