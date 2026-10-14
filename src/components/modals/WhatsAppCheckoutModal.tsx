"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  Send,
  QrCode,
  AlertCircle,
  Phone,
  Truck,
  Loader2,
  FileText,
  Download,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { customerOrderSchema } from "@/lib/validation/schemas";
import { BOLIVIA_DEPARTMENTS } from "@/lib/data/shippingRates";
import {
  WHATSAPP_NUMBERS,
  formatPrice,
  generateOrderWhatsAppMessage,
  buildWhatsAppLink,
} from "@/lib/utils";
import { useReceipt, type ReceiptData } from "@/hooks/useReceipt";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { BaseModal } from "./BaseModal";

export interface WhatsAppCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhatsAppCheckoutModal({ isOpen, onClose }: WhatsAppCheckoutModalProps) {
  const {
    items,
    subtotal,
    discount,
    coupon,
    shippingCost,
    total,
    selectedShipping,
    setSelectedShipping,
    clearCart,
  } = useCart();

  const { downloadReceipt, isGenerating: isGeneratingPdf } = useReceipt();
  const { preferences, updatePreferences } = useUserPreferences();

  const [checkoutMode, setCheckoutMode] = useState<"order" | "quote">("order");
  const [fullName, setFullName] = useState(() => (preferences.saveOnCheckout ? preferences.fullName : ""));
  const [phone, setPhone] = useState(() => (preferences.saveOnCheckout ? preferences.phone : ""));
  const [department, setDepartment] = useState(
    () => (preferences.saveOnCheckout && preferences.department) || selectedShipping?.department || "La Paz"
  );
  const [city, setCity] = useState(
    () => (preferences.saveOnCheckout && preferences.city) || selectedShipping?.city || "La Paz"
  );
  const [address, setAddress] = useState(() => (preferences.saveOnCheckout ? preferences.address : ""));
  const [notes, setNotes] = useState("");
  const [preferredNumber, setPreferredNumber] = useState<"65947174" | "65867500">(
    () => (preferences.saveOnCheckout && preferences.preferredNumber) || "65947174"
  );
  const [rememberMyDetails, setRememberMyDetails] = useState(() => preferences.saveOnCheckout ?? true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoadPreferences = () => {
    if (preferences.fullName) setFullName(preferences.fullName);
    if (preferences.phone) setPhone(preferences.phone);
    if (preferences.department) {
      setDepartment(preferences.department);
      const found = BOLIVIA_DEPARTMENTS.find((d) => d.department === preferences.department);
      if (found) setSelectedShipping(found);
    }
    if (preferences.city) setCity(preferences.city);
    if (preferences.address) setAddress(preferences.address);
    if (preferences.preferredNumber) setPreferredNumber(preferences.preferredNumber);
  };

  // Estado post-confirmación
  const [submittedOrderNumber, setSubmittedOrderNumber] = useState<string | null>(null);
  const [submittedWhatsappUrl, setSubmittedWhatsappUrl] = useState<string | null>(null);
  const [savedOrderReceiptData, setSavedOrderReceiptData] = useState<ReceiptData | null>(null);

  const handleDepartmentChange = (deptName: string) => {
    setDepartment(deptName);
    const found = BOLIVIA_DEPARTMENTS.find((d) => d.department === deptName);
    if (found) {
      setSelectedShipping(found);
      setCity(found.city);
    }
  };

  const handleModalClose = () => {
    setSubmittedOrderNumber(null);
    setSubmittedWhatsappUrl(null);
    setSavedOrderReceiptData(null);
    onClose();
  };

  const buildCurrentReceiptData = (orderNum?: string): ReceiptData => {
    return {
      orderNumber: orderNum || submittedOrderNumber || `VP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString("es-BO", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      customerName: fullName.trim() || "Cliente Distinguido",
      customerPhone: phone.trim() || "WhatsApp",
      department: department || "La Paz",
      city: city || department || "La Paz",
      address: address.trim() || "Coordinación de despacho por WhatsApp",
      items: items.map((i) => ({
        productName: i.productName,
        variantLabel: i.variant.label,
        quantity: i.quantity,
        unitPrice: i.variant.price,
        totalPrice: i.variant.price * i.quantity,
      })),
      subtotal,
      discountAmount: discount > 0 ? discount : undefined,
      shippingCost,
      total,
      paymentMethod: "QR Simple BCP / WhatsApp",
      notes: notes.trim() || undefined,
    };
  };

  const handleDownloadDirectReceipt = async () => {
    const data = savedOrderReceiptData || buildCurrentReceiptData();
    await downloadReceipt(data);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setErrors({});

    const parseResult = customerOrderSchema.safeParse({
      fullName,
      phone,
      department,
      city,
      address,
      notes: notes || undefined,
      preferredWhatsAppNumber: preferredNumber,
    });

    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    // Número de pedido formal
    const generatedOrderNum = `VP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const snapshotReceipt = buildCurrentReceiptData(generatedOrderNum);
    setSavedOrderReceiptData(snapshotReceipt);

    // Disparar confeti de celebración
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ffffff", "#25D366", "#c7a659"],
      });
    } catch {
      // Ignorar si canvas no está disponible
    }

    // Mensaje formateado para WhatsApp
    const message = generateOrderWhatsAppMessage({
      items,
      subtotal,
      discount,
      couponCode: coupon?.code,
      shippingCost,
      total,
      customer: parseResult.data,
      isQuoteOnly: checkoutMode === "quote",
    });

    const targetPhone =
      preferredNumber === "65947174"
        ? WHATSAPP_NUMBERS.primary.full
        : WHATSAPP_NUMBERS.secondary.full;

    const whatsappUrl = buildWhatsAppLink(targetPhone, message);
    setSubmittedWhatsappUrl(whatsappUrl);
    setSubmittedOrderNumber(generatedOrderNum);

    // Registrar en el backend
    if (checkoutMode === "order") {
      fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: parseResult.data,
          items: items.map((i) => ({
            productId: i.productId,
            productName: i.productName,
            variantId: i.variant.id,
            variantLabel: i.variant.label,
            quantity: i.quantity,
            unitPrice: i.variant.price,
          })),
          couponCode: coupon?.code,
          shippingCost,
        }),
      }).catch((err) => console.error("Error al registrar pedido en backend:", err));
    }

    // Guardar o actualizar preferencias del usuario si la casilla está marcada
    if (rememberMyDetails) {
      updatePreferences({
        fullName: fullName.trim(),
        phone: phone.trim(),
        department,
        city: city.trim(),
        address: address.trim(),
        preferredNumber,
        saveOnCheckout: true,
      });
    }

    // Abrir ventana de WhatsApp y limpiar carrito
    setTimeout(() => {
      window.open(whatsappUrl, "_blank");
      if (checkoutMode === "order") {
        clearCart();
      }
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={
        submittedOrderNumber
          ? "¡Pedido Registrado con Éxito!"
          : checkoutMode === "order"
          ? "Confirmar Pedido por WhatsApp"
          : "Solicitar Cotización Formal"
      }
      subtitle={
        submittedOrderNumber
          ? `Orden N° ${submittedOrderNumber} generada. Ya puedes guardar tu comprobante formal.`
          : checkoutMode === "order"
          ? "Coordinación directa y pago rápido con QR Simple oficial"
          : "Presupuesto detallado para envíos especiales o decants por volumen"
      }
      icon={
        submittedOrderNumber ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        ) : (
          <Phone className="w-5 h-5 text-emerald-400" />
        )
      }
      maxWidth="2xl"
    >
      {/* VISTA DE CONFIRMACIÓN CON DESCARGA DE COMPROBANTE PDF */}
      {submittedOrderNumber ? (
        <div className="space-y-6 py-2 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold">
              N° {submittedOrderNumber}
            </span>
            <h3 className="text-xl font-bold text-white">
              ¡Tu pedido está en camino a ser procesado!
            </h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto">
              Se ha generado el enlace para coordinar con nuestro asesor por WhatsApp. Descarga tu comprobante en PDF con sello oficial y garantía de autenticidad.
            </p>
          </div>

          {/* Tarjeta de Acciones Principales */}
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
            {/* Botón Descargar Comprobante PDF */}
            <button
              type="button"
              onClick={handleDownloadDirectReceipt}
              disabled={isGeneratingPdf}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-amber-950/40 transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-60"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  <span>Generando Comprobante de Lujo...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Descargar Comprobante PDF (Oficial)</span>
                </>
              )}
            </button>

            {/* Botón Reabrir WhatsApp */}
            {submittedWhatsappUrl && (
              <a
                href={submittedWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-6 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Reabrir Conversación en WhatsApp</span>
              </a>
            )}
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-6 py-2.5 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold transition-colors"
            >
              Finalizar y Volver a la Tienda
            </button>
          </div>
        </div>
      ) : (
        /* VISTA PRINCIPAL DEL CHECKOUT */
        <div className="space-y-5">
          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCheckoutMode("order")}
              className={`py-2 rounded-xl transition-all ${
                checkoutMode === "order"
                  ? "bg-white text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              🛒 Pedido Directo & Pago QR
            </button>
            <button
              type="button"
              onClick={() => setCheckoutMode("quote")}
              className={`py-2 rounded-xl transition-all ${
                checkoutMode === "quote"
                  ? "bg-white text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              📑 Solicitar Cotización Formal
            </button>
          </div>

          {/* Badge Informativo de Preferencias Guardadas */}
          {preferences.fullName && (
            <button
              type="button"
              onClick={handleLoadPreferences}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 transition-colors text-left cursor-pointer"
              title="Clic para re-aplicar tus datos guardados"
            >
              <span className="flex items-center gap-1.5 font-medium">
                ✨ <span>Datos cargados desde tus preferencias</span>
              </span>
              <span className="font-bold text-white font-mono text-[11px] truncate max-w-[140px]">
                {preferences.fullName}
              </span>
            </button>
          )}

          {/* Resumen Compacto */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between text-zinc-400">
              <span>{items.length} producto(s) seleccionados</span>
              <span className="text-white font-medium">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex items-center justify-between text-emerald-400">
                <span>Descuento aplicado ({coupon?.code})</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-zinc-300" />
                Envío ({department})
              </span>
              <span className={shippingCost === 0 ? "text-emerald-400 font-bold" : "text-white"}>
                {shippingCost === 0 ? "GRATIS" : formatPrice(shippingCost)}
              </span>
            </div>
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-sm font-bold text-white">
              <span>Total a Pagar</span>
              <span className="text-base text-emerald-400">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Nombre Completo */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-300">
                  Nombre y Apellido *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Teléfono / Celular */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Número de Celular / WhatsApp *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ej. 78912345"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Departamento */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Departamento de Bolivia *
                </label>
                <select
                  value={department}
                  onChange={(e) => handleDepartmentChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-xs focus:outline-none focus:border-white transition-colors cursor-pointer"
                >
                  {BOLIVIA_DEPARTMENTS.map((d) => (
                    <option key={d.department} value={d.department} className="bg-zinc-900">
                      {d.department} — {d.cost === 0 ? "Gratis" : `Bs. ${d.cost}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ciudad o Zona */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Ciudad o Localidad *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Ej. Sopocachi, Equipetrol, Cercado"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                />
                {errors.city && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.city}
                  </p>
                )}
              </div>

              {/* Dirección */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">
                  Dirección o Referencia de Entrega *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle, Número, Edificio, o Retiro en Flota"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors"
                />
                {errors.address && (
                  <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Notas Adicionales */}
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-300">
                  Indicaciones especiales (Opcional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="Ej. Enviar fragancia en caja de regalo, llamar antes de llegar..."
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-white transition-colors resize-none"
                />
              </div>
            </div>

            {/* Selector de Asesor WhatsApp Oficial */}
            <div className="space-y-2 pt-1">
              <label className="text-xs font-semibold text-zinc-300 block">
                Selecciona la Línea de Atención WhatsApp:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPreferredNumber("65947174")}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    preferredNumber === "65947174"
                      ? "bg-emerald-950/40 border-emerald-500/80 text-white shadow-lg"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full border ${
                      preferredNumber === "65947174"
                        ? "border-emerald-400 bg-emerald-400"
                        : "border-zinc-600"
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold text-white">Línea 1 (Principal)</p>
                    <p className="text-[11px] text-emerald-400 font-mono">65947174</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPreferredNumber("65867500")}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    preferredNumber === "65867500"
                      ? "bg-emerald-950/40 border-emerald-500/80 text-white shadow-lg"
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full border ${
                      preferredNumber === "65867500"
                        ? "border-emerald-400 bg-emerald-400"
                        : "border-zinc-600"
                    }`}
                  />
                  <div>
                    <p className="text-xs font-bold text-white">Línea 2 (Cotizaciones)</p>
                    <p className="text-[11px] text-emerald-400 font-mono">65867500</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Opción de Pago QR Informativa */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex items-center gap-3">
              <QrCode className="w-5 h-5 text-zinc-400 shrink-0" />
              <div className="text-xs">
                <p className="font-semibold text-white">Pago Simple con Código QR</p>
                <p className="text-zinc-400 text-[11px]">
                  Al enviar tu pedido por WhatsApp, el asesor te facilitará el QR bancario oficial para transferir.
                </p>
              </div>
            </div>

            {/* Checkbox para recordar datos de envío */}
            <label className="flex items-center gap-2.5 text-xs text-zinc-300 cursor-pointer pt-1 px-1">
              <input
                type="checkbox"
                checked={rememberMyDetails}
                onChange={(e) => setRememberMyDetails(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-0 cursor-pointer"
              />
              <span>Guardar mis datos de entrega y contacto para mis próximas compras</span>
            </label>

            {/* Acciones del formulario: Botón principal y botón de Comprobante PDF previo */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800/60 disabled:cursor-not-allowed active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/50 transition-all duration-200 cursor-pointer min-h-[48px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Conectando con WhatsApp...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>
                      {checkoutMode === "order"
                        ? `Enviar Pedido a WhatsApp (${preferredNumber})`
                        : `Solicitar Cotización por WhatsApp (${preferredNumber})`}
                    </span>
                  </>
                )}
              </button>

              {/* Botón de Comprobante PDF Previo / Cotización */}
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={handleDownloadDirectReceipt}
                  disabled={isGeneratingPdf}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-amber-200 hover:text-amber-100 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingPdf ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                  )}
                  <span>Descargar Comprobante Preliminar / Proforma PDF</span>
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </BaseModal>
  );
}
