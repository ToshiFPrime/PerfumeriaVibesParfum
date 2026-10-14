import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

interface NicheCollectionSectionProps {
  products: Product[];
}

export function NicheCollectionSection({ products }: NicheCollectionSectionProps) {
  return (
    <section className="py-14 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-zinc-200" />
            <span>Piezas Maestras de Autor</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Colección Nicho <span className="font-serif italic text-metallic">& Lujo Extremo</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
            Concentraciones Extrait de Parfum y materias primas excepcionales para narices exigentes.
          </p>
        </div>

        <Link
          href="/catalogo?familia=Oriental%20%2F%20%C3%81mbar"
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-800 transition-all self-start md:self-auto active:scale-95"
        >
          <span>Explorar Nicho</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
