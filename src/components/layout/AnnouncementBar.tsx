"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Truck, ShieldCheck, MessageCircle, ArrowRight } from "lucide-react";
import { WHATSAPP_NUMBERS } from "@/lib/utils";

const announcements = [
  {
    icon: Truck,
    text: "Envíos asegurados a toda Bolivia (La Paz, Santa Cruz, Cochabamba y departamentos)",
    action: "Cotizar envío",
    href: "/envios",
  },
  {
    icon: Sparkles,
    text: "Usa el cupón VIBES10 y obtén 10% OFF en tu primera compra de Decants o Frascos",
    action: "Ver catálogo",
    href: "/catalogo",
  },
  {
    icon: ShieldCheck,
    text: "100% Fragancias Originales y Decants dosificados en atomizadores premium de vidrio/metal",
    action: "Saber más",
    href: "/catalogo",
  },
  {
    icon: MessageCircle,
    text: `Atención y pedidos inmediatos por WhatsApp: ${WHATSAPP_NUMBERS.primary.raw} / ${WHATSAPP_NUMBERS.secondary.raw}`,
    action: "Chatear",
    href: "/contacto",
  },
];

export function AnnouncementBar() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const item = announcements[current];
  const Icon = item.icon;

  return (
    <aside aria-label="Anuncios y promociones" className="bg-zinc-950 border-b border-zinc-800/80 text-zinc-300 text-xs py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0 overflow-hidden text-center sm:text-left">
          <Icon className="w-3.5 h-3.5 text-zinc-100 shrink-0 animate-pulse" />
          <span className="font-medium tracking-wide text-zinc-200 truncate">
            {item.text}
          </span>
          <Link
            href={item.href}
            className="hidden md:inline-flex items-center gap-1 text-white font-semibold underline underline-offset-4 hover:text-zinc-300 transition-colors ml-2"
          >
            {item.action}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-zinc-400 text-xs shrink-0">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            WhatsApp Activo
          </span>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBERS.primary.full}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            {WHATSAPP_NUMBERS.primary.raw}
          </a>
          <span className="text-zinc-600">|</span>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBERS.secondary.full}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            {WHATSAPP_NUMBERS.secondary.raw}
          </a>
        </div>
      </div>
    </aside>
  );
}
