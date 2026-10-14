"use client";

import React, { useState } from "react";
import {
  History,
  Search,
  AlertTriangle,
  Gift,
  ShoppingCart,
  RefreshCw,
  Ban,
  ClipboardCheck,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import type { StockMovementLog, StockAdjustmentReason } from "@/types/admin";

interface AuditLogsTabProps {
  logs: StockMovementLog[];
}

export function AuditLogsTab({ logs }: AuditLogsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [reasonFilter, setReasonFilter] = useState<string>("all");

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.perfumeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.notes && log.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.adminName.toLowerCase().includes(searchTerm.toLowerCase());

    if (reasonFilter === "all") return matchesSearch;
    return matchesSearch && log.reason === reasonFilter;
  });

  const getReasonBadge = (reason: StockAdjustmentReason, label: string) => {
    switch (reason) {
      case "rotura":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950/70 text-red-400 border border-red-500/40">
            <AlertTriangle className="w-3 h-3" />
            {label}
          </span>
        );
      case "regalo_muestra":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/70 text-amber-300 border border-amber-500/40">
            <Gift className="w-3 h-3" />
            {label}
          </span>
        );
      case "venta_whatsapp":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/40">
            <ShoppingCart className="w-3 h-3" />
            {label}
          </span>
        );
      case "reingreso_lote":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950/70 text-blue-300 border border-blue-500/40">
            <RefreshCw className="w-3 h-3" />
            {label}
          </span>
        );
      case "marcado_agotado":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
            <Ban className="w-3 h-3 text-red-400" />
            {label}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950/70 text-purple-300 border border-purple-500/40">
            <ClipboardCheck className="w-3 h-3" />
            {label}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Encabezado y Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            Historial de Movimientos & Logs de Existencias a Detalle
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Registro cronológico inmutable de roturas, regalos a clientes, ventas WhatsApp, reingresos y cambios manuales.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Buscador */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar perfume, motivo o admin..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Filtro por Motivo */}
          <select
            value={reasonFilter}
            onChange={(e) => setReasonFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-white transition-colors cursor-pointer"
          >
            <option value="all">Todos los Motivos ({logs.length})</option>
            <option value="rotura">💥 Roturas / Dañados</option>
            <option value="regalo_muestra">🎁 Regalos / Muestras</option>
            <option value="venta_whatsapp">🛒 Ventas WhatsApp</option>
            <option value="reingreso_lote">📦 Reingresos / Lotes</option>
            <option value="marcado_agotado">🚫 Marcados Agotados</option>
            <option value="ajuste_inventario">🔍 Conteo Físico</option>
          </select>
        </div>
      </div>

      {/* Lista de Registros / Logs */}
      {filteredLogs.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800 p-6 space-y-2">
          <p className="text-sm font-bold text-white">No se encontraron movimientos registrados</p>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Prueba a limpiar la búsqueda o cambiar el motivo del filtro seleccionado.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-3 hover:border-zinc-700 transition-all shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-white bg-zinc-800/80 px-2.5 py-1 rounded-lg border border-zinc-700/60">
                    {log.timestamp}
                  </span>
                  {getReasonBadge(log.reason, log.reasonLabel)}
                  <span className="text-xs text-zinc-400 font-medium">
                    {log.brand} — <strong className="text-white">{log.perfumeName}</strong> ({log.variantLabel})
                  </span>
                </div>

                {/* Variación de Stock */}
                <div className="flex items-center gap-2 font-mono text-xs self-end sm:self-auto">
                  <span className="text-zinc-500">{log.previousStock} u.</span>
                  <ArrowRight className="w-3 h-3 text-zinc-600" />
                  <span className="text-white font-bold">{log.newStock} u.</span>
                  <span
                    className={`font-extrabold px-1.5 py-0.5 rounded text-[11px] ${
                      log.delta > 0
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                        : log.delta < 0
                        ? "bg-red-950 text-red-400 border border-red-500/30"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {log.delta > 0 ? `+${log.delta}` : `${log.delta}`}
                  </span>
                </div>
              </div>

              {/* Justificación y Responsable */}
              <div className="pt-2 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-400">
                <p className="italic text-zinc-300">
                  &ldquo;{log.notes || "Sin observaciones adicionales"}&rdquo;
                </p>

                <span className="flex items-center gap-1.5 text-[11px] text-zinc-500 shrink-0 font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-zinc-400" />
                  Registrado por: <strong className="text-zinc-300">{log.adminName}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
