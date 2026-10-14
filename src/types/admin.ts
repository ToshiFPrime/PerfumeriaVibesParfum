export type AdminTabId =
  | "perfumes"
  | "brands"
  | "orders"
  | "reviews"
  | "users"
  | "finances"
  | "coupons"
  | "logs"
  | "settings";

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  department: string;
  itemsSummary: string;
  total: number;
  status: "Pendiente" | "Confirmado" | "Enviado" | "Entregado";
  date: string;
  courier?: string;
}

export interface AdminReview {
  id: string;
  perfumeId: string;
  perfumeName: string;
  authorName: string;
  city: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  status: "approved" | "pending" | "hidden";
  isFeatured: boolean;
}

export interface AdminUser {
  id: string;
  fullName: string;
  phone: string;
  department: string;
  role: "Super Admin" | "Asesor de Ventas" | "Cliente VIP" | "Cliente Frecuente";
  totalSpent: number;
  ordersCount: number;
  preferredFamily: string;
  status: "active" | "suspended";
  joinedDate: string;
}

export interface PerfumeBrand {
  id: string;
  name: string;
  origin: string;
  category: "Árabe / Dubai" | "Diseñador Lujo" | "Nicho / Exclusivo";
  perfumesCount: number;
  isActive: boolean;
}

export type StockAdjustmentReason =
  | "rotura"
  | "regalo_muestra"
  | "venta_whatsapp"
  | "reingreso_lote"
  | "ajuste_inventario"
  | "marcado_agotado"
  | "baja_producto";

export interface StockMovementLog {
  id: string;
  timestamp: string;
  perfumeId: string;
  perfumeName: string;
  brand: string;
  variantId: string;
  variantLabel: string;
  previousStock: number;
  newStock: number;
  delta: number;
  reason: StockAdjustmentReason;
  reasonLabel: string;
  notes?: string;
  adminName: string;
}

export interface CustomerPurchaseItem {
  productName: string;
  brand: string;
  variantLabel: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface CustomerConfirmedOrder {
  orderId: string;
  orderNumber: string;
  date: string;
  total: number;
  status: "Pendiente" | "Confirmado" | "Enviado" | "Entregado";
  paymentMethod: "QR Simple" | "Transferencia Bancaria" | "Contra Entrega";
  city: string;
  courier?: string;
  items: CustomerPurchaseItem[];
}

export interface CustomerPurchaseHistory {
  userId: string;
  userName: string;
  phone: string;
  department: string;
  role: string;
  orders: CustomerConfirmedOrder[];
}
