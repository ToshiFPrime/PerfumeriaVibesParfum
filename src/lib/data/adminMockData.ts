import type {
  AdminOrder,
  AdminReview,
  AdminUser,
  PerfumeBrand,
  CustomerPurchaseHistory,
  StockMovementLog,
} from "@/types/admin";

// Pedidos iniciales: 0 (Estreno limpio listo para registrar ventas reales)
export const INITIAL_ORDERS: AdminOrder[] = [];

// Reseñas iniciales para moderación: 0
export const INITIAL_REVIEWS: AdminReview[] = [];

// Usuarios: Únicamente el usuario Super Admin de la boutique
export const INITIAL_USERS: AdminUser[] = [
  {
    id: "usr-admin",
    fullName: "Administrador Vibes Parfum",
    phone: "77072603",
    department: "La Paz",
    role: "Super Admin",
    totalSpent: 0,
    ordersCount: 0,
    preferredFamily: "Nicho / Árabe",
    status: "active",
    joinedDate: "Octubre 2026",
  },
];

// Marcas maestras reales de la perfumería
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

// Registro de movimientos de stock: 0 (Limpio para nuevos ajustes)
export const INITIAL_STOCK_LOGS: StockMovementLog[] = [];

// Historial de compras por cliente: Vacío
export const INITIAL_CUSTOMER_PURCHASES: Record<string, CustomerPurchaseHistory> = {};
