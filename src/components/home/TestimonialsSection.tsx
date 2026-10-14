import React from "react";
import Link from "next/link";
import { Star, BadgeCheck } from "lucide-react";

interface TestimonialItem {
  author: string;
  city: string;
  perfume: string;
  comment: string;
  slug: string;
}

const FEATURED_TESTIMONIALS: TestimonialItem[] = [
  {
    author: "Luciana R.",
    city: "Santa Cruz de la Sierra",
    perfume: "Odyssey Marshmallow (Armaf)",
    comment:
      "Adictivo totalmente. Huele a malvavisco dulce sin empalagar. Me pedí primero el decant de 10ml y luego el frasco entero. Llegó a Equipetrol en menos de 24h.",
    slug: "odyssey-marshmallow",
  },
  {
    author: "Daniela F.",
    city: "La Paz (Sopocachi)",
    perfume: "Eclaire (Lattafa)",
    comment:
      "El mejor dupe de Bianco Latte en Bolivia. Dura todo el día en piel y días en la bufanda. El atomizador de metal es finísimo y la atención por WhatsApp fue 10/10.",
    slug: "eclaire",
  },
  {
    author: "Mateo K.",
    city: "Cochabamba (Cercado)",
    perfume: "9 PM (Afnan)",
    comment:
      "Es idéntico a Ultra Male pero dura mucho más. Para salir de noche es un espectáculo de cumplidos garantizados. Fragancia 100% original comprobada.",
    slug: "afnan-9-pm",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-20 bg-zinc-950 border-t border-zinc-800/80 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Experiencias Reales de Clientes</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Testimonios <span className="font-serif italic text-metallic">Verificados</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Descubre por qué compradores de toda Bolivia eligen y recomiendan nuestros decants y perfumes originales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURED_TESTIMONIALS.map((t) => (
            <div
              key={t.author}
              className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-800 space-y-4 hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Compra Verificada
                  </span>
                </div>

                <blockquote className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                  &ldquo;{t.comment}&rdquo;
                </blockquote>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white">{t.author}</p>
                  <p className="text-[11px] text-zinc-500">📍 {t.city}</p>
                </div>
                <Link
                  href={`/producto/${t.slug}`}
                  className="min-h-[36px] inline-flex items-center text-[10px] font-bold px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors active:scale-95"
                >
                  Ver Perfume →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
