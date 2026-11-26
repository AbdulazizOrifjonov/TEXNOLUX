import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const mockDataPath = path.join(ROOT_DIR, 'frontend', 'src', 'services', 'mockData.js');

async function generateSQL() {
  const { defaultCategories, defaultProducts } = await import(pathToFileURL(mockDataPath).href);

  let sql = `-- ==============================================================================
-- SPORT OUTLET — FULL SUPABASE DATABASE SCHEMA & SPORT PRODUCTS SEED SCRIPT
-- Copy and paste this ENTIRE code into Supabase SQL Editor and click RUN.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT DEFAULT 'Folder',
    description TEXT DEFAULT '',
    image TEXT DEFAULT '',
    parent_id TEXT DEFAULT NULL,
    display_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    sku TEXT DEFAULT '',
    description TEXT DEFAULT '',
    price NUMERIC NOT NULL,
    old_price NUMERIC DEFAULT 0,
    discount_percent INT DEFAULT 0,
    category TEXT NOT NULL,
    category_slug TEXT NOT NULL,
    subcategory TEXT DEFAULT '',
    brand TEXT DEFAULT 'SPORT OUTLET',
    stock INT DEFAULT 10,
    in_stock BOOLEAN DEFAULT TRUE,
    rating NUMERIC DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    images JSONB DEFAULT '[]'::jsonb,
    variants JSONB DEFAULT '[]'::jsonb,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_weekly_deal BOOLEAN DEFAULT FALSE,
    specifications JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    city TEXT DEFAULT 'Buxoro',
    address TEXT DEFAULT '',
    delivery_type TEXT DEFAULT 'standard',
    delivery_fee NUMERIC DEFAULT 0,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT DEFAULT 'cash',
    payment_status TEXT DEFAULT 'pending',
    order_status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    rating NUMERIC DEFAULT 5.0,
    comment TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT DEFAULT '',
    badge TEXT DEFAULT '',
    image TEXT DEFAULT '',
    link TEXT DEFAULT '/shop',
    type TEXT DEFAULT 'hero',
    bg_color TEXT DEFAULT '#000000',
    text_color TEXT DEFAULT '#ffffff',
    display_order INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_percent INT NOT NULL,
    expiry_date TIMESTAMPTZ,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Drop old policies to prevent conflict
DROP POLICY IF EXISTS "Public Categories Select" ON public.categories;
DROP POLICY IF EXISTS "Public Products Select" ON public.products;
DROP POLICY IF EXISTS "Public Banners Select" ON public.banners;
DROP POLICY IF EXISTS "Public Coupons Select" ON public.coupons;
DROP POLICY IF EXISTS "Public Reviews Select" ON public.reviews;
DROP POLICY IF EXISTS "Public Orders Select" ON public.orders;
DROP POLICY IF EXISTS "Admin All Products" ON public.products;
DROP POLICY IF EXISTS "Admin All Categories" ON public.categories;
DROP POLICY IF EXISTS "Admin All Orders" ON public.orders;
DROP POLICY IF EXISTS "Admin All Reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admin All Banners" ON public.banners;
DROP POLICY IF EXISTS "Admin All Coupons" ON public.coupons;

CREATE POLICY "Public Categories Select" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Products Select" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Banners Select" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Public Coupons Select" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public Reviews Select" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public Orders Select" ON public.orders FOR SELECT USING (true);

CREATE POLICY "Admin All Products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Banners" ON public.banners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Coupons" ON public.coupons FOR ALL USING (true) WITH CHECK (true);

-- STORAGE BUCKET: product-images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Storage Read" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Storage Manage" ON storage.objects;

CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public Storage Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Public Storage Manage" ON storage.objects FOR ALL USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');

-- SEED CATEGORIES
`;

  for (const cat of defaultCategories) {
    const escName = (cat.name || '').replace(/'/g, "''");
    const escDesc = (cat.description || '').replace(/'/g, "''");
    const escIcon = (cat.icon || 'Folder').replace(/'/g, "''");
    const escImage = (cat.image || '').replace(/'/g, "''");
    sql += `INSERT INTO public.categories (id, name, slug, icon, description, image, display_order, active)
VALUES ('${cat.id}', '${escName}', '${cat.slug}', '${escIcon}', '${escDesc}', '${escImage}', ${cat.order || 1}, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, description = EXCLUDED.description, image = EXCLUDED.image;\n`;
  }

  sql += `\n-- SEED PRODUCTS\n`;

  for (const p of defaultProducts) {
    const id = p.id || p._id;
    const escTitle = (p.title || '').replace(/'/g, "''");
    const escSlug = (p.slug || '').replace(/'/g, "''");
    const escSku = (p.sku || '').replace(/'/g, "''");
    const escDesc = (p.description || '').replace(/'/g, "''");
    const escCat = (p.category || '').replace(/'/g, "''");
    const escCatSlug = (p.categorySlug || p.category_slug || '').replace(/'/g, "''");
    const escSubcat = (p.subcategory || '').replace(/'/g, "''");
    const escBrand = (p.brand || 'SPORT OUTLET').replace(/'/g, "''");
    const price = Number(p.price || 0);
    const oldPrice = Number(p.oldPrice || p.old_price || 0);
    const discount = Number(p.discountPercent || p.discount_percent || 0);
    const stock = Number(p.stock !== undefined ? p.stock : 10);
    const inStock = p.inStock !== undefined ? Boolean(p.inStock) : (stock > 0);
    const rating = Number(p.rating || 5.0);
    const reviewsCount = Number(p.reviewsCount || p.reviews_count || 0);
    const isBestseller = Boolean(p.isBestseller || p.is_bestseller);
    const isNewArrival = Boolean(p.isNewArrival || p.is_new_arrival);
    const isWeeklyDeal = Boolean(p.isWeeklyDeal || p.is_weekly_deal);
    const imagesJson = JSON.stringify(p.images || []).replace(/'/g, "''");
    const variantsJson = JSON.stringify(p.variants || []).replace(/'/g, "''");
    const specsJson = JSON.stringify(p.specifications || []).replace(/'/g, "''");

    sql += `INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('${id}', '${escTitle}', '${escSlug}', '${escSku}', '${escDesc}', ${price}, ${oldPrice}, ${discount}, '${escCat}', '${escCatSlug}', '${escSubcat}', '${escBrand}', ${stock}, ${inStock}, ${rating}, ${reviewsCount}, '${imagesJson}'::jsonb, '${variantsJson}'::jsonb, ${isBestseller}, ${isNewArrival}, ${isWeeklyDeal}, '${specsJson}'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;\n`;
  }

  const outPath = path.join(ROOT_DIR, 'supabase_sport_setup.sql');
  fs.writeFileSync(outPath, sql, 'utf8');
  console.log('Successfully generated:', outPath);
}

generateSQL().catch(console.error);
