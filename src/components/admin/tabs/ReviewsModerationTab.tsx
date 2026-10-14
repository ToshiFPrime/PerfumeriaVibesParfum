"use client";

import React from "react";
import { Star, Plus, Check, Trash2 } from "lucide-react";
import type { AdminReview } from "@/types/admin";

interface ReviewsModerationTabProps {
  reviews: AdminReview[];
  reviewFilter: "all" | "approved" | "pending" | "hidden";
  onReviewFilterChange: (filter: "all" | "approved" | "pending" | "hidden") => void;
  onToggleVerified: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onToggleReviewStatus: (id: string, newStatus: "approved" | "pending" | "hidden") => void;
  onDeleteReview: (id: string) => void;
  onOpenAddReview: () => void;
}

export function ReviewsModerationTab({
  reviews,
  reviewFilter,
  onReviewFilterChange,
  onToggleVerified,
  onToggleFeatured,
  onToggleReviewStatus,
  onDeleteReview,
  onOpenAddReview,
}: ReviewsModerationTabProps) {
  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === "all") return true;
    return r.status === reviewFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            Moderación de Reseñas & Testimonios de Clientes
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Revisa opiniones de compradores, valida compras reales y destaca testimonios en la portada para generar confianza inmediata.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
            {[
              { id: "all", label: "Todas" },
              { id: "approved", label: "Aprobadas" },
              { id: "pending", label: "Pendientes" },
              { id: "hidden", label: "Ocultas" },
            ].map((flt) => (
              <button
                key={flt.id}
                type="button"
                onClick={() => onReviewFilterChange(flt.id as "all" | "approved" | "pending" | "hidden")}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  reviewFilter === flt.id
                    ? "bg-zinc-800 text-white font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {flt.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenAddReview}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Testimonio WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Listado de Reseñas */}
      <div className="space-y-3">
        {filteredReviews.map((rev) => (
          <div
            key={rev.id}
            className={`p-5 rounded-2xl border transition-all shadow-md space-y-4 ${
              rev.status === "approved"
                ? "bg-zinc-900/60 border-zinc-800"
                : rev.status === "pending"
                ? "bg-amber-950/20 border-amber-500/30"
                : "bg-red-950/15 border-red-500/20 opacity-70"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-200 shrink-0">
                  {rev.authorName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">{rev.authorName}</span>
                    <span className="text-xs text-zinc-400">({rev.city})</span>

                    {/* Botón interactivo: Compra Verificada */}
                    <button
                      type="button"
                      onClick={() => onToggleVerified(rev.id)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        rev.isVerified
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-500/40"
                          : "bg-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                      title="Haz clic para marcar o desmarcar como Compra Verificada"
                    >
                      <Check className="w-3 h-3" />
                      <span>{rev.isVerified ? "Compra Verificada" : "Marcar Verificada"}</span>
                    </button>

                    {/* Botón interactivo: Destacar en Portada */}
                    <button
                      type="button"
                      onClick={() => onToggleFeatured(rev.id)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                        rev.isFeatured
                          ? "bg-amber-950/80 text-amber-300 border border-amber-500/50"
                          : "bg-zinc-800 text-zinc-400 hover:text-amber-300"
                      }`}
                      title="Destacar testimonio clave en la portada de la tienda"
                    >
                      <Star className={`w-3 h-3 ${rev.isFeatured ? "fill-amber-300" : ""}`} />
                      <span>{rev.isFeatured ? "★ Destacado en Portada" : "☆ Destacar en Portada"}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Fragancia evaluada: <strong className="text-zinc-200">{rev.perfumeName}</strong> • {rev.date}
                  </p>
                </div>
              </div>

              {/* Estrellas y Estado de Moderación */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"
                      }`}
                    />
                  ))}
                </div>

                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    rev.status === "approved"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                      : rev.status === "pending"
                      ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                      : "bg-red-950 text-red-400 border border-red-500/40"
                  }`}
                >
                  {rev.status === "approved" ? "Aprobada" : rev.status === "pending" ? "Pendiente" : "Oculta"}
                </span>
              </div>
            </div>

            {/* Texto de la Reseña */}
            <blockquote className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs text-zinc-200 italic leading-relaxed">
              &ldquo;{rev.comment}&rdquo;
            </blockquote>

            {/* Acciones de Moderación */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-[11px] text-zinc-400 font-medium">Cambiar estado:</span>
                <button
                  type="button"
                  onClick={() => onToggleReviewStatus(rev.id, "approved")}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    rev.status === "approved"
                      ? "bg-emerald-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  Aprobar
                </button>
                <button
                  type="button"
                  onClick={() => onToggleReviewStatus(rev.id, "pending")}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    rev.status === "pending"
                      ? "bg-amber-600 text-white"
                      : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  Pendiente
                </button>
                <button
                  type="button"
                  onClick={() => onToggleReviewStatus(rev.id, "hidden")}
                  className={`min-h-[32px] px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    rev.status === "hidden"
                      ? "bg-zinc-700 text-white"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  Ocultar / Spam
                </button>
              </div>

              <button
                type="button"
                onClick={() => onDeleteReview(rev.id)}
                className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors rounded-lg hover:bg-zinc-800 cursor-pointer"
                title="Eliminar reseña permanentemente"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
