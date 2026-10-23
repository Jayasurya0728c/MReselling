-- ==============================================================================
-- Nammude Picks - Supabase Database Schema & Row Level Security (RLS)
-- Free PostgreSQL Setup for Reselling E-Commerce Store
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PRODUCTS TABLE (Publicly viewable catalogue)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    short_description TEXT,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(10,2) CHECK (compare_at_price IS NULL OR compare_at_price >= price),
    image TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    variants JSONB DEFAULT '[]'::jsonb,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_trending BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by slug and category
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products(is_published);

-- 3. PRODUCT SUPPLIER INFO TABLE (CONFIDENTIAL - Strictly Admin only)
-- Stores private supplier costs, Meesho URLs, and supplier notes.
-- Public anon users CANNOT select from this table under any circumstances!
CREATE TABLE IF NOT EXISTS public.product_supplier_info (
    product_id UUID PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
    supplier_cost NUMERIC(10,2) CHECK (supplier_cost >= 0),
    supplier_url TEXT,
    supplier_sku TEXT,
    supplier_notes TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS TABLE (Customer COD Requests)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL CHECK (LENGTH(customer_phone) >= 10),
    house_name TEXT NOT NULL,
    street_locality TEXT NOT NULL,
    post_office TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT DEFAULT 'Kerala',
    pincode TEXT NOT NULL CHECK (LENGTH(pincode) = 6),
    delivery_instructions TEXT,
    subtotal NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT DEFAULT 'Cash on Delivery (COD)',
    status TEXT DEFAULT 'New Request' CHECK (
        status IN (
            'New Request',
            'Awaiting Customer Confirmation',
            'Confirmed',
            'Supplier Order Placed',
            'Shipped',
            'Delivered',
            'Cancelled',
            'Return Requested',
            'Refund Pending',
            'Refunded'
        )
    ),
    supplier_order_ref TEXT DEFAULT '',
    tracking_number TEXT DEFAULT '',
    admin_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(reference);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT,
    product_name TEXT NOT NULL,
    variant TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- 6. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default_store_settings',
    store_name TEXT NOT NULL DEFAULT 'Nammude Picks',
    tagline TEXT DEFAULT 'Nalla Finds. Nalla Prices.',
    whatsapp_number TEXT NOT NULL DEFAULT '91YOURWHATSAPPNUMBER',
    instagram_url TEXT DEFAULT 'https://instagram.com/nammudepicks',
    contact_email TEXT DEFAULT 'support@nammudepicks.in',
    announcement_text TEXT DEFAULT '✨ Special Kerala Offer: Free Delivery on orders above ₹999 | Cash on Delivery (COD) Available!',
    delivery_fee NUMERIC(10,2) DEFAULT 49,
    free_shipping_threshold NUMERIC(10,2) DEFAULT 999,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial store settings if not exists
INSERT INTO public.store_settings (id, store_name, tagline, whatsapp_number, instagram_url, contact_email, announcement_text, delivery_fee, free_shipping_threshold)
VALUES (
    'default_store_settings',
    'Nammude Picks',
    'Nalla Finds. Nalla Prices.',
    '91YOURWHATSAPPNUMBER',
    'https://instagram.com/nammudepicks',
    'support@nammudepicks.in',
    '✨ Special Kerala Offer: Free Delivery on orders above ₹999 | Cash on Delivery (COD) Available!',
    49,
    999
)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_supplier_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- PRODUCTS POLICIES
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view published products' AND tablename = 'products') THEN
        CREATE POLICY "Public can view published products"
            ON public.products
            FOR SELECT
            USING (is_published = true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view all products' AND tablename = 'products') THEN
        CREATE POLICY "Admins can view all products"
            ON public.products
            FOR SELECT
            TO authenticated
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can insert products' AND tablename = 'products') THEN
        CREATE POLICY "Admins can insert products"
            ON public.products
            FOR INSERT
            TO authenticated
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update products' AND tablename = 'products') THEN
        CREATE POLICY "Admins can update products"
            ON public.products
            FOR UPDATE
            TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can delete products' AND tablename = 'products') THEN
        CREATE POLICY "Admins can delete products"
            ON public.products
            FOR DELETE
            TO authenticated
            USING (true);
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- PRODUCT SUPPLIER INFO POLICIES (STRICT CONFIDENTIALITY)
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins full access to supplier info' AND tablename = 'product_supplier_info') THEN
        CREATE POLICY "Admins full access to supplier info"
            ON public.product_supplier_info
            FOR ALL
            TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- ORDERS POLICIES
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can submit new orders' AND tablename = 'orders') THEN
        CREATE POLICY "Public can submit new orders"
            ON public.orders
            FOR INSERT
            TO anon, authenticated
            WITH CHECK (status = 'New Request');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view orders' AND tablename = 'orders') THEN
        CREATE POLICY "Admins can view orders"
            ON public.orders
            FOR SELECT
            TO authenticated
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update orders' AND tablename = 'orders') THEN
        CREATE POLICY "Admins can update orders"
            ON public.orders
            FOR UPDATE
            TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- ORDER ITEMS POLICIES
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert order items' AND tablename = 'order_items') THEN
        CREATE POLICY "Public can insert order items"
            ON public.order_items
            FOR INSERT
            TO anon, authenticated
            WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can view order items' AND tablename = 'order_items') THEN
        CREATE POLICY "Admins can view order items"
            ON public.order_items
            FOR SELECT
            TO authenticated
            USING (true);
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- STORE SETTINGS POLICIES
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view store settings' AND tablename = 'store_settings') THEN
        CREATE POLICY "Public can view store settings"
            ON public.store_settings
            FOR SELECT
            USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update store settings' AND tablename = 'store_settings') THEN
        CREATE POLICY "Admins can update store settings"
            ON public.store_settings
            FOR UPDATE
            TO authenticated
            USING (true)
            WITH CHECK (true);
    END IF;
END $$;

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION FOR PRODUCT IMAGES
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view product images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public can view product images"
            ON storage.objects
            FOR SELECT
            USING (bucket_id = 'product-images');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can upload product images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admins can upload product images"
            ON storage.objects
            FOR INSERT
            TO authenticated
            WITH CHECK (bucket_id = 'product-images');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update product images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admins can update product images"
            ON storage.objects
            FOR UPDATE
            TO authenticated
            USING (bucket_id = 'product-images');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can delete product images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admins can delete product images"
            ON storage.objects
            FOR DELETE
            TO authenticated
            USING (bucket_id = 'product-images');
    END IF;
END $$;
