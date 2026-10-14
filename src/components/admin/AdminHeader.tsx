"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import { logoutAdminAction } from "@/actions/auth";
import { LogOut } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-xl py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-700 shadow-xl shrink-0">
            <Image src="/images/logo-clean.jpg" alt="Vibes Parfum" fill className="object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Panel de Administración
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 text-[11px] font-bold">
                Boutique Activa
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Gestión comercial de Vibes Parfum Bolivia • Catálogo, Pedidos WhatsApp, Finanzas y Cobros QR
            </p>
            <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1.5 flex-wrap">
              <span>Ingeniería de Software:</span>
              <a
                href="https://github.com/ToshiFPrime"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white font-medium underline underline-offset-2 transition-colors"
              >
                ToshiFPrime (GitHub)
              </a>
              <span>•</span>
              <a
                href="https://wa.me/59177072603"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              >
                WhatsApp: 77072603
              </a>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-xs font-semibold text-white transition-all hover:bg-zinc-800"
          >
            ← Volver a la Tienda
          </Link>
          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="px-3.5 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 hover:border-red-400 text-xs font-medium text-red-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
