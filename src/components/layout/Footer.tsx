"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  Truck,
  Phone,
} from "lucide-react";
import { WHATSAPP_NUMBERS, SOCIAL_LINKS } from "@/lib/utils";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/80 text-zinc-400 text-sm">
      {/* CIA Security and Trust Pillars */}
      <div className="border-b border-zinc-800/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="p-3 rounded-xl bg-zinc-800 text-white shrink-0">
              <ShieldCheck className="w-6 h-6 text-zinc-200" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base mb-1">
                Autenticidad 100% Garantizada
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Todas nuestras botellas completas y decants proceden directamente de distribuidores autorizados. Cada gota es pura, sin adulteraciones.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="p-3 rounded-xl bg-zinc-800 text-white shrink-0">
              <Truck className="w-6 h-6 text-zinc-200" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base mb-1">
                Envíos Protegidos a Toda Bolivia
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Despachos diarios a La Paz, Santa Cruz, Cochabamba y todos los departamentos con embalaje de alta seguridad anti-impacto.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="p-3 rounded-xl bg-zinc-800 text-white shrink-0">
              <Lock className="w-6 h-6 text-zinc-200" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base mb-1">
                Compra Protegida & Privacidad
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tus pedidos y pagos por QR están 100% protegidos con atención directa personalizada y empaque sellado de fábrica.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Presentation */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700/60 shadow-lg">
                <Image
                  src="/images/logo-clean.jpg"
                  alt="Vibes Parfum"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white leading-none">
                  Vibes
                </span>
                <span className="text-[10px] tracking-[0.25em] text-zinc-400 uppercase font-medium">
                  Parfum
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed pr-6">
              Tu destino de perfumería exclusiva y decants de autor. Experimenta las fragancias más prestigiosas del mundo en presentaciones de 5ml, 10ml o frasco completo sin pagar de más.
            </p>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-medium"
              >
                <InstagramIcon className="w-4 h-4 text-pink-400" />
                <span>@vibes_parfum</span>
              </a>

              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-medium"
              >
                <svg className="w-4 h-4 fill-current text-cyan-400" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
                <span>TikTok</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-white transition-colors">
                  Catálogo Completo
                </Link>
              </li>
              <li>
                <Link href="/catalogo?genero=Hombre" className="hover:text-white transition-colors">
                  Perfumes Hombre
                </Link>
              </li>
              <li>
                <Link href="/catalogo?genero=Mujer" className="hover:text-white transition-colors">
                  Perfumes Mujer
                </Link>
              </li>
              <li>
                <Link href="/catalogo?genero=Unisex" className="hover:text-white transition-colors">
                  Colección Unisex / Nicho
                </Link>
              </li>
              <li>
                <Link href="/catalogo?ofertas=true" className="text-zinc-200 font-semibold hover:text-white transition-colors">
                  Promociones & Descuentos
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Servicio al Cliente
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/envios" className="hover:text-white transition-colors">
                  Cotizador de Envíos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="hover:text-white transition-colors">
                  ¿Cómo comprar por WhatsApp?
                </Link>
              </li>
              <li>
                <Link href="/politicas" className="text-amber-400/90 hover:text-amber-300 font-semibold transition-colors">
                  Políticas, Autenticidad & Garantías
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-zinc-500 hover:text-zinc-300 transition-colors">
                  Acceso Administrativo
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp Ordering */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Atención & Envíos
            </h4>
            <p className="text-xs text-zinc-400">
              Escríbenos para asesoría olfativa personalizada o dudas de tu pedido:
            </p>
            <div className="space-y-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBERS.primary.full}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-emerald-400 hover:border-emerald-500/50 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{WHATSAPP_NUMBERS.primary.label}</span>
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBERS.secondary.full}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-emerald-400 hover:border-emerald-500/50 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{WHATSAPP_NUMBERS.secondary.label}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Developer Credits & Copyright */}
        <div className="mt-14 pt-8 border-t border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-zinc-400">
            <span>© {new Date().getFullYear()} Vibes Parfum. Todos los derechos reservados.</span>
          </div>

          {/* Luxury Developer Credit Card */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-zinc-400 bg-zinc-900/90 border border-zinc-800/90 px-3.5 py-1.5 rounded-2xl shadow-lg">
            <span className="text-zinc-400 text-[11px] font-medium">
              Desarrollado por
            </span>

            {/* GitHub Profile */}
            <a
              href="https://github.com/ToshiFPrime"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-800/90 hover:bg-zinc-700/90 border border-zinc-700/70 text-white font-bold text-xs transition-all hover:scale-105 active:scale-95 group shadow-sm"
              title="GitHub: ToshiFPrime"
            >
              <svg
                className="w-3.5 h-3.5 fill-current text-zinc-300 group-hover:text-white transition-colors"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>ToshiFPrime</span>
            </a>

            {/* Direct WhatsApp Contact */}
            <a
              href="https://wa.me/59177072603?text=Hola%20ToshiFPrime,%20vi%20tu%20desarrollo%20en%20Vibes%20Parfum!"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/70 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-all hover:scale-105 active:scale-95 group shadow-sm"
              title="WhatsApp de Contacto: 77072603"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>77072603</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
