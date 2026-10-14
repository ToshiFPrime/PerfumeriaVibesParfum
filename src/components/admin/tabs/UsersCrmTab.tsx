"use client";

import React from "react";
import { Users, UserPlus, Phone, UserCheck, UserX, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { AdminUser } from "@/types/admin";

interface UsersCrmTabProps {
  users: AdminUser[];
  userRoleFilter: string;
  onUserRoleFilterChange: (role: string) => void;
  onSendVipPromoWhatsApp: (user: AdminUser) => void;
  onViewCustomerHistory: (userId: string) => void;
  onToggleUserStatus: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onOpenAddUser: () => void;
}

export function UsersCrmTab({
  users,
  userRoleFilter,
  onUserRoleFilterChange,
  onSendVipPromoWhatsApp,
  onViewCustomerHistory,
  onToggleUserStatus,
  onDeleteUser,
  onOpenAddUser,
}: UsersCrmTabProps) {
  const filteredUsers = users.filter((u) => {
    if (userRoleFilter === "all") return true;
    return u.role === userRoleFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            Directorio de Clientes & Perfiles de Usuario
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Controla quién tiene acceso a la tienda, gestiona compradores VIP y envía promociones personalizadas por WhatsApp según sus gustos olfativos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
            {["all", "Cliente VIP", "Cliente Frecuente", "Asesor de Ventas", "Super Admin"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => onUserRoleFilterChange(role)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  userRoleFilter === role
                    ? "bg-zinc-800 text-white font-bold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                {role === "all" ? "Todos" : role.replace("Cliente ", "")}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onOpenAddUser}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Perfil</span>
          </button>
        </div>
      </div>

      {/* Grid de Perfiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className={`p-5 rounded-2xl border transition-all shadow-md space-y-4 ${
              user.status === "active"
                ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                : "bg-zinc-950/40 border-red-500/20 opacity-60"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-extrabold text-base text-white shrink-0">
                  {user.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">
                    {user.fullName}
                  </h4>
                  <span className="text-xs text-zinc-400 font-mono block mt-0.5">
                    📱 {user.phone} • {user.department}
                  </span>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 ${
                  user.role === "Super Admin"
                    ? "bg-purple-950 text-purple-300 border border-purple-500/40"
                    : user.role === "Asesor de Ventas"
                    ? "bg-blue-950 text-blue-300 border border-blue-500/40"
                    : user.role === "Cliente VIP"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                    : "bg-zinc-800 text-zinc-300"
                }`}
              >
                {user.role}
              </span>
            </div>

            {/* Resumen Comercial del Cliente */}
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/60 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Total Comprado:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatPrice(user.totalSpent)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Pedidos Realizados:</span>
                <span className="font-mono text-zinc-200">{user.ordersCount} pedidos</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-zinc-800/60">
                <span className="text-zinc-400">Familia Favorita:</span>
                <span className="font-medium text-white">{user.preferredFamily}</span>
              </div>
            </div>

            {/* Acciones del Perfil */}
            <div className="flex items-center justify-between gap-1.5 pt-1 flex-wrap sm:flex-nowrap">
              {/* Botón Ver Historial de Compras */}
              <button
                type="button"
                onClick={() => onViewCustomerHistory(user.id)}
                className="flex-1 min-h-[36px] px-2.5 py-1.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                title="Ver historial de pedidos confirmados de este cliente"
              >
                <span>📦 Historial ({user.ordersCount})</span>
              </button>

              {/* Botón WhatsApp VIP */}
              <button
                type="button"
                onClick={() => onSendVipPromoWhatsApp(user)}
                className="min-h-[36px] px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                title="Enviar recomendación olfativa personalizada por WhatsApp"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>

              {/* Botón Estado (Activo / Suspendido) */}
              <button
                type="button"
                onClick={() => onToggleUserStatus(user.id)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all cursor-pointer shrink-0 ${
                  user.status === "active"
                    ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-amber-400"
                    : "bg-red-950/50 border-red-500/40 text-red-400"
                }`}
                title={user.status === "active" ? "Suspender acceso" : "Reactivar perfil"}
              >
                {user.status === "active" ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
              </button>

              {/* Botón Eliminar Perfil */}
              <button
                type="button"
                onClick={() => onDeleteUser(user.id)}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                title="Eliminar perfil"
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
