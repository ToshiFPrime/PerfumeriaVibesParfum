"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  PhoneCall,
  Sparkles,
  Truck,
  Lock,
  ExternalLink,
  User,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_NUMBERS } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { itemsCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWhatsAppMenu, setShowWhatsAppMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Catálogo", href: "/catalogo" },
    { name: "Cotizar Envíos", href: "/envios" },
    { name: "Contacto", href: "/contacto" },
    { name: "Admin", href: "/admin" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg p-1"
            >
              <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700/60 shadow-lg group-hover:border-zinc-500 transition-all duration-300">
                <Image
                  src="/images/logo-clean.jpg"
                  alt="Vibes Parfum Logo"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white leading-none group-hover:text-zinc-200 transition-colors">
                  Vibes
                </span>
                <span className="text-[10px] tracking-[0.25em] text-zinc-400 uppercase font-medium">
                  Parfum
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white bg-zinc-800/90 shadow-inner border border-zinc-700/60"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                  }`}
                >
                  {link.name === "Admin" ? (
                    <span className="flex items-center gap-1.5 text-zinc-300 hover:text-white">
                      <Lock className="w-3.5 h-3.5 text-zinc-400" />
                      Admin
                    </span>
                  ) : (
                    link.name
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search */}
            <Link
              href="/catalogo?focus=search"
              aria-label="Buscar perfume"
              className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all duration-200 active:scale-95 cursor-pointer"
              title="Buscar por perfume o marca"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Login / Mi Cuenta Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                aria-label="Mi Cuenta / Iniciar Sesión / Panel Admin"
                className="p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-all duration-200 active:scale-95 cursor-pointer"
                title="Mi Cuenta & Administración"
              >
                <User className="w-5 h-5" />
              </button>

              {showUserMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 glass-dropdown rounded-2xl p-3 shadow-2xl border border-zinc-800 z-30 text-left space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold px-2 py-1">
                      Acceso & Cuenta
                    </p>
                    <Link
                      href="/login"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-zinc-800/80 text-xs font-semibold text-white transition-all"
                    >
                      <User className="w-4 h-4 text-zinc-400" />
                      <span>Iniciar Sesión / Registro</span>
                    </Link>
                    <Link
                      href="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white transition-all border border-zinc-700/60"
                    >
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-emerald-400" />
                        <span>Panel Administrador</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                        Demo
                      </span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* WhatsApp Dropdown / Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowWhatsAppMenu(!showWhatsAppMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/50 hover:border-emerald-400/60 transition-all duration-200 text-xs font-semibold active:scale-95"
                title="Atención directa por WhatsApp"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="hidden sm:inline">WhatsApp</span>
                <PhoneCall className="w-3.5 h-3.5" />
              </button>

              {showWhatsAppMenu && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setShowWhatsAppMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 glass-dropdown rounded-2xl p-3 shadow-2xl border border-zinc-800 z-30 text-left">
                    <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-bold px-2 mb-2">
                      Líneas Oficiales de Pedidos
                    </p>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBERS.primary.full}?text=${encodeURIComponent(
                        "¡Hola Vibes Parfum! Quisiera realizar una consulta sobre sus perfumes y envíos."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-800/80 text-sm text-zinc-200 group transition-all"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          Línea 1 (Principal)
                        </span>
                        <span className="text-xs text-zinc-400">{WHATSAPP_NUMBERS.primary.raw}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    </a>
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBERS.secondary.full}?text=${encodeURIComponent(
                        "¡Hola Vibes Parfum! Quisiera cotizar un perfume con ustedes."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-800/80 text-sm text-zinc-200 group transition-all"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          Línea 2 (Cotizaciones)
                        </span>
                        <span className="text-xs text-zinc-400">{WHATSAPP_NUMBERS.secondary.raw}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all duration-200 active:scale-95"
              aria-label="Abrir carrito de compras"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-zinc-950 font-bold text-[11px] flex items-center justify-center shadow-md animate-scale">
                  {itemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="grid gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  pathname === link.href
                    ? "bg-zinc-800 text-white font-semibold"
                    : "text-zinc-300 hover:bg-zinc-900"
                }`}
              >
                <span>{link.name}</span>
                {link.href === "/catalogo" && <Sparkles className="w-4 h-4 text-zinc-400" />}
                {link.href === "/envios" && <Truck className="w-4 h-4 text-zinc-400" />}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-800/80 grid grid-cols-2 gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-zinc-900 border border-zinc-700/80 text-white text-xs font-bold"
            >
              <User className="w-3.5 h-3.5 text-zinc-300" />
              <span>Mi Cuenta / Login</span>
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-zinc-900 border border-emerald-500/40 text-emerald-400 text-xs font-bold"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Panel Admin</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-zinc-800/80 flex flex-col gap-2">
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-wider px-1">
              Pedidos por WhatsApp
            </p>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBERS.primary.full}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold"
              >
                <span>{WHATSAPP_NUMBERS.primary.raw}</span>
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBERS.secondary.full}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-bold"
              >
                <span>{WHATSAPP_NUMBERS.secondary.raw}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
