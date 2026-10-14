"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Truck } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  name: string;
  isOnSale?: boolean;
  discountPercent?: number;
}

export function ProductGallery({
  images,
  name,
  isOnSale,
  discountPercent,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string>(images[0] || "");

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl">
        {selectedImage && (
          <Image
            src={selectedImage}
            alt={name}
            fill
            className="object-cover object-center transition-all duration-500"
            priority
          />
        )}
        {isOnSale && (
          <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            Descuento {discountPercent ? `-${discountPercent}%` : ""}
          </span>
        )}
      </div>

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedImage(img)}
              className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                selectedImage === img
                  ? "border-white shadow-lg scale-105"
                  : "border-zinc-800 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${name} miniatura ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Tarjetas de Confianza y Garantía */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-zinc-300 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-white">100% Auténtico</p>
            <p className="text-[11px] text-zinc-400">Lote verificado de importación</p>
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 flex items-center gap-3">
          <Truck className="w-5 h-5 text-zinc-300 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-white">Despacho Inmediato</p>
            <p className="text-[11px] text-zinc-400">Embalaje reforzado a toda Bolivia</p>
          </div>
        </div>
      </div>
    </div>
  );
}
