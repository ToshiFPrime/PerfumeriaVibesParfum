import React from "react";
import { Star, BadgeCheck } from "lucide-react";
import type { Review } from "@/types";

interface ProductReviewsSectionProps {
  reviews: Review[];
  onOpenWriteReview: () => void;
}

export function ProductReviewsSection({
  reviews,
  onOpenWriteReview,
}: ProductReviewsSectionProps) {
  return (
    <section className="mt-16 pt-12 border-t border-zinc-800/80 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-zinc-400 font-bold">
            Experiencias de Clientes
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Reseñas y Opiniones ({reviews.length})
          </h2>
        </div>

        <button
          type="button"
          onClick={onOpenWriteReview}
          className="min-h-[44px] px-5 py-2.5 rounded-full bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-all self-start sm:self-auto cursor-pointer active:scale-95 shadow-md flex items-center justify-center"
        >
          Escribir una Reseña
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="p-8 rounded-2xl bg-zinc-900/30 border border-zinc-800 text-center space-y-2">
          <p className="text-sm font-semibold text-white">Sé el primero en dejar tu opinión</p>
          <p className="text-xs text-zinc-400">
            Comparte tu experiencia con la duración, estela y ocasiones de uso de este perfume.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{rev.authorName}</span>
                  {rev.isVerifiedPurchase && (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <BadgeCheck className="w-3 h-3" />
                      Comprador Verificado
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-zinc-500">{rev.date}</span>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating ? "fill-white text-white" : "text-zinc-700"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                &ldquo;{rev.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
