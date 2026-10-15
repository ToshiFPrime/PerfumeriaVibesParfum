import { supabase } from "./client";
import { supabaseServer } from "./server";
import { MOCK_PERFUMES } from "@/lib/data/mockPerfumes";
import { INITIAL_BRANDS, INITIAL_ORDERS } from "@/lib/data/adminMockData";
import { ACTIVE_COUPONS } from "@/lib/data/shippingRates";
import type { Product, ProductVariant, DiscountCoupon, Gender, Concentration, OlfactoryFamily, OlfactoryPyramid } from "@/types";
import type { AdminOrder, PerfumeBrand, StockMovementLog } from "@/types/admin";

interface DbProductVariant {
  id: string;
  milliliters: number;
  label: string;
  price: number | string;
  compare_at_price?: number | string | null;
  stock: number;
  sku: string;
}

interface DbProduct {
  id: string;
  name: string;
  brand: string;
  slug: string;
  gender: Gender;
  concentration: Concentration;
  description: string;
  olfactory_family: OlfactoryFamily;
  olfactory_pyramid?: OlfactoryPyramid | null;
  images?: string[] | null;
  rating?: number | string | null;
  reviews_count?: number | null;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;
  is_on_sale?: boolean;
  discount_percent?: number | null;
  tags?: string[] | null;
  is_active?: boolean;
  product_variants?: DbProductVariant[];
}

interface DbBrand {
  id: string;
  name: string;
  country?: string | null;
  category: "Árabe / Dubai" | "Diseñador Lujo" | "Nicho / Exclusivo";
  is_active: boolean;
}

interface DbDiscount {
  id: string;
  code: string;
  percentage: number;
  description?: string | null;
  min_subtotal?: number | string | null;
}

interface DbOrder {
  id: string;
  order_number: string;
  customer_info?: { fullName?: string; phone?: string } | null;
  shipping_info?: { city?: string; department?: string; courier?: string } | null;
  subtotal: number | string;
  discount_amount: number | string;
  shipping_cost: number | string;
  total: number | string;
  status: string;
  created_at: string;
}

/**
 * Verifica si las variables de entorno de Supabase están configuradas y son válidas
 * (evita llamadas fallidas si el proyecto aún no se ha enlazado en Supabase Dashboard)
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return false;
  if (url.includes("placeholder-project") || anonKey.includes("placeholder")) return false;
  return url.startsWith("https://") && anonKey.length > 20;
}

// ============================================================================
// CATÁLOGO DE PRODUCTOS (HYBRID PERSISTENCE)
// ============================================================================

export interface GetProductsFilter {
  q?: string;
  brand?: string | null;
  family?: string | null;
  gender?: string | null;
  inStock?: boolean;
  limit?: number;
}

export async function getProductsDb(filters: GetProductsFilter = {}): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    try {
      let query = supabase
        .from("products")
        .select(`
          id,
          name,
          brand,
          slug,
          gender,
          concentration,
          description,
          olfactory_family,
          olfactory_pyramid,
          images,
          rating,
          reviews_count,
          is_featured,
          is_best_seller,
          is_new_arrival,
          is_on_sale,
          discount_percent,
          tags,
          is_active,
          product_variants (
            id,
            milliliters,
            label,
            price,
            compare_at_price,
            stock,
            sku
          )
        `)
        .eq("is_active", true);

      if (filters.brand) {
        query = query.ilike("brand", `%${filters.brand}%`);
      }
      if (filters.family) {
        query = query.eq("olfactory_family", filters.family);
      }
      if (filters.gender) {
        query = query.eq("gender", filters.gender);
      }
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (!error && data) {
        const rows = data as unknown as DbProduct[];
        const transformed: Product[] = rows.map((row) => ({
          id: row.id,
          name: row.name,
          brand: row.brand,
          slug: row.slug,
          gender: row.gender,
          concentration: row.concentration,
          description: row.description,
          olfactoryFamily: row.olfactory_family,
          pyramid: row.olfactory_pyramid || { top: [], heart: [], base: [] },
          images: row.images || [],
          rating: Number(row.rating) || 5.0,
          reviewsCount: row.reviews_count || 0,
          isFeatured: row.is_featured,
          isBestSeller: row.is_best_seller,
          isNewArrival: row.is_new_arrival,
          isOnSale: row.is_on_sale,
          discountPercent: row.discount_percent ?? undefined,
          tags: row.tags || [],
          isActive: row.is_active,
          variants: (row.product_variants || []).map((v): ProductVariant => ({
            id: v.id,
            milliliters: v.milliliters,
            label: v.label,
            price: Number(v.price),
            compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : undefined,
            stock: v.stock,
            sku: v.sku,
          })),
        }));

        if (filters.q) {
          const qLower = filters.q.toLowerCase().trim();
          return transformed.filter(
            (p) =>
              p.name.toLowerCase().includes(qLower) ||
              p.brand.toLowerCase().includes(qLower) ||
              p.olfactoryFamily.toLowerCase().includes(qLower)
          );
        }

        if (filters.inStock) {
          return transformed.filter((p) => p.variants.some((v) => v.stock > 0));
        }

        return transformed;
      }
    } catch (err) {
      console.warn("Supabase getProductsDb query failed, falling back to mock:", err);
    }
  }

  // Fallback seguro a MOCK_PERFUMES
  let results = MOCK_PERFUMES.filter((p) => p.isActive !== false);

  if (filters.q) {
    const qLower = filters.q.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(qLower) ||
        p.brand.toLowerCase().includes(qLower) ||
        p.olfactoryFamily.toLowerCase().includes(qLower)
    );
  }
  if (filters.brand) {
    results = results.filter((p) => p.brand.toLowerCase() === filters.brand!.toLowerCase());
  }
  if (filters.family) {
    results = results.filter((p) => p.olfactoryFamily.toLowerCase() === filters.family!.toLowerCase());
  }
  if (filters.gender) {
    results = results.filter((p) => p.gender.toLowerCase() === filters.gender!.toLowerCase());
  }
  if (filters.inStock) {
    results = results.filter((p) => p.variants.some((v) => v.stock > 0));
  }
  if (filters.limit) {
    results = results.slice(0, filters.limit);
  }

  return results;
}

export async function getProductByIdOrSlugDb(idOrSlug: string): Promise<Product | null> {
  const cleanId = decodeURIComponent(idOrSlug).toLowerCase().trim();

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          brand,
          slug,
          gender,
          concentration,
          description,
          olfactory_family,
          olfactory_pyramid,
          images,
          rating,
          reviews_count,
          is_featured,
          is_best_seller,
          is_new_arrival,
          is_on_sale,
          discount_percent,
          tags,
          is_active,
          product_variants (
            id,
            milliliters,
            label,
            price,
            compare_at_price,
            stock,
            sku
          )
        `)
        .or(`id.eq.${cleanId},slug.eq.${cleanId}`)
        .maybeSingle();

      if (!error && data) {
        const row = data as unknown as DbProduct;
        return {
          id: row.id,
          name: row.name,
          brand: row.brand,
          slug: row.slug,
          gender: row.gender,
          concentration: row.concentration,
          description: row.description,
          olfactoryFamily: row.olfactory_family,
          pyramid: row.olfactory_pyramid || { top: [], heart: [], base: [] },
          images: row.images || [],
          rating: Number(row.rating) || 5.0,
          reviewsCount: row.reviews_count || 0,
          isFeatured: row.is_featured,
          isBestSeller: row.is_best_seller,
          isNewArrival: row.is_new_arrival,
          isOnSale: row.is_on_sale,
          discountPercent: row.discount_percent ?? undefined,
          tags: row.tags || [],
          isActive: row.is_active,
          variants: (row.product_variants || []).map((v): ProductVariant => ({
            id: v.id,
            milliliters: v.milliliters,
            label: v.label,
            price: Number(v.price),
            compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : undefined,
            stock: v.stock,
            sku: v.sku,
          })),
        };
      }
    } catch (err) {
      console.warn("Supabase getProductByIdOrSlugDb failed, falling back to mock:", err);
    }
  }

  const match = MOCK_PERFUMES.find(
    (p) => p.id.toLowerCase() === cleanId || p.slug.toLowerCase() === cleanId
  );
  return match || null;
}

// ============================================================================
// CASAS PERFUMISTAS (BRANDS)
// ============================================================================

export async function getBrandsDb(): Promise<PerfumeBrand[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        const rows = data as unknown as DbBrand[];
        return rows.map((b) => ({
          id: b.id,
          name: b.name,
          origin: b.country || "Emiratos Árabes Unidos",
          category: b.category,
          perfumesCount: 0,
          isActive: b.is_active,
        }));
      }
    } catch (err) {
      console.warn("Supabase getBrandsDb failed, falling back to mock:", err);
    }
  }

  return INITIAL_BRANDS;
}

export async function createBrandDb(brand: Omit<PerfumeBrand, "id">): Promise<PerfumeBrand> {
  const id = `br-${Date.now()}`;
  if (isSupabaseConfigured()) {
    try {
      const slug = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const { data, error } = await supabaseServer
        .from("brands")
        .insert({
          name: brand.name,
          slug,
          country: brand.origin,
          category: brand.category.includes("Árabe") ? "Árabe" : brand.category.includes("Nicho") ? "Nicho" : "Diseñador",
          is_active: brand.isActive,
        })
        .select()
        .single();

      if (!error && data) {
        const row = data as unknown as DbBrand;
        return {
          id: row.id,
          name: row.name,
          origin: row.country || brand.origin,
          category: brand.category,
          perfumesCount: 0,
          isActive: row.is_active,
        };
      }
    } catch (err) {
      console.warn("Supabase createBrandDb failed, returning local instance:", err);
    }
  }

  return {
    id,
    ...brand,
  };
}

// ============================================================================
// CUPONES Y DESCUENTOS (DISCOUNTS)
// ============================================================================

export async function getCouponsDb(): Promise<DiscountCoupon[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("discounts")
        .select("*")
        .eq("is_active", true);

      if (!error && data && data.length > 0) {
        const rows = data as unknown as DbDiscount[];
        return rows.map((d) => ({
          code: d.code,
          percentage: d.percentage,
          description: d.description || `Descuento de ${d.percentage}%`,
          minSubtotal: d.min_subtotal ? Number(d.min_subtotal) : 0,
        }));
      }
    } catch (err) {
      console.warn("Supabase getCouponsDb failed, falling back to mock:", err);
    }
  }

  return ACTIVE_COUPONS;
}

export async function validateCouponDb(code: string): Promise<DiscountCoupon | null> {
  const cleanCode = code.trim().toUpperCase();
  const all = await getCouponsDb();
  return all.find((c) => c.code.toUpperCase() === cleanCode) || null;
}

// ============================================================================
// PEDIDOS Y ÓRDENES (ORDERS)
// ============================================================================

export async function getOrdersDb(): Promise<AdminOrder[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseServer
        .from("orders")
        .select(`
          id,
          order_number,
          customer_info,
          shipping_info,
          subtotal,
          discount_amount,
          shipping_cost,
          total,
          status,
          created_at
        `)
        .order("created_at", { ascending: false });

      if (!error && data) {
        const rows = data as unknown as DbOrder[];
        return rows.map((o) => {
          const cust = o.customer_info || {};
          const ship = o.shipping_info || {};
          const orderStatus: AdminOrder["status"] =
            o.status === "confirmed"
              ? "Confirmado"
              : o.status === "shipped"
              ? "Enviado"
              : o.status === "delivered"
              ? "Entregado"
              : "Pendiente";

          return {
            id: o.id,
            orderNumber: o.order_number,
            customerName: cust.fullName || "Cliente Vibes",
            phone: cust.phone || "Sin teléfono",
            city: ship.city || "Bolivia",
            department: ship.department || "Nacional",
            itemsSummary: "Pedido en línea Vibes Parfum",
            total: Number(o.total) || 0,
            status: orderStatus,
            date: new Date(o.created_at).toLocaleDateString("es-BO"),
            courier: ship.courier || undefined,
          };
        });
      }
    } catch (err) {
      console.warn("Supabase getOrdersDb failed, falling back to mock:", err);
    }
  }

  return INITIAL_ORDERS;
}

export async function updateOrderStatusDb(
  orderId: string,
  status: "Pendiente" | "Confirmado" | "Enviado" | "Entregado",
  courier?: string
): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const dbStatus =
        status === "Confirmado"
          ? "confirmed"
          : status === "Enviado"
          ? "shipped"
          : status === "Entregado"
          ? "delivered"
          : "pending";

      const updatePayload: Record<string, unknown> = {
        status: dbStatus,
        updated_at: new Date().toISOString(),
      };

      if (courier) {
        updatePayload.shipping_info = { courier };
      }

      const { error } = await supabaseServer
        .from("orders")
        .update(updatePayload)
        .eq("id", orderId);

      return !error;
    } catch (err) {
      console.warn("Supabase updateOrderStatusDb error:", err);
      return false;
    }
  }
  return true;
}

export async function createProductDb(product: Product): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      // 1. Insertar el perfume maestro
      const { data: prodData, error: prodErr } = await supabaseServer
        .from("products")
        .insert({
          name: product.name,
          brand: product.brand,
          slug,
          gender: product.gender,
          concentration: product.concentration,
          description: product.description,
          olfactory_family: product.olfactoryFamily,
          olfactory_pyramid: product.pyramid || { top: [], heart: [], base: [] },
          images: product.images || [],
          rating: product.rating || 5.0,
          reviews_count: 0,
          is_featured: product.isFeatured || false,
          is_best_seller: product.isBestSeller || false,
          is_new_arrival: product.isNewArrival ?? true,
          is_on_sale: product.isOnSale || false,
          tags: product.tags || [],
          is_active: true,
        })
        .select()
        .single();

      if (prodErr || !prodData) {
        console.error("Error al insertar producto en Supabase:", prodErr);
        return null;
      }

      // 2. Insertar sus variantes (Decants 5ml, 10ml, Frascos)
      const variantsToInsert = (product.variants || []).map((v, i) => ({
        product_id: prodData.id,
        milliliters: v.milliliters,
        label: v.label,
        price: v.price,
        compare_at_price: v.compareAtPrice || null,
        stock: v.stock,
        sku: v.sku || `${slug.toUpperCase().slice(0, 4)}-${v.milliliters}ML-${i}`,
      }));

      const { data: varsData, error: varsErr } = await supabaseServer
        .from("product_variants")
        .insert(variantsToInsert)
        .select();

      if (varsErr) {
        console.error("Error al insertar variantes en Supabase:", varsErr);
      }

      return {
        ...product,
        id: prodData.id,
        variants: (varsData || []).map((v) => ({
          id: v.id,
          milliliters: v.milliliters,
          label: v.label,
          price: Number(v.price),
          compareAtPrice: v.compare_at_price ? Number(v.compare_at_price) : undefined,
          stock: v.stock,
          sku: v.sku,
        })),
      };
    } catch (err) {
      console.error("createProductDb exception:", err);
      return null;
    }
  }
  return product;
}

export async function updateProductDb(id: string, updates: Partial<Product>): Promise<Product | null> {
  if (isSupabaseConfigured()) {
    try {
      const payload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name) payload.name = updates.name;
      if (updates.brand) payload.brand = updates.brand;
      if (updates.gender) payload.gender = updates.gender;
      if (updates.concentration) payload.concentration = updates.concentration;
      if (updates.description) payload.description = updates.description;
      if (updates.olfactoryFamily) payload.olfactory_family = updates.olfactoryFamily;
      if (updates.isActive !== undefined) payload.is_active = updates.isActive;

      const { data, error } = await supabaseServer
        .from("products")
        .update(payload)
        .or(`id.eq.${id},slug.eq.${id}`)
        .select()
        .maybeSingle();

      if (!error && data) {
        return getProductByIdOrSlugDb(data.id);
      }
    } catch (err) {
      console.error("updateProductDb exception:", err);
    }
  }
  return null;
}

export async function deleteProductDb(id: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      // Soft-delete marcando is_active = false
      const { error } = await supabaseServer
        .from("products")
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .or(`id.eq.${id},slug.eq.${id}`);
      return !error;
    } catch (err) {
      console.error("deleteProductDb exception:", err);
      return false;
    }
  }
  return true;
}

export async function updateVariantStockDb(
  variantId: string,
  newStock?: number,
  delta?: number
): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      if (newStock !== undefined) {
        const { error } = await supabaseServer
          .from("product_variants")
          .update({ stock: Math.max(0, newStock) })
          .eq("id", variantId);
        return !error;
      } else if (delta !== undefined) {
        const { data } = await supabaseServer
          .from("product_variants")
          .select("stock")
          .eq("id", variantId)
          .single();
        if (data) {
          const current = Number(data.stock) || 0;
          const updated = Math.max(0, current + delta);
          const { error } = await supabaseServer
            .from("product_variants")
            .update({ stock: updated })
            .eq("id", variantId);
          return !error;
        }
      }
    } catch (err) {
      console.error("updateVariantStockDb exception:", err);
      return false;
    }
  }
  return true;
}

export async function createOrderDb(orderData: {
  orderNumber: string;
  customerName: string;
  phone: string;
  department: string;
  city: string;
  address?: string | null;
  notes?: string | null;
  items: Array<{
    productId: string;
    productName: string;
    variantId: string;
    variantLabel: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
}): Promise<AdminOrder | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data: orderRow, error: orderErr } = await supabaseServer
        .from("orders")
        .insert({
          order_number: orderData.orderNumber,
          customer_info: {
            fullName: orderData.customerName,
            phone: orderData.phone,
            address: orderData.address || "",
          },
          shipping_info: {
            city: orderData.city,
            department: orderData.department,
          },
          subtotal: orderData.subtotal,
          discount_amount: 0,
          shipping_cost: orderData.shippingCost,
          total: orderData.total,
          payment_method: "whatsapp_qr",
          status: "pending",
          notes: orderData.notes,
        })
        .select()
        .single();

      if (orderErr || !orderRow) {
        console.error("Error al insertar orden en Supabase:", orderErr);
        return null;
      }

      // Insertar los items de la orden
      if (orderData.items && orderData.items.length > 0) {
        const itemsToInsert = orderData.items.map((it) => ({
          order_id: orderRow.id,
          product_name: it.productName,
          variant_label: it.variantLabel,
          quantity: it.quantity,
          unit_price: it.unitPrice,
          total_price: it.unitPrice * it.quantity,
        }));

        await supabaseServer.from("order_items").insert(itemsToInsert);
      }

      return {
        id: orderRow.id,
        orderNumber: orderRow.order_number,
        customerName: orderData.customerName,
        phone: orderData.phone,
        city: orderData.city,
        department: orderData.department,
        itemsSummary: orderData.items.map((i) => `${i.productName} (${i.variantLabel}) x${i.quantity}`).join(", "),
        total: orderData.total,
        status: "Pendiente",
        date: new Date().toLocaleDateString("es-BO"),
      };
    } catch (err) {
      console.error("createOrderDb exception:", err);
      return null;
    }
  }
  return null;
}

export async function recordStockMovementDb(log: StockMovementLog): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabaseServer.from("stock_movements").insert({
        variant_id: log.variantId,
        product_id: log.perfumeId,
        delta: log.delta,
        previous_stock: log.previousStock,
        new_stock: log.newStock,
        reason: log.reason,
        reason_label: log.reasonLabel,
        notes: log.notes,
        admin_name: log.adminName,
      });
    } catch (err) {
      console.warn("Supabase recordStockMovementDb failed:", err);
    }
  }
}
