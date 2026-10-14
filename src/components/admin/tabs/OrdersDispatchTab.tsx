"use client";

import React, { useState, useMemo } from "react";
import {
  Truck,
  Clock,
  Phone,
  FileText,
  Loader2,
  Download,
  PackageCheck,
  Search,
  Filter,
  RotateCcw,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { AdminOrder } from "@/types/admin";
import { useReceipt } from "@/hooks/useReceipt";
import { exportOrdersToCsv } from "@/lib/export/exportCsv";
import { CourierDispatchModal } from "@/components/modals/admin/CourierDispatchModal";

interface OrdersDispatchTabProps {
  orders: AdminOrder[];
  onToggleOrderStatus: (orderId: string) => void;
  onNotifyCustomerWhatsApp: (order: AdminOrder) => void;
  onDispatchCourier?: (
    orderId: string,
    courierName: string,
    trackingNumber: string,
    terminalPoint: string,
    freightNote: string
  ) => void;
}

type OrderStatusFilter = "all" | "Pendiente" | "Confirmado" | "Enviado" | "Entregado";
type OrderSortOption = "recent" | "oldest" | "total_desc" | "total_asc";

export function OrdersDispatchTab({
  orders,
  onToggleOrderStatus,
  onNotifyCustomerWhatsApp,
  onDispatchCourier,
}: OrdersDispatchTabProps) {
  const { downloadFromAdminOrder } = useReceipt();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<AdminOrder | null>(null);

  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [courierFilter, setCourierFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<OrderSortOption>("recent");

  // Lista única de departamentos presentes
  const availableDepartments = useMemo(() => {
    const deps = new Set(orders.map((o) => o.department).filter(Boolean));
    return Array.from(deps).sort();
  }, [orders]);

  // Lista única de empresas de transporte presentes
  const availableCouriers = useMemo(() => {
    const couriers = new Set(orders.map((o) => o.courier || "Envío Express").filter(Boolean));
    return Array.from(couriers).sort();
  }, [orders]);

  // Contadores por estado
  const counts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "Pendiente").length,
      confirmed: orders.filter((o) => o.status === "Confirmado").length,
      dispatched: orders.filter((o) => o.status === "Enviado").length,
      delivered: orders.filter((o) => o.status === "Entregado").length,
    };
  }, [orders]);

  // Filtrado y ordenamiento compuesto
  const filteredOrders = useMemo(() => {
    return orders
      .filter((ord) => {
        // Búsqueda por texto (Nombre, Teléfono, # Pedido, Resumen o Ciudad)
        const term = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !term ||
          ord.customerName.toLowerCase().includes(term) ||
          ord.phone.includes(term) ||
          ord.orderNumber.toLowerCase().includes(term) ||
          ord.itemsSummary.toLowerCase().includes(term) ||
          ord.city.toLowerCase().includes(term) ||
          ord.department.toLowerCase().includes(term);

        // Filtro de Estado
        const matchesStatus = statusFilter === "all" || ord.status === statusFilter;

        // Filtro de Departamento
        const matchesDepartment = departmentFilter === "all" || ord.department === departmentFilter;

        // Filtro de Transporte
        const matchesCourier =
          courierFilter === "all" || (ord.courier || "Envío Express") === courierFilter;

        return matchesSearch && matchesStatus && matchesDepartment && matchesCourier;
      })
      .sort((a, b) => {
        if (sortOption === "total_desc") return b.total - a.total;
        if (sortOption === "total_asc") return a.total - b.total;
        // Fechas
        const dateA = new Date(a.date).getTime() || 0;
        const dateB = new Date(b.date).getTime() || 0;
        if (sortOption === "oldest") return dateA - dateB;
        return dateB - dateA; // recent
      });
  }, [orders, searchTerm, statusFilter, departmentFilter, courierFilter, sortOption]);

  // Total acumulado de las órdenes filtradas
  const filteredTotalAmount = useMemo(() => {
    return filteredOrders.reduce((sum, ord) => sum + ord.total, 0);
  }, [filteredOrders]);

  const hasActiveFilters =
    searchTerm !== "" ||
    statusFilter !== "all" ||
    departmentFilter !== "all" ||
    courierFilter !== "all" ||
    sortOption !== "recent";

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDepartmentFilter("all");
    setCourierFilter("all");
    setSortOption("recent");
  };

  const handleDownloadPdf = async (order: AdminOrder) => {
    setGeneratingId(order.id);
    try {
      await downloadFromAdminOrder(order);
    } finally {
      setGeneratingId(null);
    }
  };

  const handleExportCsv = () => {
    exportOrdersToCsv(filteredOrders, `pedidos_filtrados_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleConfirmDispatch = (
    orderId: string,
    courierName: string,
    trackingNumber: string,
    terminalPoint: string,
    freightNote: string
  ) => {
    if (onDispatchCourier) {
      onDispatchCourier(orderId, courierName, trackingNumber, terminalPoint, freightNote);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Panel Superior de Resumen y Acciones */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs shadow-xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
            <h3 className="text-sm font-bold text-white">Despachos & Pedidos de Bolivia</h3>
            <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-[11px]">
              {filteredOrders.length} de {orders.length} órdenes
            </span>
          </div>
          <p className="text-zinc-400">
            Monto visible: <strong className="text-emerald-400 font-mono">{formatPrice(filteredTotalAmount)}</strong>
            {statusFilter !== "all" && ` • Filtrado por: ${statusFilter}`}
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
              <span>Restablecer Filtros</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportCsv}
            className="px-3.5 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 hover:text-white font-semibold flex items-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
            title="Exportar órdenes visibles a archivo CSV"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Exportar CSV ({filteredOrders.length})</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros Multifunción */}
      <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/90 space-y-3.5 shadow-lg">
        {/* Fila 1: Búsqueda y Filtro de Estado Rápido */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Búsqueda por texto */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente, WhatsApp, # orden (ej. #ORD-9821), ciudad o perfume..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Selector de Orden */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as OrderSortOption)}
              className="py-2.5 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 font-medium focus:outline-none focus:border-white cursor-pointer"
            >
              <option value="recent">Más recientes primero</option>
              <option value="oldest">Más antiguos primero</option>
              <option value="total_desc">Mayor importe (Bs)</option>
              <option value="total_asc">Menor importe (Bs)</option>
            </select>
          </div>
        </div>

        {/* Fila 2: Píldoras de Estado y Filtros Geográficos */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-zinc-800/60">
          {/* Píldoras de Estado con contador */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "all"
                  ? "bg-white text-zinc-950 font-bold shadow-md"
                  : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              <span>Todos</span>
              <span className="font-mono text-[11px] opacity-80">({counts.all})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("Pendiente")}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "Pendiente"
                  ? "bg-amber-500 text-zinc-950 font-bold shadow-md"
                  : "bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 border border-amber-500/30"
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              <span>Pendientes</span>
              <span className="font-mono text-[11px] font-bold">({counts.pending})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("Confirmado")}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "Confirmado"
                  ? "bg-blue-500 text-white font-bold shadow-md"
                  : "bg-blue-950/40 text-blue-300 hover:bg-blue-900/50 border border-blue-500/30"
              }`}
            >
              <span>Confirmados</span>
              <span className="font-mono text-[11px]">({counts.confirmed})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("Enviado")}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "Enviado"
                  ? "bg-purple-500 text-white font-bold shadow-md"
                  : "bg-purple-950/40 text-purple-300 hover:bg-purple-900/50 border border-purple-500/30"
              }`}
            >
              <span>Enviados</span>
              <span className="font-mono text-[11px]">({counts.dispatched})</span>
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("Entregado")}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "Entregado"
                  ? "bg-emerald-500 text-zinc-950 font-bold shadow-md"
                  : "bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 border border-emerald-500/30"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Entregados</span>
              <span className="font-mono text-[11px]">({counts.delivered})</span>
            </button>
          </div>

          {/* Dropdowns de Departamento y Transporte */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
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

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-zinc-500" />
              <select
                value={courierFilter}
                onChange={(e) => setCourierFilter(e.target.value)}
                className="py-1.5 px-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-white cursor-pointer"
              >
                <option value="all">Transporte (Todos)</option>
                {availableCouriers.map((cour) => (
                  <option key={cour} value={cour}>
                    {cour}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Listado de Órdenes con Estado de Vacío Inteligente */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-3">
          <Truck className="w-10 h-10 text-zinc-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">No se encontraron pedidos con estos filtros</h4>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Intenta cambiar el término de búsqueda o limpia los filtros activos para ver todas las órdenes registradas.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            Limpiar todos los filtros
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-md hover:border-zinc-700/70 transition-colors"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    {ord.orderNumber}
                  </span>
                  <span className="text-sm font-bold text-white">{ord.customerName}</span>
                  <a
                    href={`https://wa.me/${ord.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-mono hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{ord.phone}</span>
                  </a>
                </div>
                <p className="text-xs text-zinc-300">
                  📍 {ord.city} ({ord.department}) • <strong className="text-white">{ord.itemsSummary}</strong>
                </p>
                <p className="text-[11px] text-zinc-500 flex items-center gap-2 flex-wrap">
                  <span>Transporte: <strong className="text-zinc-300">{ord.courier || "Envío Express"}</strong></span>
                  <span>•</span>
                  <span>Fecha: {ord.date}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-between xl:justify-end border-t xl:border-t-0 pt-3 xl:pt-0 border-zinc-800/60">
                <span className="text-base font-extrabold text-white font-mono mr-2">
                  {formatPrice(ord.total)}
                </span>

                {/* Botón de cambio de estado */}
                <button
                  type="button"
                  onClick={() => onToggleOrderStatus(ord.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    ord.status === "Pendiente"
                      ? "bg-amber-950/70 border border-amber-500/50 text-amber-300 hover:bg-amber-900/80"
                      : ord.status === "Confirmado"
                      ? "bg-blue-950/70 border border-blue-500/50 text-blue-300 hover:bg-blue-900/80"
                      : ord.status === "Enviado"
                      ? "bg-purple-950/70 border border-purple-500/50 text-purple-300 hover:bg-purple-900/80"
                      : "bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80"
                  }`}
                  title="Clic para avanzar al siguiente estado operativo"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{ord.status}</span>
                </button>

                {/* Botón de Generar Guía de Flota / Despacho */}
                <button
                  type="button"
                  onClick={() => setSelectedOrderForDispatch(ord)}
                  className="px-3 py-1.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
                  title="Generar Guía de Transporte (Flota / Courier) y notificar al cliente"
                >
                  <PackageCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">Guía Flota</span>
                </button>

                {/* Botón de Comprobante PDF Oficial */}
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(ord)}
                  disabled={generatingId === ord.id}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-800/90 hover:bg-zinc-700/90 border border-zinc-700/80 text-amber-200 hover:text-amber-100 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Descargar Comprobante PDF de lujo para guía o empaque"
                >
                  {generatingId === ord.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>PDF</span>
                </button>

                {/* Botón de Notificación WhatsApp Directa */}
                <button
                  type="button"
                  onClick={() => onNotifyCustomerWhatsApp(ord)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  title="Enviar mensaje de actualización por WhatsApp"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Despacho por Flota */}
      <CourierDispatchModal
        isOpen={!!selectedOrderForDispatch}
        onClose={() => setSelectedOrderForDispatch(null)}
        order={selectedOrderForDispatch}
        onConfirmDispatch={handleConfirmDispatch}
      />
    </div>
  );
}
