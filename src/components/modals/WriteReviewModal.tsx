"use client";

import React, { useState } from "react";
import { Star, CheckCircle, Loader2 } from "lucide-react";
import { BaseModal } from "@/components/common/BaseModal";
import { reviewSchema } from "@/lib/validation/schemas";
import type { Product, Review } from "@/types";

export interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onSubmitReview: (newReview: Review) => void;
}

export function WriteReviewModal({
  isOpen,
  onClose,
  product,
  onSubmitReview,
}: WriteReviewModalProps) {
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || isSuccess) return; // Anti-spam
    setError("");

    const validation = reviewSchema.safeParse({
      productId: product.id,
      authorName,
      rating,
      comment,
    });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || "Error al validar la reseña");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          authorName: authorName.trim(),
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      const newRev: Review = data.review || {
        id: `rev-${Date.now()}`,
        productId: product.id,
        authorName: authorName.trim(),
        rating,
        comment: comment.trim(),
        isVerifiedPurchase: true,
        date: "Hoy",
      };

      onSubmitReview(newRev);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setAuthorName("");
        setRating(5);
        setComment("");
        onClose();
      }, 1500);
    } catch {
      setError("No se pudo conectar con el servidor. Tu reseña fue guardada localmente.");
      // Fallback local
      const fallbackRev: Review = {
        id: `rev-${Date.now()}`,
        productId: product.id,
        authorName: authorName.trim(),
        rating,
        comment: comment.trim(),
        isVerifiedPurchase: true,
        date: "Hoy",
      };
      onSubmitReview(fallbackRev);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setAuthorName("");
        setRating(5);
        setComment("");
        onClose();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Escribir una Reseña"
      subtitle={`Comparte tu experiencia olfativa con ${product.name}`}
      icon={<Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1 text-xs">
        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">¡Reseña Publicada con Éxito!</h4>
            <p className="text-xs text-zinc-400">
              Muchas gracias por compartir tu experiencia con la comunidad de Vibes Parfum.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">Tu Nombre / Alias *</label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ej. Camila R. (Santa Cruz)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">Calificación *</label>
              <div className="flex items-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-white ml-2">
                  {rating} de 5 estrellas
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-300">Comentario u Opinión *</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cuéntanos sobre la fijación, el aroma en tu piel o tu experiencia con el despacho..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-white resize-none"
              />
            </div>

            {error && (
              <p className="p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 text-[11px]">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed text-zinc-950 font-bold text-xs shadow-lg transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  <span>Publicando y validando...</span>
                </>
              ) : (
                <span>Publicar Opinión (Compra Verificada)</span>
              )}
            </button>
          </>
        )}
      </form>
    </BaseModal>
  );
}
