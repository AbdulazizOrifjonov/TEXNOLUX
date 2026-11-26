-- ==============================================================================
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
INSERT INTO public.categories (id, name, slug, icon, description, image, display_order, active)
VALUES ('cat_trenajorlar', 'Trenajorlar & Kardio', 'trenajorlar', 'Activity', 'Professional zal va uy uchun yugurish yo‘lakchalari, velotrenajorlar va kardiomashinalar', 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&auto=format&fit=crop&q=80', 1, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, description = EXCLUDED.description, image = EXCLUDED.image;
INSERT INTO public.categories (id, name, slug, icon, description, image, display_order, active)
VALUES ('cat_gantellar', 'Gantellar & Shtangalar', 'gantellar', 'Dumbbell', 'Kauchukli va xromli gantellar, shtanga griflari va og‘ir atletika disklari', 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80', 2, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, description = EXCLUDED.description, image = EXCLUDED.image;
INSERT INTO public.categories (id, name, slug, icon, description, image, display_order, active)
VALUES ('cat_stoykalar', 'Podstavka & Skameykalar', 'stoykalar', 'Layers', 'Gantel podstavkalari, mashg‘ulot skameykalari, turnik va shtanga stoykalari', '/uploads/gantel-podstavka-sc80263.png', 3, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, description = EXCLUDED.description, image = EXCLUDED.image;
INSERT INTO public.categories (id, name, slug, icon, description, image, display_order, active)
VALUES ('cat_sport-kiyimlari', 'Sport Kiyimlari', 'sport-kiyimlari', 'Shirt', 'Nafas oluvchi termo sport kostyumlari, zal liboslari, hudilar va futbolkalar', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80', 4, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, description = EXCLUDED.description, image = EXCLUDED.image;
INSERT INTO public.categories (id, name, slug, icon, description, image, display_order, active)
VALUES ('cat_krossovkalar', 'Krossovkalar & Poyabzal', 'krossovkalar', 'Footprints', 'Nike, Jordan, Adidas original yugurish va fitnes krossovkalari', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80', 5, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, description = EXCLUDED.description, image = EXCLUDED.image;
INSERT INTO public.categories (id, name, slug, icon, description, image, display_order, active)
VALUES ('cat_fitnes-aksessuarlari', 'Fitnes Aksessuarlari', 'fitnes-aksessuarlari', 'Award', 'Sport sumkalari, fitnes rezinkalari, mashg‘ulot qo‘lqoplari va gilamchalar', 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop&q=80', 6, true)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, description = EXCLUDED.description, image = EXCLUDED.image;

-- SEED PRODUCTS
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_grif-trep-0405', 'Grif  Trep', 'grif-trep-0405', '', 'Vazni : 22.5kg
Narxi: 95$', 1220750, 1403863, 13, 'Gantellar & Shtangalar', 'gantellar', '', 'Sport Line', 15, true, 5, 0, '["/uploads/prod_grif-trep-4765_1.jpg","/uploads/prod_grif-trep-4765_2.jpg","/uploads/prod_grif-trep-4765_3.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kodi","value":"SPORT-OUTLET"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_masaj-kreslo-a31a-5163', 'MASAJ KRESLO A31A', 'masaj-kreslo-a31a-5163', '', 'Madel: A002 black brown
Narxi : 730$
➖ Maks foydalanuvchi vazni: 150kg
➖ Gravitasiya rejimi (vazinsizlik)
➖ To''liq tana massaji havo bosimi orqali masaj qlinadi  va 16 etapda  intensivligi sozlanadi
➖ Tovonlarni rolik orqaki masaj qilish
➖ Belni qizdirish orqali masaj qilish funksiyasi.
➖ Havo yostig''ini siqish orqali oyoq va tovonlar masaji.
➖ Oyoq va bel  isitish funksiyasi.
➖Yelkaning holatini aniqlash va masaj qilish funksiyasi
➖16 ta avto masaj va 4 ta qolda boshqariladgan masaj turi', 9380500, 10787575, 13, 'Podstavka & Skameykalar', 'stoykalar', '', 'Sport Line', 15, true, 5, 0, '["/uploads/prod_masaj-kreslo-5140_2.jpg","/uploads/prod_masaj-kreslo-5140_3.jpg","/uploads/prod_masaj-kreslo-5140_4.jpg","/uploads/prod_masaj-kreslo-5140_5.jpg","/uploads/prod_masaj-kreslo-5140_6.jpg","/uploads/prod_masaj-kreslo-5140_7.jpg","/uploads/prod_masaj-kreslo-a31a-5331_1.jpg","/uploads/prod_masaj-kreslo-a31a-5331_2.jpg","/uploads/prod_masaj-kreslo-a31a-5331_3.jpg","/uploads/prod_masaj-kreslo-a31a-5331_4.jpg","/uploads/prod_masaj-kreslo-a31a-5331_5.jpg","/uploads/prod_masaj-kreslo-a31a-5331_6.jpg","/uploads/prod_masaj-kreslo-a31a-5331_7.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kodi","value":"SPORT-OUTLET"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_masaj-kreslo-am183-4117', 'Masaj kreslo AM183', 'masaj-kreslo-am183-4117', '', 'Narxi : 970$ Black
➖ Maks foydalanuvchi vazni: 150kg
➖ 3D massaj roliklari
➖ Gravitasiya rejimi (vazinsizlik)
➖ Tanani skanerlash va mos massaj qilish tizimi
➖ Belni isitadi
➖ Simsiz telefonni quvvatlash va smartfonda vide ko''rish mumkin
➖  Bluetooth orqali yon tomonlarida audio eshitish
➖ Barmoq orqali salomatlik diagnozi
➖ 12 ta avtomatik va 8 ta ruchnoy massaj rejimlari
➖ Havoli massaj yostiqchalari
➖  Ovozli va sensor displeyli boshqaruv', 12464500, 14334175, 13, 'Boks & Yakka Kurash', 'boks-yakka-kurash', '', 'Sport Line', 15, true, 5, 0, '["/uploads/prod_masaj-kreslo-am183-5185_1.jpg","/uploads/prod_masaj-kreslo-am183-5185_2.jpg","/uploads/prod_masaj-kreslo-am183-5185_3.jpg","/uploads/prod_masaj-kreslo-am183-5185_4.jpg","/uploads/prod_masaj-kreslo-am183-5185_5.jpg","/uploads/prod_masaj-kreslo-am183-5185_6.jpg","/uploads/prod_masaj-kreslo-am183-5185_7.jpg","/uploads/prod_masaj-kreslo-6358_1.jpg","/uploads/prod_masaj-kreslo-6358_2.jpg","/uploads/prod_masaj-kreslo-6358_3.jpg","/uploads/prod_masaj-kreslo-6358_4.jpg","/uploads/prod_masaj-kreslo-6358_5.jpg","/uploads/prod_masaj-kreslo-6358_6.jpg","/uploads/prod_masaj-kreslo-5132_1.jpg","/uploads/prod_masaj-kreslo-5132_2.jpg","/uploads/prod_masaj-kreslo-5132_3.jpg","/uploads/prod_masaj-kreslo-5132_4.jpg","/uploads/prod_masaj-kreslo-5132_5.jpg","/uploads/prod_masaj-kreslo-5132_6.jpg","/uploads/prod_masaj-kreslo-5132_7.jpg","/uploads/prod_masaj-kreslo-5146_1.jpg","/uploads/prod_masaj-kreslo-5146_2.jpg","/uploads/prod_masaj-kreslo-5146_3.jpg","/uploads/prod_masaj-kreslo-5146_4.jpg","/uploads/prod_masaj-kreslo-5146_5.jpg","/uploads/prod_masaj-kreslo-5146_6.jpg","/uploads/prod_masaj-kreslo-5146_7.jpg","/uploads/prod_masaj-kreslo-5152_1.jpg","/uploads/prod_masaj-kreslo-5152_2.jpg","/uploads/prod_masaj-kreslo-5152_3.jpg","/uploads/prod_masaj-kreslo-5152_4.jpg","/uploads/prod_masaj-kreslo-5152_5.jpg","/uploads/prod_masaj-kreslo-5152_6.jpg","/uploads/prod_masaj-kreslo-5152_7.jpg","/uploads/prod_masaj-kreslo-am183-5195_1.jpg","/uploads/prod_masaj-kreslo-am183-5195_2.jpg","/uploads/prod_masaj-kreslo-am183-5195_3.jpg","/uploads/prod_masaj-kreslo-am183-5195_4.jpg","/uploads/prod_masaj-kreslo-am183-5195_5.jpg","/uploads/prod_masaj-kreslo-am183-5195_6.jpg","/uploads/prod_masaj-kreslo-am183-5195_7.jpg","/uploads/prod_masaj-kreslo-am183-5149_1.jpg","/uploads/prod_masaj-kreslo-am183-5149_2.jpg","/uploads/prod_masaj-kreslo-am183-5149_3.jpg","/uploads/prod_masaj-kreslo-am183-5149_4.jpg","/uploads/prod_masaj-kreslo-am183-5149_5.jpg","/uploads/prod_masaj-kreslo-am183-5149_6.jpg","/uploads/prod_masaj-kreslo-am183-5149_7.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kodi","value":"SPORT-OUTLET"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_gantel-podstavka-xitoy-7222', 'Gantel podstavka xitoy', 'gantel-podstavka-xitoy-7222', '', 'Model: MD6244
Narxi: 335$✅', 4304750, 4950463, 13, 'Podstavka & Skameykalar', 'stoykalar', '', 'Sport Line', 15, true, 5, 0, '["/uploads/prod_gantel-podstavka-xitoy-5056_1.jpg","/uploads/prod_gantel-podstavka-xitoy-5056_2.jpg","/uploads/prod_gantel-podstavka-xitoy-5056_3.jpg","/uploads/prod_gantel-podstavka-xitoy-5056_4.jpg","/uploads/prod_gantel-podstavka-xitoy-5056_5.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kodi","value":"SPORT-OUTLET"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_masaj-kreslo-g6-0119', 'Masaj kreslo G6', 'masaj-kreslo-g6-0119', '', 'Narxi: 1030$
➖ Maks foydalanuvchi vazni: 150kg
➖ 135 smlik butun tana uchun SL massaj relyesi
➖  2D massaj roliklari
➖  Gravitasiya rejimi (tepaga ko''taradi)
➖  Tanani skanerlash va mos massaj qilish tizimi
➖ Belni isitadi
➖ Simsiz telefonni quvvatlash va smartfonda vide ko''rish mumkin
➖  Bluetooth orqali yon tomonlarida audio eshitish
➖ Barmoq orqali salomatlik diagnozi
➖  12 ta avtomatik va 8 ta ruchnoy massaj rejimlari
➖ Havoli massaj yostiqchalari
➖  Ovozli va sensor displeyli boshqaruv', 13235500, 15220825, 13, 'Boks & Yakka Kurash', 'boks-yakka-kurash', '', 'Sport Line', 15, true, 5, 0, '["/uploads/prod_masaj-kreslo-g6-5170_1.jpg","/uploads/prod_masaj-kreslo-g6-5170_2.jpg","/uploads/prod_masaj-kreslo-g6-5170_3.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kodi","value":"SPORT-OUTLET"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_gantel-lb-podstavka-2668', 'Gantel lb podstavka', 'gantel-lb-podstavka-2668', '0449641', 'Kodi: 0449641
Narxi: 160$✅', 2056000, 2364400, 13, 'Podstavka & Skameykalar', 'stoykalar', '', 'Sport Line', 15, true, 5, 0, '["/uploads/prod_gantel-lb-podstavka-5222_1.jpg","/uploads/prod_gantel-lb-podstavka-5222_2.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kodi","value":"0449641"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_masaj-kreslo-ax-1007-4308', 'Masaj kreslo AX-1007', 'masaj-kreslo-ax-1007-4308', '', 'Narxi: 1550$
➖Tanani skanerlash va moslashib massaj qilish
➖ Barmoq orqali salomatlik diagnozi
➖ Vaznsizlik rejimi: tanadagi bosimni butunlay bo''shatish
➖ Tailandcha chigal yozish rejimi mavjud.
➖ Belni qizdirish
➖ Simsiz telefonni quvvatlash
➖ Maks foydalanuvchi vazni: 150kg
➖  Bluetooth orqali audio musiqa eshitish', 19917500, 22905125, 13, 'Boks & Yakka Kurash', 'boks-yakka-kurash', '', 'Sport Line', 15, true, 5, 0, '["/uploads/prod_masaj-kreslo-ax-1007-3313_1.jpg","/uploads/prod_masaj-kreslo-ax-1007-3313_2.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kodi","value":"SPORT-OUTLET"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_grif-zig-zag-1-2m-sc-80187-5299', 'Grif zig zag 1.2m sc-80187', 'grif-zig-zag-1-2m-sc-80187-5299', '0463075', 'Kodi: 0463075
Narxi: 33$', 424050, 487657, 13, 'Gantellar & Shtangalar', 'gantellar', '', 'Sport Line', 15, true, 5, 0, '["/uploads/prod_grif-zig-zag-1-2m-sc-80187-5201_1.jpg","/uploads/prod_grif-zig-zag-1-2m-sc-80187-5201_2.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kodi","value":"0463075"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_grif-zig-zag-sc-80188-120cm-7823', 'Grif zig zag sc-80188 120cm', 'grif-zig-zag-sc-80188-120cm-7823', '', 'Uzunligi : 1.2m
Narxi : 20$', 257000, 295550, 13, 'Gantellar & Shtangalar', 'gantellar', '', 'Sport Line', 15, true, 5, 0, '["/uploads/prod_grif-zig-zag-sc-80188-120cm-5249_1.jpg","/uploads/prod_grif-zig-zag-sc-80188-120cm-5249_2.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kodi","value":"SPORT-OUTLET"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_grif-zig-zag-sc-80189-150cm-9702', 'Grif zig zag sc-80189 150cm', 'grif-zig-zag-sc-80189-150cm-9702', '', 'Uzunligi: 1.5m
Narxi : 24$', 308400, 354660, 13, 'Gantellar & Shtangalar', 'gantellar', '', 'Sport Line', 15, true, 5, 0, '["/uploads/prod_grif-zig-zag-sc-80189-150cm-5178_1.jpg","/uploads/prod_grif-zig-zag-sc-80189-150cm-5178_2.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kodi","value":"SPORT-OUTLET"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_grif-zig-zag-1-2m-sc-80186-0900', 'Grif zig zag  1.2m sc-80186', 'grif-zig-zag-1-2m-sc-80186-0900', '0462910', 'Kodi: 0462910
Narxi : 32$', 411200, 472880, 13, 'Gantellar & Shtangalar', 'gantellar', '', 'Sport Line', 15, true, 5, 0, '["/uploads/prod_grif-zig-zag-1-2m-sc-80186-5228_1.jpg","/uploads/prod_grif-zig-zag-1-2m-sc-80186-5228_2.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kodi","value":"0462910"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_masaj-kreslo-ax-1008-1478', 'Masaj kreslo AX-1008', 'masaj-kreslo-ax-1008-1478', '', 'Narxi: 1210$
➖Tanani skanerlash va moslashib massaj qilish
➖ Barmoq orqali salomatlik diagnozi
➖ Belni qizdirish
➖ Tailandcha chigal yozish rejimi mavjud.
➖ Simsiz telefonni quvvatlash
➖ Maks foydalanuvchi vazni: 150kg
➖  Bluetooth orqali yon tomonlarida audio musiqa eshitish mumkin1. Foydalanuvchi Maks.', 15548500, 17880775, 13, 'Boks & Yakka Kurash', 'boks-yakka-kurash', '', 'Sport Line', 15, true, 5, 0, '["/uploads/prod_masaj-kreslo-ax-1008-5164_1.jpg","/uploads/prod_masaj-kreslo-ax-1008-5164_2.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kodi","value":"SPORT-OUTLET"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_masaj-kreslo-ax-1006-3900', 'Masaj kreslo AX-1006', 'masaj-kreslo-ax-1006-3900', '', 'Narxi: 1630$
➖Tanani skanerlash va moslashib massaj qilish
➖ Barmoq orqali salomatlik diagnozi
➖ Vaznsizlik rejimi: tanadagi bosimni butunlay bo''shatish
➖ Tailandcha chigal yozish rejimi mavjud.
➖ Belni qizdirish
➖ Simsiz telefonni quvvatlash
➖ Maks foydalanuvchi vazni: 150kg
➖  Bluetooth orqali yon tomonlarida audio musiqa eshitish mumkin', 20945500, 24087325, 13, 'Boks & Yakka Kurash', 'boks-yakka-kurash', '', 'Sport Line', 15, true, 5, 0, '["/uploads/prod_masaj-kreslo-ax-1006-5190_1.jpg","/uploads/prod_masaj-kreslo-ax-1006-5190_2.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kodi","value":"SPORT-OUTLET"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_grif-olimpiski-8994', 'Grif olimpiski', 'grif-olimpiski-8994', '8444261', 'Kodi: 8444261
Uzunligi 2.2m
Ko''tarish og''irligi 1500LB ( 680kg )
O''zini vazni : 20kg
Podchivnikli
Narxi : 120$', 1542000, 1773300, 13, 'Gantellar & Shtangalar', 'gantellar', '', 'Sport Line', 15, true, 5, 0, '["/uploads/prod_grif-olimpiski-5214_1.jpg","/uploads/prod_grif-olimpiski-5214_2.jpg","/uploads/prod_grif-olimpiski-5301_1.jpg","/uploads/prod_grif-olimpiski-5301_2.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kodi","value":"SPORT-OUTLET"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_masaj-kreslo-m11b-0982', 'Masaj kreslo M11B', 'masaj-kreslo-m11b-0982', '', 'Narxi : 550$
1. Foydalanuvchi Maks. Vazni: 150 kg
2.Massaj texnologiyasi 3D, mushaklarning ishlashi uchun roliklarni turli burchaklarda aylantirish mumkin. Terapevtining harakatlarini taqlid qiluvchi 4 ta massaj roliklari.
3. Havoli-kompression massaj uchun qo’l, yelka, boldir va tovon sohalarida 16 ta havo yostiqchalari o’rnatilgan, ularni ta’sir intensivligini sozlash mumkin.
4.Massaj roliklari uchta rejimda ishlashi mumkin - shiatsu, tuina va dam oldiruvchi.
5. 5 ta avtomatik dastur mavjud - komfort, uyqu, dam olish, yangilanish va tiklanish. Tailandcha chigal yozish alohida rejimi mavjud.
6. 5 ta qo’shimcha rejim - shiatsu, mushtlash, silash, cho’zish va shapaloqlash. Ushbu rejimlarda siz ma''lum bir massaj maydonini tanlashingiz, roliklarning tezligini va havo yostiqlarining intensivligini sozlashingiz mumkin. 12 ta aralash massaj uslubi
7. Massaj sohalari: bo’yin, yelkalar, qo’llar, bel, son, dumba, boldir, tovonlar', 7067500, 8127625, 13, 'Boks & Yakka Kurash', 'boks-yakka-kurash', '', 'Sport Line', 12, true, 5, 0, '["/uploads/prod_masaj-kreslo-m11b-5156_1.jpg","/uploads/prod_masaj-kreslo-m11b-5156_2.jpg","/uploads/prod_masaj-kreslo-m11b-5156_3.jpg","/uploads/prod_masaj-kreslo-m11b-5156_4.jpg","/uploads/prod_masaj-kreslo-m11b-5156_5.jpg","/uploads/prod_masaj-kreslo-m11b-5156_6.jpg","/uploads/prod_masaj-kreslo-m11b-5156_7.jpg","/uploads/prod_masaj-kreslo-m11b-0158.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kodi","value":"SPORT-OUTLET"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_stol-tennis-k2008-6770', 'Stol Tennis: K2008', 'stol-tennis-k2008-6770', '', 'ITTF standartidan o''tgan
25 mm MDF ustki qismi
Ramka 60 mm
Oyoqlari 50x50 mm
100 mm diametrli g''ildiraklar
Narxi: 750$', 9600000, 11000000, 13, 'Futbol & To‘plar', 'toplar-oyinlar', '', 'Sport Line', 10, true, 5, 0, '["/uploads/prod_stol-tennis-k2008-6770.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_tatami-1x1m-2-sm-rangi-qizik-ko-k-narxi-12-5-9157', 'Professional Tatami 1x1m (Sport Qoplamasi)', 'professional-tatami-1x1m', '', 'Professional Tatami 1x1m sport qoplamasi. Qalinliklari: 2 sm, 2.5 sm, 3 sm, 4 sm. Rangi: Qizil-ko‘k, Sariq-yashil, Seriy-qora ikki tomonlama qoplama. Boks, dzyudo, karate, taekvondo va fitnes zallari uchun xavfsiz va qulay qoplama.', 160000, 185000, 13, 'Boks & Yakka Kurash', 'boks-yakka-kurash', '', 'Sport Line', 10, true, 5, 0, '["/uploads/prod_tatami-1x1m-2-sm-rangi-qizik-ko-k-narxi-12-5-9157.jpg","/uploads/prod_yangi-mahsulot-1141.jpg","/uploads/prod_yangi-mahsulot-4815.jpg","/uploads/prod_yangi-mahsulot-5248.jpg","/uploads/prod_yangi-mahsulot-6210.jpg"]'::jsonb, '[{"id":"var_2sm","name":"2 sm","fullName":"Tatami 1x1m (Qalinligi: 2 sm)","price":160000,"oldPrice":185000,"priceUSD":12.5,"colors":["Qizil-ko‘k"]},{"id":"var_2_5sm","name":"2.5 sm","fullName":"Tatami 1x1m (Qalinligi: 2.5 sm)","price":173000,"oldPrice":200000,"priceUSD":13.5,"colors":["Sariq-yashil","Qizil-ko‘k","Seriy-qora"]},{"id":"var_3sm","name":"3 sm","fullName":"Tatami 1x1m (Qalinligi: 3 sm)","price":180000,"oldPrice":210000,"priceUSD":14,"colors":["Qizil-ko‘k"]},{"id":"var_4sm","name":"4 sm","fullName":"Tatami 1x1m (Qalinligi: 4 sm)","price":218000,"oldPrice":250000,"priceUSD":17,"colors":["Qizil-ko‘k","Sariq-yashil","Seriy-qora"]}]'::jsonb, true, true, false, '[{"label":"O‘lchami","value":"1m x 1m"},{"label":"Qalinligi","value":"2 sm dan 4 sm gacha"},{"label":"Mavjud ranglar","value":"Qizil-ko‘k, Sariq-yashil, Seriy-qora"},{"label":"Qulflanish turi","value":"Qaldirg‘och dum (pazel) qulf"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_gantel-podstavka-an-001-8998', 'Gantel podstavka an-001', 'gantel-podstavka-an-001-8998', '0455407', 'Kodi: 0455407
Narxi: 290$', 3712000, 4250000, 13, 'Podstavka & Skameykalar', 'stoykalar', '', 'Sport Line', 10, true, 5, 0, '["/uploads/prod_gantel-podstavka-an-001-8998.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_gantel-podstavka-ax003-2670', 'Gantel podstavka AX003', 'gantel-podstavka-ax003-2670', '', 'Sigimi: 6 par gantel
Narxi: 195$', 2496000, 2850000, 13, 'Podstavka & Skameykalar', 'stoykalar', '', 'Sport Line', 10, true, 5, 0, '["/uploads/prod_gantel-podstavka-ax003-2670.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_gantel-podstavka-sc80262-4326', 'Gantel podstavka SC80262', 'gantel-podstavka-sc80262-4326', '0455598', 'Kodi: 0455598
Narxi: 95$', 1216000, 1400000, 13, 'Podstavka & Skameykalar', 'stoykalar', '', 'Sport Line', 10, true, 5, 0, '["/uploads/prod_gantel-podstavka-sc80262-4326.jpg"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Sport Line"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo‘ylab bepul"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_gantel-podstavka-sc80263', 'Gantel podstavka SC80263', 'gantel-podstavka-sc80263', '0455763', 'Gantel podstavka SC80263 (Kodi: 0455763, Narxi: 75$). Mustahkam po''lat konstruksiyaga ega professional gantel qo''yish stoykasi. A-shaklli qulay va ixcham dizayn, gantellarni tartibli saqlash uchun mo''ljallangan. Buxoro bo''yicha tezkor yetkazib berish.', 960000, 1100000, 13, 'Podstavka & Skameykalar', 'stoykalar', 'Gantel Stoykalari', 'Sport Line', 15, true, 5, 8, '["/uploads/gantel-podstavka-sc80263.png"]'::jsonb, '[]'::jsonb, true, true, true, '[{"label":"Model","value":"SC80263"},{"label":"Mahsulot kodi","value":"0455763"},{"label":"Narxi (USD)","value":"75$"},{"label":"Material","value":"Mustahkam qotishma po''lat (Black powder coating)"},{"label":"Shakl","value":"A-Frame ixcham va xavfsiz dizayn"},{"label":"Sig''imi","value":"6 juft gantellar uchun maxsus qavslar"},{"label":"Kafolat","value":"1 yil rasmiy kafolat"},{"label":"Yetkazib berish","value":"Buxoro bo''ylab bepul va tezkor"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_yugurish-yolakchasi-proform-t800', 'Professional Yugurish Yo‘lakchasi ProForm T800', 'yugurish-yolakchasi-proform-t800', '0455801', '3.5 Ot kuchiga ega shovqinsiz kuchli dvigatel, avtomatik 15% qiyalik burchagi, 8 pog‘onali bo‘g‘inlarni asrovchi amortizatsiya tizimi va sensorli LED displey.', 8500000, 9800000, 13, 'Trenajorlar & Kardio', 'trenajorlar', 'Yugurish yo‘lakchalari', 'ProForm', 8, true, 5, 14, '["https://images.unsplash.com/photo-1576678927484-cc907957088c?w=1000&auto=format&fit=crop&q=85"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Dvigatel quvvati","value":"3.5 HP (Doimiy quvvat)"},{"label":"Tezlik diapazoni","value":"1 - 18 km/soat"},{"label":"Maksimal yuklama","value":"140 kg"},{"label":"Yugurish maydoni","value":"135 x 48 sm"},{"label":"Kafolat","value":"2 yil rasmiy kafolat"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_multi-gym-station-hg500', 'Ko‘p Funksiyali Kuch Trenajori Multi-Gym HG-500', 'multi-gym-station-hg500', '0455802', 'Ko‘krak, yelka, orqa, bisept, trisept va oyoq mushaklari uchun 15 dan ortiq mashqlarni bajaruvchi universal trenajor. 75 kg li xavfsiz blokli yuklar to‘plami.', 12800000, 14500000, 12, 'Trenajorlar & Kardio', 'trenajorlar', 'Kuch trenajorlari', 'IronPower', 5, true, 4.9, 11, '["https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=1000&auto=format&fit=crop&q=85"]'::jsonb, '[]'::jsonb, true, false, true, '[{"label":"Og‘irlik bloki","value":"75 kg (Kauchuklangan disklarda)"},{"label":"Konstruksiya","value":"50x70 mm mustahkam po‘lat profil"},{"label":"Maksimal foydalanuvchi vazni","value":"150 kg"},{"label":"Kafolat","value":"3 yil servis xizmati"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_velotrenajor-spin-bike-sb300', 'Magnitli Velotrenajor Spining Bike SB-300', 'velotrenajor-spin-bike-sb300', '0455803', '18 kg li og‘ir maxovik, magnitli ovozsiz yuklash tizimi, qulay anatomik sport o‘rindig‘i va smartfon ushlagichi bilan.', 3200000, 3700000, 14, 'Trenajorlar & Kardio', 'trenajorlar', 'Velotrenajorlar', 'Sport Life', 12, true, 4.8, 9, '["https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=1000&auto=format&fit=crop&q=85"]'::jsonb, '[]'::jsonb, true, false, false, '[{"label":"Maxovik vazni","value":"18 kg"},{"label":"Tizim","value":"Kamarlik, ovozsiz magnit"},{"label":"Displey","value":"Tezlik, masofa, kaloriya, puls"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_gantellar-toplami-rubber-hex', 'Professional Kauchukli Gantellar To‘plami (2.5kg - 25kg)', 'gantellar-toplami-rubber-hex', '0455804', 'Olti burchakli (Hex) xrom tutqichli rezinalangan mustahkam gantellar to‘plami. Polga zarar yetkazmaydi, xavfsiz va qulay.', 5400000, 6200000, 13, 'Gantellar & Shtangalar', 'gantellar', 'Gantellar', 'IronPower', 10, true, 5, 16, '["https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=1000&auto=format&fit=crop&q=85"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Qoplamasi","value":"Yuqori zichlikdagi tabiiy kauchuk"},{"label":"Tutqich","value":"Sirpanmaydigan riflyoniy xrom po‘lat"},{"label":"Vaznlar","value":"2.5kg, 5kg, 7.5kg, 10kg, 12.5kg, 15kg, 20kg, 25kg"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_sozlanuvchi-skameyka-db90', 'Sozlanuvchi Mashg‘ulot Skameykasi Bench Press DB-90', 'sozlanuvchi-skameyka-db90', '0455805', '7 xil orqa suyanchiq burchagiga (salbiy, tekis, tik) sozlanadigan qalin eko-charm yumshoq qoplamali sport skameykasi. 350 kg maksimal yuklama.', 1450000, 1700000, 15, 'Podstavka & Skameykalar', 'stoykalar', 'Skameykalar', 'Sport Line', 14, true, 4.9, 7, '["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=85"]'::jsonb, '[]'::jsonb, false, true, false, '[{"label":"Burchaklar","value":"-15°, 0°, 30°, 45°, 60°, 75°, 90°"},{"label":"Maksimal yuklama","value":"350 kg"},{"label":"Konstruksiya","value":"Mustahkam qora poroshok bo‘yoqli po‘lat"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_gantel-podstavka-gorizontal-2layer', 'Gantel Podstavka SC80270 (2 Qavatli Gorizontal)', 'gantel-podstavka-gorizontal-2layer', '0455808', '10-12 juft gantellar sig‘adigan 2 qavatli og‘ir yukka mo‘ljallangan professional zal stoykasi. Kauchuk himoya prokladkalariga ega.', 1400000, 1650000, 15, 'Podstavka & Skameykalar', 'stoykalar', 'Gantel Stoykalari', 'Sport Line', 11, true, 5, 5, '["https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?w=1000&auto=format&fit=crop&q=85"]'::jsonb, '[]'::jsonb, true, true, true, '[{"label":"Model","value":"SC80270"},{"label":"Sig‘imi","value":"10-12 juft og‘ir gantellar"},{"label":"Material","value":"Qotishma po‘lat (Black coating)"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_turnik-brus-press-3in1', 'Devorga O‘rnatiladigan 3-in-1 Turnik-Brus-Press', 'turnik-brus-press-3in1', '0455806', 'Mustahkam po‘lat turnik, brus va qorin pressi uchun qulay tirsak yostiqchalariga ega universal uy trenajori. 200 kg ko‘tarish quvvati.', 650000, 780000, 17, 'Podstavka & Skameykalar', 'stoykalar', 'Turniklar', 'Sport Line', 20, true, 4.9, 12, '["https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1000&auto=format&fit=crop&q=85"]'::jsonb, '[]'::jsonb, true, false, false, '[{"label":"Funksiyalar","value":"Turnik (keng va tor ushlash), Brus, Press"},{"label":"Maksimal vazn","value":"200 kg"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_olimpiyskiy-shtanga-grifi-20kg', 'Olimpiyskiy Shtanga Grifi 20kg (220cm / 50mm)', 'olimpiyskiy-shtanga-grifi-20kg', '0455807', '4 ta podshipnikli professional xrom qoplamali olimpiada shtanga grifi. 450 kg maksimal yuklama.', 1150000, 1350000, 15, 'Gantellar & Shtangalar', 'gantellar', 'Shtangalar', 'IronPower', 9, true, 5, 8, '["https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&auto=format&fit=crop&q=85"]'::jsonb, '[]'::jsonb, false, false, false, '[{"label":"Grif og‘irligi","value":"20 kg"},{"label":"Uzunligi","value":"220 sm"},{"label":"Vtulka diametri","value":"50 mm (Olimpiyskiy disklar uchun)"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_nike-air-zoom-pegasus-sport', 'Nike Air Zoom Pegasus 40 Professional Yugurish Krossovkasi', 'nike-air-zoom-pegasus-sport', '0455809', 'React ko‘pik amortizatsiyasi, yengil nafas oluvchi setka mato va baquvvat protektor.', 1250000, 1450000, 14, 'Krossovkalar & Poyabzal', 'krossovkalar', 'Yugurish krossovkalari', 'Nike', 25, true, 5, 22, '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=85"]'::jsonb, '[]'::jsonb, true, true, false, '[{"label":"Brend","value":"Nike Original"},{"label":"Mavsum","value":"Barcha fasllar"},{"label":"Tavsiya","value":"Zal, yugurish, marafon"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_fitnes-rezinkalari-set-5', 'Elastik Fitnes Rezinkalari To‘plami (5 xil yuklama)', 'fitnes-rezinkalari-set-5', '0455810', '100% tabiiy lateksdan tayyorlangan 5kg dan 25kg gacha qarshilik ko‘rsatuvchi fitnes espanderlari.', 180000, 230000, 22, 'Fitnes Aksessuarlari', 'fitnes-aksessuarlari', 'Espanderlar', 'Sport Line', 35, true, 4.9, 19, '["https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=1000&auto=format&fit=crop&q=85"]'::jsonb, '[]'::jsonb, true, false, false, '[{"label":"To‘plam","value":"5 ta turli qarshilikdagi lenta + sumkasi"},{"label":"Material","value":"100% tabiiy elastik lateks"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, variants, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES ('prod_termo-sport-kostyumi-under-armour', 'Erkaklar Termo Sport Kostyumi Under Armour Storm', 'termo-sport-kostyumi-under-armour', '0455811', 'Nafas oluvchi namlik o‘tkazmaydigan ColdGear texnologiyasidagi mashg‘ulot sport kiyimi. Harakat erkinligi va elastik mato.', 680000, 820000, 17, 'Sport Kiyimlari', 'sport-kiyimlari', 'Sport Kostyumlari', 'Under Armour', 18, true, 4.9, 14, '["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=85"]'::jsonb, '[]'::jsonb, false, true, false, '[{"label":"Brend","value":"Under Armour"},{"label":"Material","value":"Poliester + Elastan (Termo)"},{"label":"O‘lchamlar","value":"S, M, L, XL, XXL"}]'::jsonb)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price, old_price = EXCLUDED.old_price, discount_percent = EXCLUDED.discount_percent, images = EXCLUDED.images, variants = EXCLUDED.variants, stock = EXCLUDED.stock, in_stock = EXCLUDED.in_stock;
