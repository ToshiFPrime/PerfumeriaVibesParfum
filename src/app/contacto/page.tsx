"use client";

import React, { useState } from "react";
import {
  Phone,
  MessageCircle,
  Send,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  QrCode,
  Loader2,
} from "lucide-react";
import { WHATSAPP_NUMBERS, SOCIAL_LINKS } from "@/lib/utils";
import { contactFormSchema } from "@/lib/validation/schemas";

function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function ContactoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Anti-spam
    setErrors({});

    const result = contactFormSchema.safeParse({
      name,
      email: email || undefined,
      phone,
      subject,
      message,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });

      if (!res.ok) throw new Error("Error en el servidor al enviar mensaje");

      setIsSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch {
      setErrors({ form: "No se pudo enviar el formulario. Por favor contáctanos por WhatsApp." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">
      {/* Top Banner */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Atención Personalizada en Todo Momento</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Canales de Contacto & <span className="font-serif italic text-metallic">Redes Sociales</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            ¿Tienes dudas sobre un perfume, una recomendación según tu piel o una cotización de envío? Nuestro equipo te responderá de inmediato.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Official Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* WhatsApp Línea 1 */}
          <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Línea WhatsApp 1</h3>
                <p className="text-xs text-zinc-400">Atención de Pedidos & Stock</p>
                <p className="text-lg font-mono font-bold text-emerald-400 mt-1">
                  {WHATSAPP_NUMBERS.primary.label}
                </p>
              </div>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBERS.primary.full}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Abrir WhatsApp</span>
            </a>
          </div>

          {/* WhatsApp Línea 2 */}
          <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between space-y-4 hover:border-emerald-500/50 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Línea WhatsApp 2</h3>
                <p className="text-xs text-zinc-400">Cotizaciones & Envíos</p>
                <p className="text-lg font-mono font-bold text-emerald-400 mt-1">
                  {WHATSAPP_NUMBERS.secondary.label}
                </p>
              </div>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBERS.secondary.full}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Abrir WhatsApp</span>
            </a>
          </div>

          {/* Instagram */}
          <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between space-y-4 hover:border-pink-500/50 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-950/60 border border-pink-500/40 flex items-center justify-center text-pink-400">
                <InstagramIcon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Instagram Oficial</h3>
                <p className="text-xs text-zinc-400">Historias, unboxings y lanzamientos</p>
                <p className="text-sm font-semibold text-white mt-1">
                  @vibes_parfum
                </p>
              </div>
            </div>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Seguir en Instagram</span>
            </a>
          </div>

          {/* TikTok */}
          <div className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/50 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">TikTok Oficial</h3>
                <p className="text-xs text-zinc-400">Reseñas olfativas en video corto</p>
                <p className="text-sm font-semibold text-white mt-1">
                  @vibes_parfum
                </p>
              </div>
            </div>
            <a
              href={SOCIAL_LINKS.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Ver TikToks</span>
            </a>
          </div>
        </div>

        {/* Contact Form & FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-white">Envíanos un Mensaje</h2>
              <p className="text-xs text-zinc-400">
                Completa el formulario y te responderemos a la brevedad posible.
              </p>
            </div>

            {isSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
                <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">¡Mensaje Enviado con Éxito!</h3>
                <p className="text-xs text-zinc-300 max-w-sm mx-auto">
                  Hemos recibido tu consulta. Si requieres atención inmediata, por favor escríbenos directamente a cualquiera de nuestras líneas oficiales de WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSuccess(false)}
                  className="px-5 py-2 rounded-xl bg-white text-zinc-950 text-xs font-bold"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Nombre Completo *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white"
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Celular / WhatsApp *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej. 76543210"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white"
                    />
                    {errors.phone && (
                      <p className="text-[11px] text-red-400">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Correo Electrónico (Opcional)</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-300">Asunto *</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Ej. Consulta de Decants"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white"
                    />
                    {errors.subject && (
                      <p className="text-[11px] text-red-400">{errors.subject}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-zinc-300">Mensaje *</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe tu consulta detallada..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white resize-none"
                  />
                  {errors.message && (
                    <p className="text-[11px] text-red-400">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-white text-zinc-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95 min-h-[44px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                      <span>Enviando Mensaje Seguro...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-zinc-950" />
                      <span>Enviar Formulario Seguro</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* FAQ (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Preguntas Frecuentes</h3>
              <p className="text-xs text-zinc-400">
                Respuestas inmediatas a las dudas más habituales.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-1.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-zinc-400" />
                  ¿Qué es un decant de perfume?
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Es una porción dosificada directamente del frasco original en un atomizador portátil de vidrio o metal (5ml o 10ml). Permite probar una fragancia de alta gama durante semanas antes de invertir en la botella completa.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-1.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-zinc-400" />
                  ¿Son 100% auténticos los perfumes?
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Sí. En Vibes Parfum no comercializamos copias ni imitaciones. Todos los perfumes y decants proceden de frascos originales con sus códigos de lote correspondientes.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-1.5">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-zinc-400" />
                  ¿Cómo funciona el pago con QR?
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Al completar tu pedido por WhatsApp, nuestro asesor te enviará el código QR Simple (Banco Unión, BCP, BNB, Banco FIE, etc.) con el monto exacto para transferir de manera inmediata y sin comisiones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
