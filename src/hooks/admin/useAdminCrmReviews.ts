"use client";

import { useState } from "react";
import { INITIAL_USERS, INITIAL_REVIEWS, INITIAL_CUSTOMER_PURCHASES } from "@/lib/data/adminMockData";
import type { AdminUser, AdminReview, CustomerPurchaseHistory } from "@/types/admin";

export function useAdminCrmReviews() {
  const [usersList, setUsersList] = useState<AdminUser[]>(INITIAL_USERS);
  const [reviewsList, setReviewsList] = useState<AdminReview[]>(INITIAL_REVIEWS);
  const [customerPurchases] = useState<Record<string, CustomerPurchaseHistory>>(INITIAL_CUSTOMER_PURCHASES);

  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [reviewFilter, setReviewFilter] = useState<"all" | "approved" | "pending" | "hidden">("all");

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [selectedCustomerHistory, setSelectedCustomerHistory] = useState<CustomerPurchaseHistory | null>(null);

  // CRM Handlers
  const handleToggleUserStatus = (id: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        return { ...u, status: u.status === "active" ? "suspended" : "active" };
      })
    );
  };

  const handleDeleteUser = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este perfil de usuario?")) {
      setUsersList((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleAddUser = (user: AdminUser) => {
    setUsersList((prev) => [user, ...prev]);
    setIsAddUserOpen(false);
  };

  const handleViewCustomerHistory = (userId: string) => {
    const history = customerPurchases[userId];
    if (history) {
      setSelectedCustomerHistory(history);
    } else {
      const user = usersList.find((u) => u.id === userId);
      if (user) {
        setSelectedCustomerHistory({
          userId: user.id,
          userName: user.fullName,
          phone: user.phone,
          department: user.department,
          role: user.role,
          orders: [],
        });
      }
    }
  };

  const handleSendVipPromoWhatsApp = (user: AdminUser) => {
    const cleanPhone = user.phone.replace(/[^0-9]/g, "");
    const formattedPhone = cleanPhone.startsWith("591") ? cleanPhone : `591${cleanPhone}`;
    const text = encodeURIComponent(
      `¡Hola ${user.fullName}! 👑 Como cliente distinguido de *Vibes Parfum Bolivia*, te reservamos un cupón de cortesía *VIP15* (15% OFF) en tu próxima compra de fragancias árabes o decants exclusivos.\n\n¿Te gustaría ver las novedades recién llegadas a Santa Cruz y La Paz? ¡Avísanos!`
    );
    window.open(`https://wa.me/${formattedPhone}?text=${text}`, "_blank");
  };

  // Reviews Handlers
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

  const handleToggleReviewStatus = (id: string, newStatus: "approved" | "pending" | "hidden") => {
    setReviewsList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleDeleteReview = (id: string) => {
    if (confirm("¿Deseas eliminar definitivamente este testimonio?")) {
      setReviewsList((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleAddReview = (review: AdminReview) => {
    setReviewsList((prev) => [review, ...prev]);
    setIsAddReviewOpen(false);
  };

  return {
    usersList,
    setUsersList,
    reviewsList,
    setReviewsList,
    userRoleFilter,
    setUserRoleFilter,
    reviewFilter,
    setReviewFilter,
    isAddUserOpen,
    setIsAddUserOpen,
    isAddReviewOpen,
    setIsAddReviewOpen,
    selectedCustomerHistory,
    setSelectedCustomerHistory,
    handleToggleUserStatus,
    handleDeleteUser,
    handleAddUser,
    handleViewCustomerHistory,
    handleSendVipPromoWhatsApp,
    handleToggleVerified,
    handleToggleFeatured,
    handleToggleReviewStatus,
    handleDeleteReview,
    handleAddReview,
  };
}
