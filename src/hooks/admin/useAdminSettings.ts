"use client";

import { useState, useEffect } from "react";
import { INITIAL_BRANDS, INITIAL_STOCK_LOGS } from "@/lib/data/adminMockData";
import { ACTIVE_COUPONS } from "@/lib/data/shippingRates";
import { WHATSAPP_NUMBERS } from "@/lib/utils";
import type { PerfumeBrand, StockMovementLog } from "@/types/admin";
import type { DiscountCoupon } from "@/types";

export function useAdminSettings() {
  const [brandsList, setBrandsList] = useState<PerfumeBrand[]>(INITIAL_BRANDS);

  useEffect(() => {
    let isMounted = true;
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/brands");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.brands && data.brands.length > 0) {
            setBrandsList(data.brands);
          }
        }
      } catch (err) {
        console.warn("Error al cargar marcas desde API:", err);
      }
    };
    fetchBrands();
    return () => {
      isMounted = false;
    };
  }, []);
  const [couponsList, setCouponsList] = useState<DiscountCoupon[]>(ACTIVE_COUPONS);
  const [stockLogs, setStockLogs] = useState<StockMovementLog[]>(INITIAL_STOCK_LOGS);

  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);

  // Ajustes de Tienda y Cobros QR
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

  const addStockLog = (log: StockMovementLog) => {
    setStockLogs((prev) => [log, ...prev]);
  };

  const handleToggleBrandActive = (brandId: string) => {
    setBrandsList((prev) =>
      prev.map((b) => (b.id === brandId ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const handleAddBrand = (newBrand: PerfumeBrand) => {
    setBrandsList((prev) => [newBrand, ...prev]);
    setIsAddBrandOpen(false);

    fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newBrand.name,
        origin: newBrand.origin,
        category: newBrand.category,
        isActive: newBrand.isActive,
      }),
    }).catch(() => {});
  };

  const handleAddCoupon = (newCoupon: DiscountCoupon) => {
    setCouponsList((prev) => [newCoupon, ...prev]);
    setIsAddCouponOpen(false);

    fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: newCoupon.code,
        percentage: newCoupon.percentage,
        description: newCoupon.description,
        minSubtotal: newCoupon.minSubtotal || 0,
        isActive: true,
      }),
    }).catch(() => {});
  };

  const handleSaveSettings = () => {
    setSavedSettingsSuccess(true);
    setTimeout(() => {
      setSavedSettingsSuccess(false);
    }, 3000);
  };

  return {
    brandsList,
    setBrandsList,
    couponsList,
    setCouponsList,
    stockLogs,
    addStockLog,
    brandFilter,
    setBrandFilter,
    isAddBrandOpen,
    setIsAddBrandOpen,
    isAddCouponOpen,
    setIsAddCouponOpen,
    whatsappLine1,
    setWhatsappLine1,
    whatsappLine2,
    setWhatsappLine2,
    bankName,
    setBankName,
    accountHolder,
    setAccountHolder,
    accountNumber,
    setAccountNumber,
    freeShippingThreshold,
    setFreeShippingThreshold,
    announcementText,
    setAnnouncementText,
    isAnnouncementActive,
    setIsAnnouncementActive,
    savedSettingsSuccess,
    handleToggleBrandActive,
    handleAddBrand,
    handleAddCoupon,
    handleSaveSettings,
  };
}
