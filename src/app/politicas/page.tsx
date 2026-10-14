import React from "react";
import type { Metadata } from "next";
import { ShieldCheck, Truck, Droplets, CreditCard, RotateCcw, MessageCircle, CheckCircle } from "lucide-react";
import { WHATSAPP_NUMBERS } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Políticas de Tienda, Garantías & Autenticidad | Vibes Parfum Bolivia",
  description:
    "Conoce nuestras políticas de autenticidad 100% en decants, envíos asegurados a toda Bolivia, pagos por QR Simple y garantía anti-rotura en Vibes Parfum.",
};

export default function PoliticasPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Encabezado */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-700/60 text-xs font-semibold text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Transparencia & Compromiso de Calidad</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Políticas de Tienda & Garantías
          </h1>
          <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
            En <span className="text-zinc-200 font-semibold">Vibes Parfum Bolivia</span> nos regimos por la máxima transparencia, autenticidad garantizada y cuidado en cada decant y frasco que despachamos a cualquier punto del país.
          </p>
        </div>

        {/* 1. Autenticidad y Decants */}
        <section id="autenticidad" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700 text-amber-300">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                1. Política de Autenticidad 100% y Decants
              </h2>
              <p className="text-xs text-zinc-400">Garantía de procedencia legítima sin alteraciones ni dilución</p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Todos los frascos completos comercializados en <strong className="text-white">Vibes Parfum</strong> son 100% originales con código de lote (Batch Code) verificable, adquiridos directamente de importadores oficiales de marcas árabes (Lattafa, Armaf, Afnan, Rasasi) y casas de alta perfumería de diseñador y nicho (Jean Paul Gaultier, Valentino, Creed, MFK).
            </p>
            <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-2">
              <p className="font-semibold text-zinc-200 text-xs uppercase tracking-wider">
                ¿Cómo preparamos nuestros Decants (5ml y 10ml)?
              </p>
              <ul className="space-y-1.5 text-xs text-zinc-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Extracción pura sin dilución:</strong> La fragancia se extrae directamente de la botella original mediante jeringa graduada estéril de uso exclusivo para cada perfume.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Atomizadores de vidrio reforzado:</strong> Usamos envases de vidrio de grado cosmético con atomizador metálico de micro-pulverización que no altera el jugo olfativo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Sellado anti-evaporación:</strong> Cada atomizador cuenta con sellado teflonado en la rosca para garantizar que llegue intacto a cualquier altitud o clima de Bolivia.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. Envíos y Despacho */}
        <section id="envios" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700 text-emerald-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                2. Despacho Nacional & Tiempos de Entrega
              </h2>
              <p className="text-xs text-zinc-400">Cobertura en los 9 departamentos de Bolivia</p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Realizamos envíos diarios a La Paz, El Alto, Cochabamba, Santa Cruz, Oruro, Potosí, Chuquisaca (Sucre), Tarija, Beni y Pando.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <span className="font-bold text-white block mb-1">La Paz & El Alto (Local):</span>
                <span className="text-zinc-400">Entregas en el mismo día o 24 horas hábiles mediante mensajero privado con opción de pago contra entrega en puntos coordinados.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                <span className="font-bold text-white block mb-1">Interdepartamental (Interior del país):</span>
                <span className="text-zinc-400">Despachos por encomienda asegurada en flota / bus expreso a terminal o courier terrestre a domicilio (24 a 48 horas hábiles).</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Garantía Anti-Rotura */}
        <section id="garantia-rotura" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                3. Garantía Anti-Rotura y Seguro de Transporte
              </h2>
              <p className="text-xs text-zinc-400">Tu dinero y fragancias siempre protegidos</p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Sabemos el valor de un perfume fino. Cada frasco y decant se embala individualmente con <strong>triple capa de plástico de burbujas térmicas</strong>, caja rígida exterior y precinto de seguridad.
            </p>
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs leading-relaxed">
              <strong className="block text-emerald-100 font-semibold mb-1">
                Garantía de reposición inmediata:
              </strong>
              Si por causas de la empresa de transporte tu paquete llegara quebrado o con derrame, te reponemos el producto o te devolvemos el monto equivalente en menos de 24 horas hábiles. Solo solicitamos grabar un breve video continuo al momento de abrir el empaque por primera vez.
            </div>
          </div>
        </section>

        {/* 4. Métodos de Pago en Bolivia */}
        <section id="pagos" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700 text-yellow-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                4. Métodos de Pago Habilitados
              </h2>
              <p className="text-xs text-zinc-400">Pagos instantáneos sin comisiones bancarias</p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Aceptamos los principales métodos de pago del sistema financiero boliviano:
            </p>
            <ul className="space-y-1.5 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Pago con QR Simple:</strong> Escaneo directo desde cualquier app bancaria de Bolivia (BCP, BNB, Banco Unión, Banco Mercantil Santa Cruz, Banco Ganadero, Banco FIE, Banco Sol).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Transferencia bancaria directa:</strong> Cuentas corrientes y cajas de ahorro a nombre de la empresa.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Efectivo contra entrega:</strong> Disponible únicamente para entregas coordinadas en La Paz y El Alto.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 5. Cambios y Devoluciones */}
        <section id="devoluciones" className="p-6 sm:p-8 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center border border-zinc-700 text-purple-400">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                5. Cambios, Cancelaciones y Normativa Cosmética
              </h2>
              <p className="text-xs text-zinc-400">Seguridad sanitaria e higiene</p>
            </div>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <p>
              Por estrictas normas sanitarias y de bioseguridad en el rubro cosmético y de perfumería fina, <strong>no se aceptan devoluciones de frascos desprecintados o decants atomizados</strong> por motivos de preferencia olfativa subjetiva.
            </p>
            <p className="text-xs text-zinc-400">
              Recomendamos a todos nuestros clientes adquirir primero un decant de 5ml o 10ml para probar el aroma en su piel y verificar su evolución y rendimiento antes de comprar la botella completa de 100ml.
            </p>
          </div>
        </section>

        {/* Canales de Asesoría Directa */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-900/80 border border-zinc-800 text-center space-y-4">
          <h3 className="font-serif text-lg font-bold text-white">
            ¿Tienes alguna consulta especial sobre tu pedido?
          </h3>
          <p className="text-xs text-zinc-400 max-w-lg mx-auto">
            Nuestros asesores de perfumería atienden de forma personalizada en nuestras dos líneas oficiales de WhatsApp.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBERS.primary.full}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Línea 1: 65947174</span>
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBERS.secondary.full}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center gap-2 transition-all border border-zinc-700"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Línea 2: 65867500</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
