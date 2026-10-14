"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Tag, ArrowRight, Check, Copy } from "lucide-react";

export function PromoBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText("VIBES10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="border-b border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900 py-4 sm:py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs sm:text-sm font-bold text-white">
                Cupón de Bienvenida:
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                title="Copiar cupón de descuento"
                className="group inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm text-emerald-400 bg-emerald-950/70 hover:bg-emerald-900/80 px-2.5 py-1 rounded-lg border border-emerald-500/40 transition-all cursor-pointer active:scale-95"
              >
                <span>VIBES10</span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-emerald-500 group-hover:text-emerald-300 transition-colors" />
                )}
                {copied && <span className="text-[10px] text-emerald-300">¡Copiado!</span>}
              </button>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-400 mt-1">
              Aplica 10% de descuento automático en cualquier perfume o decant de tu pedido.
            </p>
          </div>
        </div>

        <Link
          href="/catalogo?ofertas=true"
          className="min-h-[44px] px-5 py-2.5 rounded-full bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 shadow-md"
        >
          <span>Ver Ofertas Activas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
