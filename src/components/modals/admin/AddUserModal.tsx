"use client";

import React, { useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import type { AdminUser } from "@/types/admin";
import { BaseModal } from "@/components/modals/BaseModal";

export interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUser: (user: AdminUser) => void;
}

export function AddUserModal({ isOpen, onClose, onAddUser }: AddUserModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dept, setDept] = useState("Santa Cruz");
  const [role, setRole] = useState<"Cliente VIP" | "Cliente Frecuente" | "Asesor de Ventas">("Cliente VIP");
  const [family, setFamily] = useState("Gourmand / Vainilla");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Anti-spam
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newUser: AdminUser = {
        id: `usr-${Date.now()}`,
        fullName: name.trim(),
        phone: phone.trim(),
        department: dept,
        role,
        totalSpent: 0,
        ordersCount: 0,
        preferredFamily: family,
        status: "active",
        joinedDate: "Hoy",
      };

      onAddUser(newUser);
      setName("");
      setPhone("");
      setDept("Santa Cruz");
      setRole("Cliente VIP");
      setFamily("Gourmand / Vainilla");
      setIsSubmitting(false);
      onClose();
    }, 450);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Cliente o Asesor"
      subtitle="Alta de nuevo perfil en el CRM de clientes Vibes Parfum"
      icon={<UserPlus className="w-5 h-5 text-purple-400" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Nombre Completo *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Gabriela Mendizábal"
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Teléfono WhatsApp *</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="71234567"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-300">Departamento</label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white cursor-pointer"
            >
              {[
                "Santa Cruz",
                "La Paz",
                "Cochabamba",
                "Tarija",
                "Chuquisaca",
                "Oruro",
                "Potosí",
                "Beni",
                "Pando",
              ].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Tipo de Perfil / Rol</label>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as "Cliente VIP" | "Cliente Frecuente" | "Asesor de Ventas")
            }
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white cursor-pointer"
          >
            <option value="Cliente VIP">Cliente VIP</option>
            <option value="Cliente Frecuente">Cliente Frecuente</option>
            <option value="Asesor de Ventas">Asesor de Ventas</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-zinc-300">Preferencia Olfativa Predominante</label>
          <select
            value={family}
            onChange={(e) => setFamily(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white cursor-pointer"
          >
            <option value="Gourmand / Vainilla">Gourmand / Vainilla Dulce</option>
            <option value="Árabe / Oud">Árabe / Especiado / Oud</option>
            <option value="Fresco / Cítrico">Fresco / Acuático / Cítrico</option>
            <option value="Amaderado">Amaderado / Cuero</option>
            <option value="Floral">Floral Elegante</option>
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
              <span>Registrando Usuario...</span>
            </>
          ) : (
            <span>Registrar Usuario en CRM</span>
          )}
        </button>
      </form>
    </BaseModal>
  );
}
