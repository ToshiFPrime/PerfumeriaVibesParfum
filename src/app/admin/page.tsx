"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import type { AdminTabId } from "@/types/admin";

// Modular Components
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

// Modular Hooks
import {
  useAdminCatalogStock,
  useAdminOrders,
  useAdminCrmReviews,
  useAdminSettings,
} from "@/hooks/admin";

// Modales Optimizados vía Dynamic Imports
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

  // 1. Hooks Especializados de Lógica de Negocio
  const settings = useAdminSettings();
  const catalog = useAdminCatalogStock(settings.addStockLog);
  const orders = useAdminOrders();
  const crm = useAdminCrmReviews();

  // 2. Cálculos Financieros y Métricas de Alto Nivel
  const totalRevenue = useMemo(
    () => orders.ordersList.reduce((acc, curr) => acc + curr.total, 0),
    [orders.ordersList]
  );

  const averageTicket = useMemo(
    () => (orders.ordersList.length > 0 ? totalRevenue / orders.ordersList.length : 0),
    [orders.ordersList, totalRevenue]
  );

  const lowStockCount = useMemo(
    () =>
      catalog.perfumesList.filter(
        (p) => p.isActive !== false && p.variants.some((v) => v.stock > 0 && v.stock <= 5)
      ).length,
    [catalog.perfumesList]
  );

  const pendingReviewsCount = useMemo(
    () => crm.reviewsList.filter((r) => r.status === "pending").length,
    [crm.reviewsList]
  );

  const vipUsersCount = useMemo(
    () => crm.usersList.filter((u) => u.role === "Cliente VIP").length,
    [crm.usersList]
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-24 pt-6">
      {/* 1. Header de Administración */}
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 2. Tarjetas de Métricas de Negocio */}
        <AdminMetricsCards
          perfumesCount={catalog.perfumesList.length}
          totalRevenue={totalRevenue}
          averageTicket={averageTicket}
          ordersCount={orders.ordersList.length}
          lowStockCount={lowStockCount}
        />

        {/* 3. Selector de Pestañas Táctil y con Deslizador Lateral */}
        <AdminTabBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          perfumesCount={catalog.perfumesList.length}
          brandsCount={settings.brandsList.length}
          ordersCount={orders.ordersList.length}
          reviewsCount={crm.reviewsList.length}
          pendingReviewsCount={pendingReviewsCount}
          usersCount={crm.usersList.length}
          vipUsersCount={vipUsersCount}
          couponsCount={settings.couponsList.length}
          logsCount={settings.stockLogs.length}
        />

        {/* 4. Vistas Modulares de Cada Pestaña */}
        {activeTab === "perfumes" && (
          <CatalogStockTab
            searchTerm={catalog.searchTerm}
            onSearchChange={catalog.setSearchTerm}
            stockFilter={catalog.stockFilter}
            onStockFilterChange={catalog.setStockFilter}
            perfumes={catalog.perfumesList}
            onUpdateStock={catalog.handleUpdateStock}
            onSetDirectStock={catalog.handleSetDirectStock}
            onExhaustAllVariants={catalog.handleExhaustAllVariants}
            onRestockAllVariants={catalog.handleRestockAllVariants}
            onOpenAdjustmentModal={(prod, variant) => catalog.setAdjustmentTarget({ product: prod, variant })}
            onOpenRemoveModal={(prod) => catalog.setRemovalTarget(prod)}
            onReactivateProduct={catalog.handleReactivateProduct}
            onOpenAddPerfume={() => catalog.setIsAddPerfumeOpen(true)}
          />
        )}

        {activeTab === "brands" && (
          <BrandsCategoriesTab
            brands={settings.brandsList}
            brandFilter={settings.brandFilter}
            onBrandFilterChange={settings.setBrandFilter}
            onToggleBrandActive={settings.handleToggleBrandActive}
            onOpenAddBrand={() => settings.setIsAddBrandOpen(true)}
          />
        )}

        {activeTab === "orders" && (
          <OrdersDispatchTab
            orders={orders.ordersList}
            onToggleOrderStatus={orders.handleToggleOrderStatus}
            onNotifyCustomerWhatsApp={orders.handleNotifyCustomerWhatsApp}
            onDispatchCourier={orders.handleDispatchCourier}
          />
        )}

        {activeTab === "reviews" && (
          <ReviewsModerationTab
            reviews={crm.reviewsList}
            reviewFilter={crm.reviewFilter}
            onReviewFilterChange={crm.setReviewFilter}
            onToggleVerified={crm.handleToggleVerified}
            onToggleFeatured={crm.handleToggleFeatured}
            onToggleReviewStatus={crm.handleToggleReviewStatus}
            onDeleteReview={crm.handleDeleteReview}
            onOpenAddReview={() => crm.setIsAddReviewOpen(true)}
          />
        )}

        {activeTab === "users" && (
          <UsersCrmTab
            users={crm.usersList}
            userRoleFilter={crm.userRoleFilter}
            onUserRoleFilterChange={crm.setUserRoleFilter}
            onSendVipPromoWhatsApp={crm.handleSendVipPromoWhatsApp}
            onViewCustomerHistory={crm.handleViewCustomerHistory}
            onToggleUserStatus={crm.handleToggleUserStatus}
            onDeleteUser={crm.handleDeleteUser}
            onOpenAddUser={() => crm.setIsAddUserOpen(true)}
          />
        )}

        {activeTab === "logs" && <AuditLogsTab logs={settings.stockLogs} />}

        {activeTab === "finances" && <SalesFinancesTab />}

        {activeTab === "coupons" && (
          <CouponsPromosTab
            coupons={settings.couponsList}
            onOpenAddCoupon={() => settings.setIsAddCouponOpen(true)}
          />
        )}

        {activeTab === "calculator" && (
          <DecantingCalculatorTab perfumes={catalog.perfumesList} />
        )}

        {activeTab === "settings" && (
          <StoreSettingsTab
            bankName={settings.bankName}
            setBankName={settings.setBankName}
            accountHolder={settings.accountHolder}
            setAccountHolder={settings.setAccountHolder}
            accountNumber={settings.accountNumber}
            setAccountNumber={settings.setAccountNumber}
            freeShippingThreshold={settings.freeShippingThreshold}
            setFreeShippingThreshold={settings.setFreeShippingThreshold}
            whatsappLine1={settings.whatsappLine1}
            setWhatsappLine1={settings.setWhatsappLine1}
            whatsappLine2={settings.whatsappLine2}
            setWhatsappLine2={settings.setWhatsappLine2}
            announcementText={settings.announcementText}
            setAnnouncementText={settings.setAnnouncementText}
            isAnnouncementActive={settings.isAnnouncementActive}
            setIsAnnouncementActive={settings.setIsAnnouncementActive}
            savedSettingsSuccess={settings.savedSettingsSuccess}
            onSaveSettings={settings.handleSaveSettings}
          />
        )}
      </main>

      {/* 5. Modales de Creación Modulares */}
      <AddPerfumeModal
        isOpen={catalog.isAddPerfumeOpen}
        onClose={() => catalog.setIsAddPerfumeOpen(false)}
        onAddPerfume={catalog.handleAddPerfume}
      />

      <AddBrandModal
        isOpen={settings.isAddBrandOpen}
        onClose={() => settings.setIsAddBrandOpen(false)}
        onAddBrand={settings.handleAddBrand}
      />

      <AddReviewModal
        isOpen={crm.isAddReviewOpen}
        onClose={() => crm.setIsAddReviewOpen(false)}
        onAddReview={crm.handleAddReview}
        perfumes={catalog.perfumesList}
      />

      <AddUserModal
        isOpen={crm.isAddUserOpen}
        onClose={() => crm.setIsAddUserOpen(false)}
        onAddUser={crm.handleAddUser}
      />

      <AddCouponModal
        isOpen={settings.isAddCouponOpen}
        onClose={() => settings.setIsAddCouponOpen(false)}
        onAddCoupon={settings.handleAddCoupon}
      />

      {/* Modal de Ajuste de Stock con Motivo */}
      <StockAdjustmentModal
        isOpen={!!catalog.adjustmentTarget}
        onClose={() => catalog.setAdjustmentTarget(null)}
        product={catalog.adjustmentTarget?.product || null}
        variant={catalog.adjustmentTarget?.variant || null}
        onConfirmAdjustment={catalog.handleConfirmAdjustment}
      />

      {/* Modal de Historial de Compras Confirmadas de Clientes */}
      <CustomerPurchaseHistoryModal
        isOpen={!!crm.selectedCustomerHistory}
        onClose={() => crm.setSelectedCustomerHistory(null)}
        history={crm.selectedCustomerHistory}
      />

      {/* Modal de Dar de Baja / Retirar Perfume con Motivo Lógico */}
      <RemovePerfumeModal
        isOpen={!!catalog.removalTarget}
        onClose={() => catalog.setRemovalTarget(null)}
        product={catalog.removalTarget}
        onConfirmRemoval={catalog.handleConfirmRemoval}
      />
    </div>
  );
}
