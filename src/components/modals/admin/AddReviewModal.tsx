"use client";

import React, { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import type { AdminReview } from "@/types/admin";
import type { Product } from "@/types";
import { BaseModal } from "@/components/modals/BaseModal";

export interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddReview: (review: AdminReview) => void;
  perfumes: Product[];
}

export function AddReviewModal({ isOpen, onClose, onAddReview, perfumes }: AddReviewModalProps) {
  const [perfumeName, setPerfumeName] = useState(
    perfumes[0] ? `${perfumes[0].name} (${perfumes[0].brand})` : "Odyssey Marshmallow (Armaf)"
  );
  const [authorName, setAuthorName] = useState("");
  const [city, setCity] = useState("Santa Cruz");
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Anti-spam
    if (!authorName.trim() || !comment.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newRev: AdminReview = {
        id: `rev-${Date.now()}`,
        perfumeId: "custom",
        perfumeName: perfumeName || "Fragancia General",
        authorName: authorName.trim(),
        city: city || "Bolivia",
        rating: parseInt(rating, 10) || 5,
        comment: comment.trim(),
        date: "Hoy",
        isVerified: true,
        status: "approved",
        isFeatured: true,
      };

      onAddReview(newRev);
      setAuthorName("");
      setCity("Santa Cruz");
      setRating("5");
      setComment("");
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Reseña / Testimonio"
      subtitle="Añade un testimonio verificado para destacar en la tienda"
      icon={<Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Fragancia Evaluada</label>
          <select
            value={perfumeName}
            onChange={(e) => setPerfumeName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white cursor-pointer"
          >
            {perfumes.map((p) => (
              <option key={p.id} value={`${p.name} (${p.brand})`}>
                {p.name} ({p.brand})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Nombre del Comprador *</label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Ej. Valeria T."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Ciudad / Departamento</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white cursor-pointer"
            >
              {[
                "Santa Cruz",
                "La Paz",
                "Cochabamba",
                "Tarija",
                "Sucre",
                "Oruro",
                "Potosí",
                "Trinidad",
                "Cobija",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Calificación en Estrellas</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white cursor-pointer"
          >
            <option value="5">⭐⭐⭐⭐⭐ (5 Estrellas - Excelente)</option>
            <option value="4">⭐⭐⭐⭐ (4 Estrellas - Muy Bueno)</option>
            <option value="3">⭐⭐⭐ (3 Estrellas - Bueno)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Comentario u Opinión *</label>
          <textarea
            rows={3}
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Opinión del cliente sobre la duración, estela y experiencia..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed text-zinc-950 font-bold text-xs shadow-lg transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
              <span>Publicando Reseña...</span>
            </>
          ) : (
            <span>Publicar y Aprobar Reseña</span>
          )}
        </button>
      </form>
    </BaseModal>
  );
}
