"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, PhoneCall } from "lucide-react";
import { WHATSAPP_NUMBERS } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-zinc-800/80">
      {/* Background ambient lighting effects (taste-ui) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-zinc-800/20 via-zinc-900/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-24 right-10 w-96 h-96 bg-zinc-800/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold shadow-inner">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Alta Perfumería & Decants de Autor en Bolivia</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              El arte de una <span className="text-metallic font-serif italic">estela inolvidable</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Accede a las firmas más exclusivas del mundo. Descubre aromas de nicho y diseñador en decants dosificados de <strong className="text-white">5ml y 10ml</strong> para probarlos en tu piel, o adquiere tu frasco completo con garantía de autenticidad absoluta.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/catalogo"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-zinc-200 active:scale-[0.98] text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-2xl transition-all duration-200"
              >
                <span>Explorar Colección</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBERS.primary.full}?text=${encodeURIComponent(
                  "¡Hola Vibes Parfum! Quisiera asesoría olfativa para elegir mi perfume ideal."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] border border-zinc-700/70 text-white font-semibold text-sm flex items-center justify-center gap-2.5 transition-all duration-200"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Asesoría por WhatsApp</span>
                <PhoneCall className="w-4 h-4 text-emerald-400" />
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-zinc-800/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="space-y-0.5">
                <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">100%</p>
                <p className="text-[11px] text-zinc-400">Fragancias Originales</p>
              </div>
              <div className="space-y-0.5 border-l border-zinc-800 pl-4">
                <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">9 Deptos</p>
                <p className="text-[11px] text-zinc-400">Envíos a Toda Bolivia</p>
              </div>
              <div className="space-y-0.5 border-l border-zinc-800 pl-4">
                <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">Desde Bs. 45</p>
                <p className="text-[11px] text-zinc-400">Decants en Vidrio/Metal</p>
              </div>
            </div>
          </div>

          {/* Visual Showcase: Logo and Featured Fragrance Bottle */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Outer Glow Halo */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-zinc-700/30 to-zinc-500/10 blur-xl opacity-80" />

              {/* Card Container */}
              <div className="relative rounded-3xl bg-zinc-900/90 border border-zinc-700/60 p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/80 border border-zinc-800 shadow-inner group">
                  <Image
                    src="/images/logo-clean.jpg"
                    alt="Vibes Parfum - Perfumería Exclusiva"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* WhatsApp Quick Link over Card */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-zinc-950/90 backdrop-blur-md p-3 rounded-2xl border border-zinc-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                          Cotizaciones Inmediatas
                        </p>
                        <p className="text-xs font-bold text-white font-mono">
                          {WHATSAPP_NUMBERS.primary.raw} / {WHATSAPP_NUMBERS.secondary.raw}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBERS.primary.full}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shrink-0"
                    >
                      Pedir
                    </a>
                  </div>
                </div>

                {/* Micro Guarantee Tag */}
                <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 px-1">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-zinc-200" />
                    Decants sellados con teflón de perfumería
                  </span>
                  <span className="text-zinc-500 font-mono text-[11px]">
                    Envío 24-48h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
