import {
  pgTable,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

// ============================================================================
// MÓDULO 1: USUARIOS & CONTROL DE ACCESO
// ============================================================================

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").default("customer").notNull(), // 'customer' | 'admin' | 'staff'
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================================
// MÓDULO 2: CATÁLOGO DE FRAGANCIAS & MARCAS
// ============================================================================

export const brands = pgTable("brands", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  country: text("country").default("Emiratos Árabes Unidos").notNull(),
  category: text("category").default("Árabe").notNull(), // 'Árabe' | 'Nicho' | 'Diseñador'
  logoUrl: text("logo_url"),
  description: text("description"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  brandId: uuid("brand_id").references(() => brands.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  slug: text("slug").notNull().unique(),
  gender: text("gender").notNull(), // 'Hombre' | 'Mujer' | 'Unisex'
  concentration: text("concentration").notNull(),
  description: text("description").notNull(),
  olfactoryFamily: text("olfactory_family").notNull(),
  olfactoryPyramid: jsonb("olfactory_pyramid").notNull(),
  images: text("images").array().notNull(),
  rating: numeric("rating", { precision: 2, scale: 1 }).default("5.0").notNull(),
  reviewsCount: integer("reviews_count").default(0).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isBestSeller: boolean("is_best_seller").default(false).notNull(),
  isNewArrival: boolean("is_new_arrival").default(false).notNull(),
  isOnSale: boolean("is_on_sale").default(false).notNull(),
  discountPercent: integer("discount_percent"),
  tags: text("tags").array(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  milliliters: integer("milliliters").notNull(),
  label: text("label").notNull(), // 'Decant 5ml', 'Decant 10ml', 'Frasco 100ml'
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric("compare_at_price", { precision: 10, scale: 2 }),
  stock: integer("stock").default(0).notNull(),
  sku: text("sku").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================================
// MÓDULO 3: OPERACIONES, KÁRDEX & AUDITORÍA
// ============================================================================

export const stockMovements = pgTable("stock_movements", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  delta: integer("delta").notNull(), // +10 (reingreso), -1 (venta o merma)
  previousStock: integer("previous_stock").notNull(),
  newStock: integer("new_stock").notNull(),
  reason: text("reason").notNull(), // 'venta_whatsapp' | 'reingreso_lote' | 'ajuste_inventario' | 'merma_rotura' | 'muestra_tester' | 'marcado_agotado'
  reasonLabel: text("reason_label").notNull(),
  adminName: text("admin_name").default("Super Admin").notNull(),
  adminId: uuid("admin_id").references(() => profiles.id, { onDelete: "set null" }),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  action: text("action").notNull(),
  tableName: text("table_name").notNull(),
  recordId: text("record_id").notNull(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  oldData: jsonb("old_data"),
  newData: jsonb("new_data"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================================
// MÓDULO 4: SOCIAL PROOF, MARKETING & FIDELIZACIÓN
// ============================================================================

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  authorName: text("author_name").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false).notNull(),
  isApproved: boolean("is_approved").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const wishlists = pgTable("wishlists", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const discounts = pgTable("discounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  percentage: integer("percentage").notNull(),
  description: text("description"),
  minSubtotal: numeric("min_subtotal", { precision: 10, scale: 2 }).default("0"),
  usageLimit: integer("usage_limit"),
  perUserLimit: integer("per_user_limit").default(1).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const couponRedemptions = pgTable("coupon_redemptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  discountId: uuid("discount_id").references(() => discounts.id, { onDelete: "cascade" }).notNull(),
  orderId: uuid("order_id"),
  customerPhone: text("customer_phone").notNull(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).default("0").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ============================================================================
// MÓDULO 5: VENTAS, PEDIDOS & LOGÍSTICA BOLIVIA
// ============================================================================

export const shippingRates = pgTable("shipping_rates", {
  id: uuid("id").defaultRandom().primaryKey(),
  department: text("department").notNull().unique(),
  city: text("city").notNull(),
  cost: numeric("cost", { precision: 10, scale: 2 }).notNull(),
  estimatedDays: text("estimated_days").notNull(),
  freeShippingAbove: numeric("free_shipping_above", { precision: 10, scale: 2 }).default("400"),
  isActive: boolean("is_active").default(true).notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: uuid("user_id").references(() => profiles.id, { onDelete: "set null" }),
  customerInfo: jsonb("customer_info").notNull(),
  shippingInfo: jsonb("shipping_info").notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  discountAmount: numeric("discount_amount", { precision: 10, scale: 2 }).default("0").notNull(),
  shippingCost: numeric("shipping_cost", { precision: 10, scale: 2 }).default("0").notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").default("whatsapp_qr").notNull(),
  paymentStatus: text("payment_status").default("pending").notNull(),
  status: text("status").default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").references(() => orders.id, { onDelete: "cascade" }).notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  productName: text("product_name").notNull(),
  variantLabel: text("variant_label").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
});

// ============================================================================
// MÓDULO 6: ATENCIÓN AL CLIENTE & SOPORTE
// ============================================================================

export const contactInquiries = pgTable("contact_inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email"),
  phone: text("phone").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").default("pending").notNull(), // 'pending' | 'in_progress' | 'responded' | 'archived'
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
