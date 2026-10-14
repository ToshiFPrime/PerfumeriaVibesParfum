import type { AdminOrder, AdminReview, AdminUser, PerfumeBrand, CustomerPurchaseHistory, StockMovementLog } from "@/types/admin";

export const INITIAL_ORDERS: AdminOrder[] = [];

export const INITIAL_REVIEWS: AdminReview[] = [];

export const INITIAL_USERS: AdminUser[] = [];

export const INITIAL_BRANDS: PerfumeBrand[] = [
  { id: "br-lattafa", name: "Lattafa", origin: "Emiratos Árabes Unidos (Dubai)", category: "Árabe / Dubai", perfumesCount: 6, isActive: true },
  { id: "br-armaf", name: "Armaf", origin: "Emiratos Árabes Unidos", category: "Árabe / Dubai", perfumesCount: 3, isActive: true },
  { id: "br-afnan", name: "Afnan", origin: "Emiratos Árabes Unidos", category: "Árabe / Dubai", perfumesCount: 2, isActive: true },
  { id: "br-rasasi", name: "Rasasi", origin: "Emiratos Árabes Unidos", category: "Árabe / Dubai", perfumesCount: 2, isActive: true },
  { id: "br-jpg", name: "Jean Paul Gaultier", origin: "Francia", category: "Diseñador Lujo", perfumesCount: 1, isActive: true },
  { id: "br-valentino", name: "Valentino", origin: "Italia", category: "Diseñador Lujo", perfumesCount: 1, isActive: true },
  { id: "br-creed", name: "Creed", origin: "Francia / Reino Unido", category: "Nicho / Exclusivo", perfumesCount: 1, isActive: true },
  { id: "br-mfk", name: "Maison Francis Kurkdjian", origin: "Francia", category: "Nicho / Exclusivo", perfumesCount: 1, isActive: true },
  { id: "br-orto", name: "Orto Parisi", origin: "Italia", category: "Nicho / Exclusivo", perfumesCount: 1, isActive: true },
];

export const INITIAL_STOCK_LOGS: StockMovementLog[] = [];

export const INITIAL_CUSTOMER_PURCHASES: Record<string, CustomerPurchaseHistory> = {};
