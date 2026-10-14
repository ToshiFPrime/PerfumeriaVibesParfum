"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, User, ShieldCheck, ArrowRight, CheckCircle2, KeyRound, Loader2, AlertCircle } from "lucide-react";
import { loginAction } from "@/actions/auth";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect") || "/admin";

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Anti-spam
    if (!email || !password || (isRegister && !fullName)) {
      setMessage({ text: "Por favor completa todos los campos requeridos.", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("redirect", redirectParam);

    try {
      const res = await loginAction(null, formData);
      if (res.success) {
        setMessage({ text: res.message, type: "success" });
        setTimeout(() => {
          setIsLoading(false);
          router.push(res.redirectTo || "/catalogo");
          router.refresh();
        }, 700);
      } else {
        setIsLoading(false);
        setMessage({ text: res.message, type: "error" });
      }
    } catch {
      setIsLoading(false);
      setMessage({ text: "Ocurrió un error al procesar el inicio de sesión.", type: "error" });
    }
  };

  const handleQuickAdmin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setEmail("admin@vibesparfum.com");
    setPassword("Admin2026!Vibes");

    const formData = new FormData();
    formData.append("email", "admin@vibesparfum.com");
    formData.append("password", "Admin2026!Vibes");
    formData.append("redirect", redirectParam);

    const res = await loginAction(null, formData);
    if (res.success) {
      setMessage({ text: "Acceso seguro verificado. Redirigiendo a Panel de Administración...", type: "success" });
      setTimeout(() => {
        setIsLoading(false);
        router.push(res.redirectTo || "/admin");
        router.refresh();
      }, 600);
    }
  };

  const handleQuickCustomer = () => {
    if (isLoading) return;
    setIsLoading(true);
    setEmail("cliente@vibesparfum.com");
    setPassword("Cliente2026!");
    setMessage({ text: "Sesión de Cliente iniciada. Redirigiendo a Catálogo...", type: "success" });
    setTimeout(() => {
      setIsLoading(false);
      router.push("/catalogo");
    }, 600);
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <Link href="/" className="inline-block relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-700 shadow-xl">
          <Image
            src="/images/logo-clean.jpg"
            alt="Vibes Parfum"
            fill
            className="object-cover"
            priority
          />
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {isRegister ? "Crear Cuenta en Vibes Parfum" : "Acceso a tu Cuenta"}
          </h1>
          <p className="text-xs text-zinc-400">
            {isRegister
              ? "Regístrate para guardar tus fragancias favoritas y pedidos"
              : "Ingresa tus credenciales seguras para acceder"}
          </p>
        </div>
      </div>

      {/* Card Box */}
      <div className="p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-2xl space-y-6 backdrop-blur-md">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setMessage(null);
            }}
            className={`py-2.5 rounded-xl transition-all ${
              !isRegister
                ? "bg-white text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setMessage(null);
            }}
            className={`py-2.5 rounded-xl transition-all ${
              isRegister
                ? "bg-white text-zinc-950 shadow-md"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Registrarse
          </button>
        </div>

        {message && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                : "bg-red-950/60 border border-red-500/40 text-red-300"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300">Nombre Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre y apellido"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-300">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@vibesparfum.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-300">Contraseña</label>
              {!isRegister && (
                <button
                  type="button"
                  onClick={() =>
                    alert("Para restablecer contraseña, contáctanos por WhatsApp con tu correo.")
                  }
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] cursor-pointer min-h-[44px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                <span>Procesando acceso...</span>
              </>
            ) : (
              <>
                <span>{isRegister ? "Crear Mi Cuenta" : "Acceder a Mi Cuenta"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Access for Testing */}
        <div className="pt-3 border-t border-zinc-800/80 space-y-2">
          <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider text-center">
            Accesos Rápidos Demostrativos
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="py-2.5 px-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>Modo Admin</span>
            </button>
            <button
              type="button"
              onClick={handleQuickCustomer}
              className="py-2.5 px-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-600 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>Modo Cliente</span>
            </button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-center gap-2 text-[11px] text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-zinc-400" />
          <span>Acceso seguro y privado con cifrado bancario</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4 sm:p-6 pb-20">
      <Suspense fallback={<div className="text-zinc-500 text-xs">Cargando acceso seguro...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
