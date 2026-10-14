"use client";

import React, { useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Check,
  RotateCcw,
  SlidersHorizontal,
  CreditCard,
  Heart,
  Sparkles,
} from "lucide-react";
import { BaseModal } from "./BaseModal";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { BOLIVIA_DEPARTMENTS } from "@/lib/data/shippingRates";
import { WHATSAPP_NUMBERS } from "@/lib/utils";
import type { UserPreferences } from "@/types/preferences";

interface UserPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PreferencesFormProps {
  preferences: UserPreferences;
  onClose: () => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
}

function PreferencesForm({
  preferences,
  onClose,
  updatePreferences,
  resetPreferences,
}: PreferencesFormProps) {
  const [fullName, setFullName] = useState(preferences.fullName);
  const [phone, setPhone] = useState(preferences.phone);
  const [department, setDepartment] = useState(preferences.department);
  const [city, setCity] = useState(preferences.city);
  const [address, setAddress] = useState(preferences.address);
  const [preferredNumber, setPreferredNumber] = useState(preferences.preferredNumber);
  const [preferredPayment, setPreferredPayment] = useState(preferences.preferredPayment);
  const [saveOnCheckout, setSaveOnCheckout] = useState(preferences.saveOnCheckout);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleDepartmentChange = (deptName: string) => {
    setDepartment(deptName);
    const found = BOLIVIA_DEPARTMENTS.find((d) => d.department === deptName);
    if (found) {
      setCity(found.city);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      fullName: fullName.trim(),
      phone: phone.trim(),
      department,
      city: city.trim(),
      address: address.trim(),
      preferredNumber,
      preferredPayment,
      saveOnCheckout,
    });
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    if (confirm("¿Deseas restablecer tus datos y preferencias guardadas en este navegador?")) {
      resetPreferences();
      setFullName("");
      setPhone("");
      setDepartment("La Paz");
      setCity("La Paz");
      setAddress("");
      setPreferredNumber("65947174");
      setPreferredPayment("QR Simple");
      setSaveOnCheckout(true);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-5">
      {/* Banner Informativo */}
      <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-zinc-300">
            Tus datos se guardan de forma privada en tu dispositivo para autocompletar tus compras sin registros molestos.
          </span>
        </div>
        {preferences.wishlist.length > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/60 border border-rose-500/30 text-rose-300 font-bold shrink-0 ml-2">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>{preferences.wishlist.length}</span>
          </div>
        )}
      </div>

      {/* Datos Personales */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-zinc-300" />
          Datos de Destinatario
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-medium text-zinc-300">Nombre Completo:</label>
            <input
              type="text"
              placeholder="Ej. Carlos Mendoza"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/80 text-xs transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-zinc-300">Teléfono / WhatsApp:</label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                placeholder="Ej. 77072603"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/80 text-xs font-mono transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Destino y Despacho Habitual */}
      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-zinc-300" />
          Ubicación y Despacho Habitual
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-medium text-zinc-300">Departamento:</label>
            <select
              value={department}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-400/80 text-xs transition-colors cursor-pointer"
            >
              {BOLIVIA_DEPARTMENTS.map((d) => (
                <option key={d.department} value={d.department}>
                  {d.department} ({d.estimatedDays})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-zinc-300">Ciudad o Municipio:</label>
            <input
              type="text"
              placeholder="Ej. Santa Cruz de la Sierra"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/80 text-xs transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1 text-xs">
          <label className="font-medium text-zinc-300">
            Dirección de Entrega o Agencia de Flota Preferida:
          </label>
          <input
            type="text"
            placeholder="Ej. Calle 21 de Calacoto #420 / O Terminal Bimodal Flota Copacabana"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/80 text-xs transition-colors"
          />
        </div>
      </div>

      {/* Preferencias de Pago y Contacto */}
      <div className="space-y-3 pt-2 border-t border-zinc-800/80">
        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5 text-zinc-300" />
          Canales y Pagos Preferidos
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-medium text-zinc-300">Línea de WhatsApp:</label>
            <select
              value={preferredNumber}
              onChange={(e) => setPreferredNumber(e.target.value as "65947174" | "65867500")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-400/80 text-xs transition-colors cursor-pointer"
            >
              <option value="65947174">Línea 1 ({WHATSAPP_NUMBERS.primary.raw}) - Pedidos</option>
              <option value="65867500">Línea 2 ({WHATSAPP_NUMBERS.secondary.raw}) - Cotizaciones</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-zinc-300">Método de Pago Favorito:</label>
            <select
              value={preferredPayment}
              onChange={(e) =>
                setPreferredPayment(e.target.value as "QR Simple" | "Transferencia Bancaria" | "Contra Entrega")
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-amber-400/80 text-xs transition-colors cursor-pointer"
            >
              <option value="QR Simple">QR Simple BCP (Instantáneo sin comisiones)</option>
              <option value="Transferencia Bancaria">Transferencia Bancaria Directa</option>
              <option value="Contra Entrega">Pago Contra Entrega (Ciudades habilitadas)</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={saveOnCheckout}
            onChange={(e) => setSaveOnCheckout(e.target.checked)}
            className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <span>Autocompletar automáticamente mis datos cuando compre en el carrito</span>
        </label>
      </div>

      {/* Acciones */}
      <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleReset}
          className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Borrar datos guardados"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restablecer</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-amber-950/40 active:scale-95 cursor-pointer"
          >
            {showSuccessToast ? (
              <>
                <Check className="w-4 h-4 text-zinc-950" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Guardar Preferencias</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export function UserPreferencesModal({ isOpen, onClose }: UserPreferencesModalProps) {
  const { preferences, updatePreferences, resetPreferences } = useUserPreferences();

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Mis Preferencias de Comprador"
      subtitle="Configura tus datos de despacho y contacto para agilizar tus pedidos de decants y perfumes"
      icon={<SlidersHorizontal className="w-5 h-5 text-amber-400" />}
      maxWidth="lg"
    >
      {isOpen && (
        <PreferencesForm
          key="open"
          preferences={preferences}
          onClose={onClose}
          updatePreferences={updatePreferences}
          resetPreferences={resetPreferences}
        />
      )}
    </BaseModal>
  );
}
