"use client";

import React, { useState, useMemo } from "react";
import { Star, Plus, Check, Trash2, Search, RotateCcw, ShieldCheck, Heart } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [onlyVerified, setOnlyVerified] = useState(false);

  // Filtrado compuesto
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        r.perfumeName.toLowerCase().includes(term) ||
        r.authorName.toLowerCase().includes(term) ||
        r.city.toLowerCase().includes(term) ||
        r.comment.toLowerCase().includes(term);

      const matchesStatus = reviewFilter === "all" || r.status === reviewFilter;

      let matchesRating = true;
      if (ratingFilter === "5") matchesRating = r.rating === 5;
      else if (ratingFilter === "4") matchesRating = r.rating === 4;
      else if (ratingFilter === "3_or_less") matchesRating = r.rating <= 3;

      const matchesVerified = !onlyVerified || r.isVerified;

      return matchesSearch && matchesStatus && matchesRating && matchesVerified;
    });
  }, [reviews, searchTerm, reviewFilter, ratingFilter, onlyVerified]);

  const hasActiveFilters =
    searchTerm !== "" || reviewFilter !== "all" || ratingFilter !== "all" || onlyVerified;

  const handleResetFilters = () => {
    setSearchTerm("");
    onReviewFilterChange("all");
    setRatingFilter("all");
    setOnlyVerified(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Encabezado y Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Moderación de Reseñas & Testimonios</span>
            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-[11px]">
              {filteredReviews.length} de {reviews.length} opiniones
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Valida opiniones de compradores reales de Bolivia y destaca testimonios de clientes satisfechos en la portada.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white font-medium flex items-center gap-1.5 transition-all text-xs cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar Filtros</span>
            </button>
          )}

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

      {/* Controles de Filtros y Búsqueda */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 space-y-3.5 shadow-lg">
        {/* Búsqueda por texto */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por fragancia reseñada, cliente, ciudad o palabras en la opinión..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Píldoras de Estado y Dropdown de Estrellas */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-800/60">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
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
                className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                  reviewFilter === flt.id
                    ? "bg-white text-zinc-950 font-bold shadow-md"
                    : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                {flt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="py-1.5 px-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-white cursor-pointer"
              >
                <option value="all">Calificación (Todas)</option>
                <option value="5">⭐⭐⭐⭐⭐ 5 Estrellas</option>
                <option value="4">⭐⭐⭐⭐ 4 Estrellas</option>
                <option value="3_or_less">⭐⭐⭐ 3 o menos</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                onlyVerified
                  ? "bg-emerald-950 border border-emerald-500/50 text-emerald-300 font-bold"
                  : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Solo Compras Verificadas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Listado de Reseñas */}
      {filteredReviews.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
          <Star className="w-10 h-10 text-zinc-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">No hay opiniones que coincidan con estos filtros</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Intenta cambiar el filtro de estado o borrar el término de búsqueda.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-md space-y-3.5 ${
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
                      {rev.isVerified && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          Compra Verificada
                        </span>
                      )}
                      {rev.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/80 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                          <Heart className="w-2.5 h-2.5 fill-purple-400" />
                          Destacada en Portada
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-zinc-400 block mt-0.5">
                      Fragancia: <strong className="text-zinc-200">{rev.perfumeName}</strong> • {rev.date}
                    </span>
                  </div>
                </div>

                {/* Rating Estrellas */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= rev.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-zinc-700 fill-zinc-800"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Comentario */}
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80 italic">
                &quot;{rev.comment}&quot;
              </p>

              {/* Acciones de Moderación */}
              <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleFeatured(rev.id)}
                    className={`px-3 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
                      rev.isFeatured
                        ? "bg-purple-950 border-purple-500/50 text-purple-300"
                        : "bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {rev.isFeatured ? "★ En Portada" : "Destacar en Portada"}
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleVerified(rev.id)}
                    className={`px-3 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
                      rev.isVerified
                        ? "bg-emerald-950 border-emerald-500/50 text-emerald-300"
                        : "bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {rev.isVerified ? "✓ Verificado" : "Marcar Verificado"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Selector de estado */}
                  <select
                    value={rev.status}
                    onChange={(e) =>
                      onToggleReviewStatus(
                        rev.id,
                        e.target.value as "approved" | "pending" | "hidden"
                      )
                    }
                    className="py-1 px-2.5 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-zinc-200 focus:outline-none focus:border-white cursor-pointer"
                  >
                    <option value="approved">Aprobada (Visible)</option>
                    <option value="pending">Pendiente de Revisión</option>
                    <option value="hidden">Oculta (Rechazada)</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => onDeleteReview(rev.id)}
                    className="p-1.5 rounded-xl bg-zinc-800/80 hover:bg-red-950 border border-zinc-700 hover:border-red-500/50 text-zinc-400 hover:text-red-400 transition-all cursor-pointer"
                    title="Eliminar reseña definitivamente"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
