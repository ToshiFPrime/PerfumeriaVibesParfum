import React from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductRelatedSectionProps {
  products: Product[];
}

export function ProductRelatedSection({ products }: ProductRelatedSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-20 pt-12 border-t border-zinc-800/80 space-y-6">
      <div>
        <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
          Fragancias Afines
        </span>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Podrían gustarte también
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.slice(0, 3).map((rel) => (
          <Link
            key={rel.id}
            href={`/producto/${rel.slug}`}
            className="group p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-600 transition-all flex gap-4 items-center active:scale-[0.99]"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-700/60">
              <Image
                src={rel.images[0] || ""}
                alt={rel.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase font-bold text-zinc-400 truncate">
                {rel.brand}
              </p>
              <h4 className="text-sm font-bold text-white truncate group-hover:text-zinc-200 transition-colors">
                {rel.name}
              </h4>
              <p className="text-xs font-bold text-emerald-400 mt-1">
                Desde {formatPrice(rel.variants[0].price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
