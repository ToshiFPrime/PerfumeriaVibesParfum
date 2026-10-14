"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Sparkles, Loader2, Upload, Trash2, Image as ImageIcon, Plus } from "lucide-react";
import type { Product, OlfactoryFamily, Gender, Concentration } from "@/types";
import { BaseModal } from "@/components/modals/BaseModal";

export interface AddPerfumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPerfume: (perfume: Product) => void;
}

export function AddPerfumeModal({ isOpen, onClose, onAddPerfume }: AddPerfumeModalProps) {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [dupe, setDupe] = useState("");
  const [family, setFamily] = useState<OlfactoryFamily>("Gourmand");
  const [gender, setGender] = useState<Gender>("Unisex");
  const [concentration, setConcentration] = useState<Concentration>("Eau de Parfum (EDP)");
  const [price5ml, setPrice5ml] = useState("50");
  const [stock5ml, setStock5ml] = useState("15");
  const [price10ml, setPrice10ml] = useState("80");
  const [stock10ml, setStock10ml] = useState("12");
  const [priceBottle, setPriceBottle] = useState("450");
  const [stockBottle, setStockBottle] = useState("4");
  const [description, setDescription] = useState("");

  // Fotos: Principal + hasta 2 secundarias
  const [mainPhoto, setMainPhoto] = useState<string>("");
  const [secondaryPhotos, setSecondaryPhotos] = useState<string[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState("");
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingSecondary, setIsUploadingSecondary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement>(null);

  // Subir Foto Principal (Archivo Local o Drag&Drop) con validación de seguridad (máx 2MB)
  const handleMainFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido (JPG, PNG o WebP).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen excede el límite recomendado de 2MB. Por favor optimiza el peso de la fotografía antes de subirla.");
      return;
    }

    setIsUploadingMain(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setTimeout(() => {
        setMainPhoto(event.target?.result as string);
        setIsUploadingMain(false);
      }, 400); // Micro-animación táctil
    };
    reader.readAsDataURL(file);
  };

  // Subir Foto Secundaria (Máximo 2) con validación de seguridad
  const handleSecondaryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (secondaryPhotos.length >= 2) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("La fotografía secundaria excede los 2MB. Por favor selecciona una imagen más liviana.");
      return;
    }

    setIsUploadingSecondary(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setTimeout(() => {
        setSecondaryPhotos((prev) => [...prev, event.target?.result as string].slice(0, 2));
        setIsUploadingSecondary(false);
      }, 400);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPhotoByUrl = () => {
    if (!photoUrlInput.trim()) return;
    const trimmed = photoUrlInput.trim();
    if (!mainPhoto) {
      setMainPhoto(trimmed);
    } else if (secondaryPhotos.length < 2) {
      setSecondaryPhotos((prev) => [...prev, trimmed]);
    }
    setPhotoUrlInput("");
  };

  const handleRemoveSecondaryPhoto = (index: number) => {
    setSecondaryPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Anti-spam
    if (!name.trim() || !brand.trim()) return;

    setIsSubmitting(true);

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const primaryImg =
      mainPhoto ||
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80";

    const allImages = [primaryImg, ...secondaryPhotos];

    const newProd: Product = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      brand: brand.trim(),
      slug,
      gender,
      concentration,
      description:
        description ||
        (dupe
          ? `Inspirado en ${dupe}. Fragancia de alta proyección y fijación.`
          : "Fragancia exclusiva recién añadida al catálogo."),
      olfactoryFamily: family,
      pyramid: {
        top: ["Notas de salida frescas", "Cítricos luminosos"],
        heart: ["Notas medias florales/especiadas", "Maderas nobles"],
        base: ["Vainilla", "Ámbar dorado", "Almizcle"],
      },
      images: allImages,
      variants: [
        {
          id: `v5-${Date.now()}`,
          milliliters: 5,
          label: "Decant 5ml (Atomizador Vidrio)",
          price: parseInt(price5ml, 10) || 50,
          stock: Math.max(0, parseInt(stock5ml, 10) || 15),
          sku: `${slug.toUpperCase().slice(0, 4)}-5ML`,
        },
        {
          id: `v10-${Date.now()}`,
          milliliters: 10,
          label: "Decant 10ml (Atomizador Metal)",
          price: parseInt(price10ml, 10) || 80,
          stock: Math.max(0, parseInt(stock10ml, 10) || 12),
          sku: `${slug.toUpperCase().slice(0, 4)}-10ML`,
        },
        {
          id: `v100-${Date.now()}`,
          milliliters: 100,
          label: "Frasco Completo 100ml",
          price: parseInt(priceBottle, 10) || 450,
          stock: Math.max(0, parseInt(stockBottle, 10) || 4),
          sku: `${slug.toUpperCase().slice(0, 4)}-100ML`,
        },
      ],
      rating: 5.0,
      reviewsCount: 0,
      isBestSeller: false,
      isNewArrival: true,
      tags: dupe ? [`Dupe ${dupe}`, "Nuevo Ingreso"] : ["Nuevo Ingreso"],
      isActive: true,
    };

    setTimeout(() => {
      onAddPerfume(newProd);
      setName("");
      setBrand("");
      setDupe("");
      setDescription("");
      setMainPhoto("");
      setSecondaryPhotos([]);
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Añadir Nueva Fragancia al Catálogo"
      subtitle="Sube foto principal y secundarias con vista previa en vivo, precios y stock"
      icon={<Sparkles className="w-5 h-5 text-amber-400" />}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs pt-1">
        {/* SECCIÓN 1: FOTOS DEL PRODUCTO CON PREVISUALIZACIÓN EN TIEMPO REAL */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              1. Fotos del Perfume (1 Principal + Máx. 2 Secundarias)
            </span>
            <span className="text-[11px] text-zinc-400 font-mono">
              {mainPhoto ? 1 : 0} principal • {secondaryPhotos.length}/2 secundarias
            </span>
          </div>

          {/* Grid de Previsualización de Fotos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Slot Foto Principal */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                Foto Principal *
              </span>
              <div className="relative aspect-square rounded-xl bg-zinc-950 border-2 border-dashed border-zinc-800 hover:border-zinc-700 flex flex-col items-center justify-center overflow-hidden transition-all">
                {isUploadingMain ? (
                  <div className="flex flex-col items-center gap-2 text-zinc-400">
                    <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                    <span className="text-[10px]">Cargando foto...</span>
                  </div>
                ) : mainPhoto ? (
                  <>
                    <Image
                      src={mainPhoto}
                      alt="Previsualización principal"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setMainPhoto("")}
                        className="p-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors"
                        title="Quitar foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
                      Principal ✓
                    </span>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => mainFileInputRef.current?.click()}
                    className="p-3 text-center w-full h-full flex flex-col items-center justify-center gap-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Upload className="w-5 h-5 text-zinc-500" />
                    <span className="text-[10px] font-semibold">Subir Foto</span>
                    <span className="text-[9px] text-zinc-600">JPG, PNG o WEBP</span>
                  </button>
                )}
              </div>
              <input
                ref={mainFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleMainFileChange}
                className="hidden"
              />
            </div>

            {/* Slots Fotos Secundarias (Máx 2) */}
            <div className="sm:col-span-2 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Fotos Secundarias (Detalle Frasco / Caja / Atomizador)
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {secondaryPhotos.length}/2 agregadas
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Previews de Fotos Secundarias Cargadas */}
                {secondaryPhotos.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl bg-zinc-950 border border-zinc-700/80 overflow-hidden group"
                  >
                    <Image
                      src={img}
                      alt={`Secundaria ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveSecondaryPhoto(idx)}
                        className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors"
                        title="Eliminar foto secundaria"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-zinc-300 font-mono">
                      Foto #{idx + 2}
                    </span>
                  </div>
                ))}

                {/* Botón para añadir foto secundaria (si son menos de 2) */}
                {secondaryPhotos.length < 2 && (
                  <div className="aspect-square rounded-xl bg-zinc-950 border-2 border-dashed border-zinc-800 hover:border-zinc-700 flex flex-col items-center justify-center overflow-hidden transition-all">
                    {isUploadingSecondary ? (
                      <div className="flex flex-col items-center gap-1 text-zinc-400">
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                        <span className="text-[9px]">Cargando...</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => secondaryFileInputRef.current?.click()}
                        className="p-3 text-center w-full h-full flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-zinc-500" />
                        <span className="text-[10px] font-semibold">+ Secundaria</span>
                        <span className="text-[9px] text-zinc-600">
                          {secondaryPhotos.length === 0 ? "1 de 2" : "2 de 2"}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
              <input
                ref={secondaryFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleSecondaryFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* O ingreso por URL externa */}
          <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-2">
            <input
              type="url"
              value={photoUrlInput}
              onChange={(e) => setPhotoUrlInput(e.target.value)}
              placeholder="O pega un enlace web directo de imagen (https://...)"
              className="flex-1 py-1.5 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
            />
            <button
              type="button"
              onClick={handleAddPhotoByUrl}
              disabled={!photoUrlInput.trim() || (!!mainPhoto && secondaryPhotos.length >= 2)}
              className="min-h-[32px] px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white font-semibold text-[11px] transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              Cargar URL
            </button>
          </div>
        </div>

        {/* SECCIÓN 2: INFORMACIÓN GENERAL DEL PERFUME */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Nombre del Perfume *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Odyssey Marshmallow"
              className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Casa / Marca *</label>
            <input
              type="text"
              required
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Ej. Armaf / Lattafa"
              className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Inspiración / Dupe de</label>
            <input
              type="text"
              value={dupe}
              onChange={(e) => setDupe(e.target.value)}
              placeholder="Ej. Bianco Latte / Ultra Male"
              className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Familia Olfativa</label>
            <select
              value={family}
              onChange={(e) => setFamily(e.target.value as OlfactoryFamily)}
              className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none cursor-pointer"
            >
              <option value="Gourmand">Gourmand (Dulce / Vainilla)</option>
              <option value="Oriental / Ámbar">Oriental / Ámbar (Árabe)</option>
              <option value="Amaderada">Amaderada (Cedro / Oud)</option>
              <option value="Cítrica">Cítrica & Fresca</option>
              <option value="Floral">Floral</option>
              <option value="Cuero">Cuero & Ahumado</option>
              <option value="Acuática">Acuática / Marina</option>
              <option value="Aromática">Aromática</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Género</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none cursor-pointer"
            >
              <option value="Unisex">Unisex</option>
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Concentración</label>
            <select
              value={concentration}
              onChange={(e) => setConcentration(e.target.value as Concentration)}
              className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none cursor-pointer"
            >
              <option value="Eau de Parfum (EDP)">Eau de Parfum (EDP)</option>
              <option value="Extrait de Parfum">Extrait de Parfum</option>
              <option value="Eau de Toilette (EDT)">Eau de Toilette (EDT)</option>
              <option value="Parfum">Parfum</option>
            </select>
          </div>
        </div>

        {/* SECCIÓN 3: PRECIOS Y STOCK POR PRESENTACIÓN */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <span className="font-bold text-white uppercase tracking-wider block">
            2. Precios y Existencias Iniciales (Bs.):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="font-bold text-zinc-200 block text-[11px]">Decant 5ml (Vidrio)</span>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold">Precio Bs.</label>
                  <input
                    type="number"
                    min={0}
                    value={price5ml}
                    onChange={(e) => setPrice5ml(e.target.value)}
                    className="w-full py-1.5 px-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold">Stock U.</label>
                  <input
                    type="number"
                    min={0}
                    value={stock5ml}
                    onChange={(e) => setStock5ml(e.target.value)}
                    className="w-full py-1.5 px-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="font-bold text-zinc-200 block text-[11px]">Decant 10ml (Metal)</span>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold">Precio Bs.</label>
                  <input
                    type="number"
                    min={0}
                    value={price10ml}
                    onChange={(e) => setPrice10ml(e.target.value)}
                    className="w-full py-1.5 px-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold">Stock U.</label>
                  <input
                    type="number"
                    min={0}
                    value={stock10ml}
                    onChange={(e) => setStock10ml(e.target.value)}
                    className="w-full py-1.5 px-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <span className="font-bold text-zinc-200 block text-[11px]">Frasco Completo 100ml</span>
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold">Precio Bs.</label>
                  <input
                    type="number"
                    min={0}
                    value={priceBottle}
                    onChange={(e) => setPriceBottle(e.target.value)}
                    className="w-full py-1.5 px-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-500 font-semibold">Stock U.</label>
                  <input
                    type="number"
                    min={0}
                    value={stockBottle}
                    onChange={(e) => setStockBottle(e.target.value)}
                    className="w-full py-1.5 px-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN 4: DESCRIPCIÓN */}
        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Descripción / Reseña Olfativa</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe las notas de salida, proyección y acordes principales..."
            className="w-full p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* ACCIONES Y ANTI-SPAM */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 rounded-xl text-zinc-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isUploadingMain || isUploadingSecondary}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                <span>Guardando Perfume...</span>
              </>
            ) : (
              <span>+ Guardar y Publicar en Catálogo</span>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
}
