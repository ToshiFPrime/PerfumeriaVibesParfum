"use client";

import React, { useState, useMemo } from "react";
import {
  Users,
  UserPlus,
  Phone,
  UserCheck,
  UserX,
  Trash2,
  Search,
  MapPin,
  ArrowUpDown,
  RotateCcw,
  Crown,
  ShoppingBag,
} from "lucide-react";
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

type UserSortOption = "spent_desc" | "orders_desc" | "name_asc" | "recent";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortOption, setSortOption] = useState<UserSortOption>("spent_desc");

  // Lista única de departamentos
  const availableDepartments = useMemo(() => {
    const deps = new Set(users.map((u) => u.department).filter(Boolean));
    return Array.from(deps).sort();
  }, [users]);

  // Contadores
  const vipCount = useMemo(() => {
    return users.filter((u) => u.role === "Cliente VIP").length;
  }, [users]);

  const totalSpentAll = useMemo(() => {
    return users.reduce((sum, u) => sum + (u.totalSpent || 0), 0);
  }, [users]);

  // Filtrado y ordenamiento
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          u.fullName.toLowerCase().includes(term) ||
          u.phone.includes(term) ||
          u.department.toLowerCase().includes(term) ||
          u.preferredFamily.toLowerCase().includes(term);

        const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
        const matchesDep = departmentFilter === "all" || u.department === departmentFilter;

        return matchesSearch && matchesRole && matchesDep;
      })
      .sort((a, b) => {
        if (sortOption === "spent_desc") return b.totalSpent - a.totalSpent;
        if (sortOption === "orders_desc") return b.ordersCount - a.ordersCount;
        if (sortOption === "name_asc") return a.fullName.localeCompare(b.fullName);
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      });
  }, [users, searchTerm, userRoleFilter, departmentFilter, sortOption]);

  const hasActiveFilters =
    searchTerm !== "" || userRoleFilter !== "all" || departmentFilter !== "all" || sortOption !== "spent_desc";

  const handleResetFilters = () => {
    setSearchTerm("");
    onUserRoleFilterChange("all");
    setDepartmentFilter("all");
    setSortOption("spent_desc");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Encabezado y Métricas */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs shadow-xl backdrop-blur-md">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Directorio de Clientes & CRM</span>
            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-[11px]">
              {filteredUsers.length} de {users.length} perfiles
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Volumen acumulado: <strong className="text-emerald-400 font-mono">{formatPrice(totalSpentAll)}</strong> •{" "}
            <strong className="text-amber-400 font-mono">{vipCount} Compradores VIP</strong>
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
            onClick={onOpenAddUser}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer shrink-0 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Perfil</span>
          </button>
        </div>
      </div>

      {/* Controles de Filtro y Búsqueda */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 space-y-3.5 shadow-lg">
        {/* Fila 1: Búsqueda y Ordenamiento */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, teléfono WhatsApp, ciudad o familia olfativa preferida..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as UserSortOption)}
              className="py-2.5 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-medium focus:outline-none focus:border-white cursor-pointer"
            >
              <option value="spent_desc">Mayor total comprado (VIPs primero)</option>
              <option value="orders_desc">Más pedidos realizados</option>
              <option value="name_asc">Nombre (A - Z)</option>
              <option value="recent">Registro más reciente</option>
            </select>
          </div>
        </div>

        {/* Fila 2: Píldoras de Roles y Departamento */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-800/60">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            {["all", "Cliente VIP", "Cliente Frecuente", "Asesor de Ventas", "Super Admin"].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => onUserRoleFilterChange(role)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer ${
                  userRoleFilter === role
                    ? "bg-white text-zinc-950 font-bold shadow-md"
                    : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                {role === "all" ? "Todos los Roles" : role.replace("Cliente ", "")}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <MapPin className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-white cursor-pointer"
            >
              <option value="all">Departamentos (Todos)</option>
              {availableDepartments.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Perfiles */}
      {filteredUsers.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
          <Users className="w-10 h-10 text-zinc-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">No se encontraron clientes con estos filtros</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Prueba a buscar por otro término o restablece los filtros activos para ver el directorio completo.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-md space-y-4 flex flex-col justify-between ${
                user.status === "active"
                  ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                  : "bg-zinc-950/40 border-red-500/20 opacity-60"
              }`}
            >
              <div className="space-y-3">
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
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      user.role === "Cliente VIP"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : user.role === "Super Admin"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                        : "bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-zinc-400">Total Comprado:</span>
                    <strong className="text-white font-mono text-sm">
                      {formatPrice(user.totalSpent)}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-500">Pedidos Confirmados:</span>
                    <span className="text-zinc-300 font-mono font-bold">
                      {user.ordersCount} pedidos
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-zinc-500">Familia Preferida:</span>
                    <span className="text-purple-300 font-medium">
                      {user.preferredFamily}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onViewCustomerHistory(user.id)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Ver historial detallado de perfumes y decants comprados"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Historial</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onSendVipPromoWhatsApp(user)}
                    className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 transition-all cursor-pointer"
                    title="Enviar recomendación u oferta personalizada por WhatsApp"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleUserStatus(user.id)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      user.status === "active"
                        ? "bg-zinc-800/80 hover:bg-red-950/60 border-zinc-700 text-zinc-400 hover:text-red-400"
                        : "bg-emerald-950/60 border-emerald-500/40 text-emerald-400"
                    }`}
                    title={user.status === "active" ? "Suspender acceso" : "Reactivar acceso"}
                  >
                    {user.status === "active" ? (
                      <UserX className="w-3.5 h-3.5" />
                    ) : (
                      <UserCheck className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteUser(user.id)}
                    className="p-2 rounded-xl bg-zinc-800/80 hover:bg-red-950 border border-zinc-700 hover:border-red-500/50 text-zinc-400 hover:text-red-400 transition-all cursor-pointer"
                    title="Eliminar perfil"
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
