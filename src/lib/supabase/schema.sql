-- ============================================================================
-- VIBES PARFUM BOLIVIA - SCHEMA DE BASE DE DATOS POSTGRESQL (14 TABLAS)
-- Diseñado para Supabase con Row Level Security (RLS) e Integración Drizzle ORM
-- Estándar de Alta Fidelidad & Seguridad CIA (Confidencialidad, Integridad, Disponibilidad)
-- ============================================================================

-- Habilitar extensiones necesarias en PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- MÓDULO 1: USUARIOS & CONTROL DE ACCESO
-- ============================================================================

-- 1. TABLA: PROFILES (Perfiles de Usuarios y Roles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- MÓDULO 2: CATÁLOGO DE FRAGANCIAS & MARCAS
-- ============================================================================

-- 2. TABLA: BRANDS (Casas Perfumistas Normalizadas)
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    country TEXT NOT NULL DEFAULT 'Emiratos Árabes Unidos',
    category TEXT NOT NULL DEFAULT 'Árabe' CHECK (category IN ('Árabe', 'Nicho', 'Diseñador')),
    logo_url TEXT,
    description TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TABLA: PRODUCTS (Perfumes Maestros)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    gender TEXT NOT NULL CHECK (gender IN ('Hombre', 'Mujer', 'Unisex')),
    concentration TEXT NOT NULL CHECK (concentration IN ('Extrait de Parfum', 'Eau de Parfum (EDP)', 'Eau de Toilette (EDT)', 'Eau de Cologne (EDC)')),
    description TEXT NOT NULL,
    olfactory_family TEXT NOT NULL,
    olfactory_pyramid JSONB NOT NULL DEFAULT '{"top": [], "heart": [], "base": []}'::jsonb,
    images TEXT[] NOT NULL DEFAULT '{}',
    rating NUMERIC(2, 1) NOT NULL DEFAULT 5.0,
    reviews_count INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
    is_new_arrival BOOLEAN NOT NULL DEFAULT FALSE,
    is_on_sale BOOLEAN NOT NULL DEFAULT FALSE,
    discount_percent INT DEFAULT NULL,
    tags TEXT[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TABLA: PRODUCT_VARIANTS (Mililitros: Decants 5ml/10ml y Frascos 50/100ml)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    milliliters INT NOT NULL,
    label TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(10, 2) DEFAULT NULL,
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    sku TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- MÓDULO 3: OPERACIONES, KÁRDEX & AUDITORÍA
-- ============================================================================

-- 5. TABLA: STOCK_MOVEMENTS (Kárdex Contable y Trazabilidad de Mililitros)
CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    delta INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    reason TEXT NOT NULL CHECK (reason IN ('venta_whatsapp', 'reingreso_lote', 'ajuste_inventario', 'merma_rotura', 'muestra_tester', 'marcado_agotado')),
    reason_label TEXT NOT NULL,
    admin_name TEXT NOT NULL DEFAULT 'Super Admin',
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. TABLA: AUDIT_LOGS (Registro de Auditoría CIA - Integridad del Sistema)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- MÓDULO 4: SOCIAL PROOF, MARKETING & FIDELIZACIÓN
-- ============================================================================

-- 7. TABLA: REVIEWS (Reseñas y Valoraciones de Clientes)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    is_approved BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. TABLA: WISHLISTS (Lista de Deseos / Fragancias Guardadas)
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_product_wishlist UNIQUE (user_id, product_id)
);

-- 9. TABLA: DISCOUNTS (Cupones y Promociones)
CREATE TABLE IF NOT EXISTS public.discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    percentage INT NOT NULL CHECK (percentage > 0 AND percentage <= 100),
    description TEXT,
    min_subtotal NUMERIC(10, 2) DEFAULT 0,
    usage_limit INT DEFAULT NULL,
    per_user_limit INT NOT NULL DEFAULT 1,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. TABLA: COUPON_REDEMPTIONS (Control de Abuso de Cupones)
CREATE TABLE IF NOT EXISTS public.coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discount_id UUID NOT NULL REFERENCES public.discounts(id) ON DELETE CASCADE,
    order_id UUID,
    customer_phone TEXT NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- MÓDULO 5: VENTAS, PEDIDOS & LOGÍSTICA BOLIVIA
-- ============================================================================

-- 11. TABLA: SHIPPING_RATES (Cotizador de Envíos Nacionales)
CREATE TABLE IF NOT EXISTS public.shipping_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    department TEXT NOT NULL UNIQUE,
    city TEXT NOT NULL,
    cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estimated_days TEXT NOT NULL,
    free_shipping_above NUMERIC(10, 2) DEFAULT 400,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 12. TABLA: ORDERS (Órdenes de Compra y Pedidos)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_info JSONB NOT NULL,
    shipping_info JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'whatsapp_qr',
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. TABLA: ORDER_ITEMS (Detalle de Ítems Comprados)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    variant_label TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);

-- ============================================================================
-- MÓDULO 6: ATENCIÓN AL CLIENTE & SOPORTE
-- ============================================================================

-- 14. TABLA: CONTACT_INQUIRIES (Bandeja de Entrada de Contacto & Cotizaciones)
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'responded', 'archived')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ÍNDICES ESTRATÉGICOS (ALTO RENDIMIENTO & CONSULTAS RÁPIDAS)
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_family ON public.products(olfactory_family);
CREATE INDEX IF NOT EXISTS idx_products_gender ON public.products(gender);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_variant ON public.stock_movements(variant_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created ON public.stock_movements(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_coupon_redemptions_phone ON public.coupon_redemptions(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_contact_inquiries_status ON public.contact_inquiries(status);

-- ============================================================================
-- POLÍTICAS DE SEGURIDAD ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS en las 14 tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. BRANDS
CREATE POLICY "Public read active brands" ON public.brands
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access brands" ON public.brands
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 3. PRODUCTS
CREATE POLICY "Public read active products" ON public.products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access products" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 4. PRODUCT_VARIANTS
CREATE POLICY "Public read product variants" ON public.product_variants
    FOR SELECT USING (true);

CREATE POLICY "Admin full access variants" ON public.product_variants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 5. STOCK_MOVEMENTS
CREATE POLICY "Admin view stock movements" ON public.stock_movements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admin insert stock movements" ON public.stock_movements
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 6. AUDIT_LOGS
CREATE POLICY "Admin view audit logs" ON public.audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 7. REVIEWS
CREATE POLICY "Public read approved reviews" ON public.reviews
    FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can submit reviews" ON public.reviews
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin full access reviews" ON public.reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 8. WISHLISTS
CREATE POLICY "Users manage own wishlist" ON public.wishlists
    FOR ALL USING (auth.uid() = user_id);

-- 9. DISCOUNTS
CREATE POLICY "Public read active discounts" ON public.discounts
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access discounts" ON public.discounts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 10. COUPON_REDEMPTIONS
CREATE POLICY "Insert coupon redemptions" ON public.coupon_redemptions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin view coupon redemptions" ON public.coupon_redemptions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 11. SHIPPING_RATES
CREATE POLICY "Public read shipping rates" ON public.shipping_rates
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin full access shipping rates" ON public.shipping_rates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 12. ORDERS
CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public can insert orders" ON public.orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin full access orders" ON public.orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 13. ORDER_ITEMS
CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR orders.user_id IS NULL)
        )
    );

CREATE POLICY "Public can insert order items" ON public.order_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin full access order items" ON public.order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 14. CONTACT_INQUIRIES
CREATE POLICY "Public can submit contact inquiries" ON public.contact_inquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin manage contact inquiries" ON public.contact_inquiries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
