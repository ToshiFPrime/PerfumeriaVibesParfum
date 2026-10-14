"use client";

import React, { useState } from "react";
import { Layers, Loader2 } from "lucide-react";
import type { PerfumeBrand } from "@/types/admin";
import { BaseModal } from "@/components/modals/BaseModal";

export interface AddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBrand: (brand: PerfumeBrand) => void;
}

export function AddBrandModal({ isOpen, onClose, onAddBrand }: AddBrandModalProps) {
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState("Emiratos Árabes Unidos (Dubai)");
  const [category, setCategory] = useState<"Árabe / Dubai" | "Diseñador Lujo" | "Nicho / Exclusivo">("Árabe / Dubai");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Anti-spam
    if (!name.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newBrand: PerfumeBrand = {
        id: `br-${name.toLowerCase().replace(/\s+/g, "-")}`,
        name: name.trim(),
        origin: origin.trim() || "Internacional",
        category,
        perfumesCount: 0,
        isActive: true,
      };

      onAddBrand(newBrand);
      setName("");
      setOrigin("Emiratos Árabes Unidos (Dubai)");
      setCategory("Árabe / Dubai");
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Casa de Perfumería"
      subtitle="Agrega una nueva casa o marca de lujo para catalogación"
      icon={<Layers className="w-5 h-5 text-emerald-400" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Nombre de la Casa / Marca *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Lattafa / Armaf / Al Haramain"
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">País de Origen / Manufactura</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Ej. Emiratos Árabes Unidos (Dubai) / Francia"
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Categoría Comercial</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as "Árabe / Dubai" | "Diseñador Lujo" | "Nicho / Exclusivo")}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white cursor-pointer"
          >
            <option value="Árabe / Dubai">Árabe / Dubai</option>
            <option value="Diseñador Lujo">Diseñador Lujo</option>
            <option value="Nicho / Exclusivo">Nicho / Exclusivo</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed text-zinc-950 font-bold text-xs shadow-lg transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 min-h-[44px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
              <span>Guardando Casa...</span>
            </>
          ) : (
            <span>Guardar Casa de Perfumes</span>
          )}
        </button>
      </form>
    </BaseModal>
  );
}
