import React from "react";
import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import type { Product } from "@/types";

interface BestSellersSectionProps {
  products: Product[];
}

export function BestSellersSection({ products }: BestSellersSectionProps) {
  return (
    <section className="py-14 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Los Más Codiciados</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Fragancias <span className="font-serif italic text-metallic">Más Vendidas</span>
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
            Selección de los perfumes que marcan tendencia por su proyección extraordinaria, fijación y elogios garantizados.
          </p>
        </div>

        <Link
          href="/catalogo"
          className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-white border border-zinc-800 transition-all self-start md:self-auto active:scale-95"
        >
          <span>Ver Todo el Catálogo</span>
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
