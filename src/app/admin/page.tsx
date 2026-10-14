"use client";

import React, { useState } from "react";
import { MOCK_PERFUMES } from "@/lib/data/mockPerfumes";
import { ACTIVE_COUPONS } from "@/lib/data/shippingRates";
import {
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_USERS,
  INITIAL_BRANDS,
  INITIAL_STOCK_LOGS,
  INITIAL_CUSTOMER_PURCHASES,
} from "@/lib/data/adminMockData";
import { WHATSAPP_NUMBERS, formatPrice } from "@/lib/utils";
import type { Product, ProductVariant, DiscountCoupon } from "@/types";
import type {
  AdminTabId,
  AdminOrder,
  AdminReview,
  AdminUser,
  PerfumeBrand,
  StockMovementLog,
  StockAdjustmentReason,
  CustomerPurchaseHistory,
} from "@/types/admin";

// Modular Admin Components
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminMetricsCards } from "@/components/admin/AdminMetricsCards";
import { AdminTabBar } from "@/components/admin/AdminTabBar";

// Modular Tabs
import {
  CatalogStockTab,
  BrandsCategoriesTab,
  OrdersDispatchTab,
  ReviewsModerationTab,
  UsersCrmTab,
  SalesFinancesTab,
  CouponsPromosTab,
  DecantingCalculatorTab,
  AuditLogsTab,
  StoreSettingsTab,
} from "@/components/admin/tabs";

// Modular Modals from Central Modals Library (Optimized via dynamic imports)
import dynamic from "next/dynamic";
import type { RemovalReason } from "@/components/modals";

const AddPerfumeModal = dynamic(() => import("@/components/modals").then((m) => m.AddPerfumeModal), { ssr: false });
const AddBrandModal = dynamic(() => import("@/components/modals").then((m) => m.AddBrandModal), { ssr: false });
const AddReviewModal = dynamic(() => import("@/components/modals").then((m) => m.AddReviewModal), { ssr: false });
const AddUserModal = dynamic(() => import("@/components/modals").then((m) => m.AddUserModal), { ssr: false });
const AddCouponModal = dynamic(() => import("@/components/modals").then((m) => m.AddCouponModal), { ssr: false });
const StockAdjustmentModal = dynamic(() => import("@/components/modals").then((m) => m.StockAdjustmentModal), { ssr: false });
const CustomerPurchaseHistoryModal = dynamic(() => import("@/components/modals").then((m) => m.CustomerPurchaseHistoryModal), { ssr: false });
const RemovePerfumeModal = dynamic(() => import("@/components/modals").then((m) => m.RemovePerfumeModal), { ssr: false });

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<AdminTabId>("perfumes");
  const [searchTerm, setSearchTerm] = useState("");
  const [perfumesList, setPerfumesList] = useState<Product[]>(MOCK_PERFUMES);
  const [couponsList, setCouponsList] = useState<DiscountCoupon[]>(ACTIVE_COUPONS);
  const [ordersList, setOrdersList] = useState<AdminOrder[]>(INITIAL_ORDERS);
  const [reviewsList, setReviewsList] = useState<AdminReview[]>(INITIAL_REVIEWS);
  const [usersList, setUsersList] = useState<AdminUser[]>(INITIAL_USERS);
  const [brandsList, setBrandsList] = useState<PerfumeBrand[]>(INITIAL_BRANDS);
  const [stockLogs, setStockLogs] = useState<StockMovementLog[]>(INITIAL_STOCK_LOGS);
  const [customerPurchases] = useState<Record<string, CustomerPurchaseHistory>>(INITIAL_CUSTOMER_PURCHASES);

  // Filtros de pestaña
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "ok" | "out" | "paused">("all");
  const [reviewFilter, setReviewFilter] = useState<"all" | "approved" | "pending" | "hidden">("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");

  // Configuración de Tienda y Cobros QR
  const [whatsappLine1, setWhatsappLine1] = useState<string>(WHATSAPP_NUMBERS.primary.raw);
  const [whatsappLine2, setWhatsappLine2] = useState<string>(WHATSAPP_NUMBERS.secondary.raw);
  const [bankName, setBankName] = useState("Banco BCP Bolivia");
  const [accountHolder, setAccountHolder] = useState("Vibes Parfum S.R.L.");
  const [accountNumber, setAccountNumber] = useState("201-5049382-3-19");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("350");
  const [announcementText, setAnnouncementText] = useState(
    "Envíos asegurados a toda Bolivia (La Paz, Santa Cruz, Cochabamba y departamentos) • Cupón 10% OFF: VIBES10"
  );
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(true);
  const [savedSettingsSuccess, setSavedSettingsSuccess] = useState(false);

  // Estados de Modales
  const [isAddPerfumeOpen, setIsAddPerfumeOpen] = useState(false);
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [selectedCustomerHistory, setSelectedCustomerHistory] = useState<CustomerPurchaseHistory | null>(null);
  const [adjustmentTarget, setAdjustmentTarget] = useState<{ product: Product; variant: ProductVariant } | null>(null);
  const [removalTarget, setRemovalTarget] = useState<Product | null>(null);

  // Sincronización en segundo plano con endpoints API (Optimistic UI)
  const syncStockToApi = async (
    productId: string,
    variantId: string,
    payload: { delta?: number; newStock?: number; reason?: string; notes?: string }
  ) => {
    try {
      await fetch(`/api/products/${productId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, ...payload }),
      });
    } catch (err) {
      console.warn("Sincronización de stock en segundo plano no disponible:", err);
    }
  };

  // Handlers para Catálogo y Control de Existencias (Edición Teclado + Botón Agotado + Logs)
  const handleUpdateStock = (productId: string, variantId: string, delta: number) => {
    syncStockToApi(productId, variantId, { delta });
    setPerfumesList((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const targetVariant = prod.variants.find((v) => v.id === variantId);
        if (targetVariant) {
          const newStock = Math.max(0, targetVariant.stock + delta);
          const log: StockMovementLog = {
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            perfumeId: prod.id,
            perfumeName: prod.name,
            brand: prod.brand,
            variantId: targetVariant.id,
            variantLabel: targetVariant.label,
            previousStock: targetVariant.stock,
            newStock,
            delta,
            reason: delta > 0 ? "reingreso_lote" : "ajuste_inventario",
            reasonLabel: delta > 0 ? "Reingreso Rápido (+)" : "Descuento Rápido (-)",
            notes: delta > 0 ? "Aumento rápido de 1 unidad" : "Descuento de 1 unidad desde panel",
            adminName: "Juan Pablo V. (Super Admin)",
          };
          setStockLogs((l) => [log, ...l]);
        }
        return {
          ...prod,
          variants: prod.variants.map((v) => {
            if (v.id !== variantId) return v;
            return { ...v, stock: Math.max(0, v.stock + delta) };
          }),
        };
      })
    );
  };

  const handleSetDirectStock = (productId: string, variantId: string, newStock: number) => {
    syncStockToApi(productId, variantId, { newStock });
    setPerfumesList((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const targetVariant = prod.variants.find((v) => v.id === variantId);
        if (targetVariant) {
          const delta = newStock - targetVariant.stock;
          if (delta !== 0) {
            const isMarkedOut = newStock === 0;
            const log: StockMovementLog = {
              id: `log-${Date.now()}-${Math.random()}`,
              timestamp: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              perfumeId: prod.id,
              perfumeName: prod.name,
              brand: prod.brand,
              variantId: targetVariant.id,
              variantLabel: targetVariant.label,
              previousStock: targetVariant.stock,
              newStock,
              delta,
              reason: isMarkedOut ? "marcado_agotado" : "ajuste_inventario",
              reasonLabel: isMarkedOut ? "Marcado como Agotado (0)" : "Edición Directa por Teclado",
              notes: isMarkedOut ? "Fijado en 0 existencias (Agotado con un clic)" : `Ajuste manual de ${targetVariant.stock} a ${newStock} por teclado`,
              adminName: "Juan Pablo V. (Super Admin)",
            };
            setStockLogs((l) => [log, ...l]);
          }
        }
        return {
          ...prod,
          variants: prod.variants.map((v) => {
            if (v.id !== variantId) return v;
            return { ...v, stock: Math.max(0, newStock) };
          }),
        };
      })
    );
  };

  const handleConfirmAdjustment = (
    productId: string,
    variantId: string,
    newStock: number,
    reason: StockAdjustmentReason,
    reasonLabel: string,
    notes: string
  ) => {
    syncStockToApi(productId, variantId, { newStock, reason, notes });
    setPerfumesList((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const targetVariant = prod.variants.find((v) => v.id === variantId);
        if (targetVariant) {
          const delta = newStock - targetVariant.stock;
          const log: StockMovementLog = {
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            perfumeId: prod.id,
            perfumeName: prod.name,
            brand: prod.brand,
            variantId: targetVariant.id,
            variantLabel: targetVariant.label,
            previousStock: targetVariant.stock,
            newStock,
            delta,
            reason,
            reasonLabel,
            notes,
            adminName: "Juan Pablo V. (Super Admin)",
          };
          setStockLogs((l) => [log, ...l]);
        }
        return {
          ...prod,
          variants: prod.variants.map((v) => {
            if (v.id !== variantId) return v;
            return { ...v, stock: newStock };
          }),
        };
      })
    );
  };

  const handleAddPerfume = (newProd: Product) => {
    setPerfumesList((prev) => [newProd, ...prev]);
    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProd),
    }).catch((err) => console.warn("Error al registrar producto en API:", err));
  };

  const handleExhaustAllVariants = (productId: string) => {
    setPerfumesList((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const previousTotal = prod.variants.reduce((s, v) => s + v.stock, 0);
        const log: StockMovementLog = {
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          perfumeId: prod.id,
          perfumeName: prod.name,
          brand: prod.brand,
          variantId: "todas",
          variantLabel: "Todas las presentaciones",
          previousStock: previousTotal,
          newStock: 0,
          delta: -previousTotal,
          reason: "marcado_agotado",
          reasonLabel: "Agotado Rápido Total",
          notes: "Se agotaron todas las presentaciones de la fragancia con un solo clic",
          adminName: "Juan Pablo V. (Super Admin)",
        };
        setStockLogs((l) => [log, ...l]);
        return {
          ...prod,
          variants: prod.variants.map((v) => ({ ...v, stock: 0 })),
        };
      })
    );
  };

  const handleRestockAllVariants = (productId: string, amount: number = 10) => {
    setPerfumesList((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const previousTotal = prod.variants.reduce((s, v) => s + v.stock, 0);
        const newTotal = prod.variants.length * amount;
        const log: StockMovementLog = {
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          perfumeId: prod.id,
          perfumeName: prod.name,
          brand: prod.brand,
          variantId: "todas",
          variantLabel: "Todas las presentaciones",
          previousStock: previousTotal,
          newStock: newTotal,
          delta: newTotal - previousTotal,
          reason: "reingreso_lote",
          reasonLabel: "Reingreso Rápido de Lote",
          notes: `Reposición de ${amount} unidades a cada presentación`,
          adminName: "Juan Pablo V. (Super Admin)",
        };
        setStockLogs((l) => [log, ...l]);
        return {
          ...prod,
          variants: prod.variants.map((v) => ({ ...v, stock: amount })),
        };
      })
    );
  };

  const handleReactivateProduct = (productId: string) => {
    setPerfumesList((prev) =>
      prev.map((prod) => {
        if (prod.id !== productId) return prod;
        const currentStock = prod.variants.reduce((s, v) => s + v.stock, 0);
        const log: StockMovementLog = {
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          perfumeId: prod.id,
          perfumeName: prod.name,
          brand: prod.brand,
          variantId: "general",
          variantLabel: "Catálogo Completo",
          previousStock: currentStock,
          newStock: currentStock,
          delta: 0,
          reason: "reingreso_lote",
          reasonLabel: "Reactivado en Tienda Online",
          notes: "Se restableció la visibilidad del producto para los clientes",
          adminName: "Juan Pablo V. (Super Admin)",
        };
        setStockLogs((l) => [log, ...l]);
        return {
          ...prod,
          isActive: true,
          statusReason: undefined,
        };
      })
    );
  };

  const handleConfirmRemoval = (
    productId: string,
    action: "pause" | "delete",
    reason: RemovalReason,
    reasonLabel: string,
    notes: string
  ) => {
    const target = perfumesList.find((p) => p.id === productId);
    if (!target) return;

    const totalStock = target.variants.reduce((s, v) => s + v.stock, 0);
    const log: StockMovementLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      perfumeId: target.id,
      perfumeName: target.name,
      brand: target.brand,
      variantId: "general",
      variantLabel: "Producto Completo",
      previousStock: totalStock,
      newStock: action === "delete" ? 0 : totalStock,
      delta: action === "delete" ? -totalStock : 0,
      reason: action === "delete" ? "baja_producto" : "marcado_agotado",
      reasonLabel: `Baja / Retiro: ${reasonLabel} (${action === "pause" ? "Pausado" : "Eliminado"})`,
      notes,
      adminName: "Juan Pablo V. (Super Admin)",
    };
    setStockLogs((l) => [log, ...l]);

    if (action === "delete") {
      setPerfumesList((prev) => prev.filter((p) => p.id !== productId));
    } else {
      setPerfumesList((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, isActive: false, statusReason: reasonLabel }
            : p
        )
      );
    }
  };

  // Handlers para Pedidos y Despachos
  const handleToggleOrderStatus = (orderId: string) => {
    const statuses: AdminOrder["status"][] = ["Pendiente", "Confirmado", "Enviado", "Entregado"];
    setOrdersList((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        const nextIdx = (statuses.indexOf(ord.status) + 1) % statuses.length;
        return { ...ord, status: statuses[nextIdx] };
      })
    );
  };

  const handleNotifyCustomerWhatsApp = (order: AdminOrder) => {
    let message = `Hola *${order.customerName}*, un cordial saludo de *Vibes Parfum Bolivia* ✨\n\n`;
    if (order.status === "Pendiente") {
      message += `Te escribimos respecto a tu orden *#${order.orderNumber}* (${order.itemsSummary}).\n`;
      message += `El monto total es de *${formatPrice(order.total)}*.\n`;
      message += `¿Deseas que te facilitemos el código QR Simple para confirmar tu pago y proceder con el empaque?`;
    } else if (order.status === "Confirmado") {
      message += `¡Tu pago para la orden *#${order.orderNumber}* fue registrado con éxito!\n`;
      message += `Estamos preparando tu paquete con protección especial para despacho hacia *${order.city}*.`;
    } else if (order.status === "Enviado") {
      message += `🚚 ¡Tu pedido *#${order.orderNumber}* ya fue despachado hacia *${order.city}* mediante *${order.courier || "Transporte asegurado"}*!\n`;
      message += `Llegará aproximadamente en las próximas 24 a 48 horas. ¡Muchas gracias por elegir Vibes Parfum!`;
    } else {
      message += `Esperamos que estés disfrutando tu fragancia de la orden *#${order.orderNumber}*. ¡Gracias por confiar en Vibes Parfum!`;
    }

    const cleanPhone = order.phone.replace(/[^0-9]/g, "");
    const finalPhone = cleanPhone.startsWith("591") ? cleanPhone : `591${cleanPhone}`;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleDispatchCourier = (
    orderId: string,
    courierName: string,
    trackingNumber: string,
    terminalPoint: string,
    freightNote: string
  ) => {
    setOrdersList((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status: "Enviado",
          courier: `${courierName} (Guía: ${trackingNumber} • ${terminalPoint} • ${freightNote})`,
        };
      })
    );
  };

  // Handlers para Moderación de Reseñas
  const handleToggleReviewStatus = (id: string, newStatus: "approved" | "pending" | "hidden") => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleToggleVerified = (id: string) => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isVerified: !r.isVerified } : r))
    );
  };

  const handleToggleFeatured = (id: string) => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFeatured: !r.isFeatured } : r))
    );
  };

  const handleDeleteReview = (id: string) => {
    setReviewsList((prev) => prev.filter((r) => r.id !== id));
  };

  const handleAddReview = (newRev: AdminReview) => {
    setReviewsList((prev) => [newRev, ...prev]);
  };

  // Handlers para Clientes y CRM
  const handleToggleUserStatus = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
      )
    );
  };

  const handleDeleteUser = (id: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== id));
  };

  const handleSendVipPromoWhatsApp = (user: AdminUser) => {
    const cleanPhone = user.phone.replace(/[^0-9]/g, "");
    const finalPhone = cleanPhone.startsWith("591") ? cleanPhone : `591${cleanPhone}`;
    const text = `*VIBES PARFUM BOLIVIA* — Atención VIP ✨\n\nEstimado(a) *${user.fullName}*,\n\nEsperamos que te encuentres muy bien. Te contactamos con atención prioritaria para compartirte una selección especial de fragancias de la familia *${user.preferredFamily}* que acaban de llegar a nuestra boutique en frascos y decants exclusivos.\n\nDescubre el catálogo privado aquí:\nhttps://mono-background-attract-bytes.trycloudflare.com/catalogo\n\n¡Quedamos a tu entera disposición para apartar tus decants favoritos!`;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleViewCustomerHistory = (userId: string) => {
    const found = customerPurchases[userId];
    if (found) {
      setSelectedCustomerHistory(found);
    } else {
      const userObj = usersList.find((u) => u.id === userId);
      if (userObj) {
        setSelectedCustomerHistory({
          userId: userObj.id,
          userName: userObj.fullName,
          phone: userObj.phone,
          department: userObj.department,
          role: userObj.role,
          orders: [
            {
              orderId: `ord-gen-${userObj.id}`,
              orderNumber: `VP-2026-009${Math.floor(Math.random() * 9)}`,
              date: "Reciente",
              total: userObj.totalSpent || 450,
              status: "Entregado",
              paymentMethod: "QR Simple",
              city: `${userObj.department} (Centro)`,
              courier: "Encomienda Asegurada",
              items: [
                {
                  productName: "Odyssey Marshmallow",
                  brand: "Armaf",
                  variantLabel: "Decant 10ml (Atomizador Metal)",
                  quantity: 1,
                  price: 90,
                  image: "/images/perfumes/odyssey_marshmallow.jpg",
                },
                {
                  productName: "Eclaire",
                  brand: "Lattafa",
                  variantLabel: "Decant 10ml (Atomizador Metal)",
                  quantity: 1,
                  price: 90,
                  image: "/images/perfumes/lattafa_eclaire.jpg",
                },
              ],
            },
          ],
        });
      }
    }
  };

  const handleAddUser = (newUser: AdminUser) => {
    setUsersList((prev) => [newUser, ...prev]);
  };

  // Handlers para Casas y Categorías
  const handleToggleBrandActive = (id: string) => {
    setBrandsList((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const handleAddBrand = (newBrand: PerfumeBrand) => {
    setBrandsList((prev) => [newBrand, ...prev]);
  };

  // Handlers para Cupones
  const handleAddCoupon = (newCoupon: DiscountCoupon) => {
    setCouponsList((prev) => [newCoupon, ...prev]);
  };

  // Guardar configuración
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSettingsSuccess(true);
    setTimeout(() => setSavedSettingsSuccess(false), 2500);
  };

  // Métricas y estadísticas calculadas
  const totalRevenue = ordersList.reduce((sum, o) => sum + o.total, 0) + 24650;
  const totalOrdersCount = ordersList.length + 38;
  const averageTicket = Math.round(totalRevenue / totalOrdersCount);
  const lowStockCount = perfumesList.filter((p) => p.variants.some((v) => v.stock > 0 && v.stock <= 5)).length;
  const pendingReviewsCount = reviewsList.filter((r) => r.status === "pending").length;
  const vipUsersCount = usersList.filter((u) => u.role === "Cliente VIP").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 pt-6">
      {/* 1. Header Superior */}
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 2. Tarjetas de Métricas de Negocio */}
        <AdminMetricsCards
          perfumesCount={perfumesList.length}
          totalRevenue={totalRevenue}
          averageTicket={averageTicket}
          ordersCount={ordersList.length}
          lowStockCount={lowStockCount}
        />

        {/* 3. Selector de Pestañas Táctil y con Deslizador Lateral */}
        <AdminTabBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          perfumesCount={perfumesList.length}
          brandsCount={brandsList.length}
          ordersCount={ordersList.length}
          reviewsCount={reviewsList.length}
          pendingReviewsCount={pendingReviewsCount}
          usersCount={usersList.length}
          vipUsersCount={vipUsersCount}
          couponsCount={couponsList.length}
          logsCount={stockLogs.length}
        />

        {/* 4. Vistas Modulares de Cada Pestaña */}
        {activeTab === "perfumes" && (
          <CatalogStockTab
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            stockFilter={stockFilter}
            onStockFilterChange={setStockFilter}
            perfumes={perfumesList}
            onUpdateStock={handleUpdateStock}
            onSetDirectStock={handleSetDirectStock}
            onExhaustAllVariants={handleExhaustAllVariants}
            onRestockAllVariants={handleRestockAllVariants}
            onOpenAdjustmentModal={(prod, variant) => setAdjustmentTarget({ product: prod, variant })}
            onOpenRemoveModal={(prod) => setRemovalTarget(prod)}
            onReactivateProduct={handleReactivateProduct}
            onOpenAddPerfume={() => setIsAddPerfumeOpen(true)}
          />
        )}

        {activeTab === "brands" && (
          <BrandsCategoriesTab
            brands={brandsList}
            brandFilter={brandFilter}
            onBrandFilterChange={setBrandFilter}
            onToggleBrandActive={handleToggleBrandActive}
            onOpenAddBrand={() => setIsAddBrandOpen(true)}
          />
        )}

        {activeTab === "orders" && (
          <OrdersDispatchTab
            orders={ordersList}
            onToggleOrderStatus={handleToggleOrderStatus}
            onNotifyCustomerWhatsApp={handleNotifyCustomerWhatsApp}
            onDispatchCourier={handleDispatchCourier}
          />
        )}

        {activeTab === "reviews" && (
          <ReviewsModerationTab
            reviews={reviewsList}
            reviewFilter={reviewFilter}
            onReviewFilterChange={setReviewFilter}
            onToggleVerified={handleToggleVerified}
            onToggleFeatured={handleToggleFeatured}
            onToggleReviewStatus={handleToggleReviewStatus}
            onDeleteReview={handleDeleteReview}
            onOpenAddReview={() => setIsAddReviewOpen(true)}
          />
        )}

        {activeTab === "users" && (
          <UsersCrmTab
            users={usersList}
            userRoleFilter={userRoleFilter}
            onUserRoleFilterChange={setUserRoleFilter}
            onSendVipPromoWhatsApp={handleSendVipPromoWhatsApp}
            onViewCustomerHistory={handleViewCustomerHistory}
            onToggleUserStatus={handleToggleUserStatus}
            onDeleteUser={handleDeleteUser}
            onOpenAddUser={() => setIsAddUserOpen(true)}
          />
        )}

        {activeTab === "logs" && <AuditLogsTab logs={stockLogs} />}

        {activeTab === "finances" && <SalesFinancesTab />}

        {activeTab === "coupons" && (
          <CouponsPromosTab
            coupons={couponsList}
            onOpenAddCoupon={() => setIsAddCouponOpen(true)}
          />
        )}

        {activeTab === "calculator" && (
          <DecantingCalculatorTab perfumes={perfumesList} />
        )}

        {activeTab === "settings" && (
          <StoreSettingsTab
            bankName={bankName}
            setBankName={setBankName}
            accountHolder={accountHolder}
            setAccountHolder={setAccountHolder}
            accountNumber={accountNumber}
            setAccountNumber={setAccountNumber}
            freeShippingThreshold={freeShippingThreshold}
            setFreeShippingThreshold={setFreeShippingThreshold}
            whatsappLine1={whatsappLine1}
            setWhatsappLine1={setWhatsappLine1}
            whatsappLine2={whatsappLine2}
            setWhatsappLine2={setWhatsappLine2}
            announcementText={announcementText}
            setAnnouncementText={setAnnouncementText}
            isAnnouncementActive={isAnnouncementActive}
            setIsAnnouncementActive={setIsAnnouncementActive}
            savedSettingsSuccess={savedSettingsSuccess}
            onSaveSettings={handleSaveSettings}
          />
        )}
      </main>

      {/* 5. Modales de Creación Modulares */}
      <AddPerfumeModal
        isOpen={isAddPerfumeOpen}
        onClose={() => setIsAddPerfumeOpen(false)}
        onAddPerfume={handleAddPerfume}
      />

      <AddBrandModal
        isOpen={isAddBrandOpen}
        onClose={() => setIsAddBrandOpen(false)}
        onAddBrand={handleAddBrand}
      />

      <AddReviewModal
        isOpen={isAddReviewOpen}
        onClose={() => setIsAddReviewOpen(false)}
        onAddReview={handleAddReview}
        perfumes={perfumesList}
      />

      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onAddUser={handleAddUser}
      />

      <AddCouponModal
        isOpen={isAddCouponOpen}
        onClose={() => setIsAddCouponOpen(false)}
        onAddCoupon={handleAddCoupon}
      />

      {/* Modal de Ajuste de Stock con Motivo (Rotura, Regalo, Venta WhatsApp, etc.) */}
      <StockAdjustmentModal
        isOpen={!!adjustmentTarget}
        onClose={() => setAdjustmentTarget(null)}
        product={adjustmentTarget?.product || null}
        variant={adjustmentTarget?.variant || null}
        onConfirmAdjustment={handleConfirmAdjustment}
      />

      {/* Modal de Historial de Compras Confirmadas de Clientes */}
      <CustomerPurchaseHistoryModal
        isOpen={!!selectedCustomerHistory}
        onClose={() => setSelectedCustomerHistory(null)}
        history={selectedCustomerHistory}
      />

      {/* Modal de Dar de Baja / Retirar Perfume con Motivo Lógico */}
      <RemovePerfumeModal
        isOpen={!!removalTarget}
        onClose={() => setRemovalTarget(null)}
        product={removalTarget}
        onConfirmRemoval={handleConfirmRemoval}
      />
    </div>
  );
}
