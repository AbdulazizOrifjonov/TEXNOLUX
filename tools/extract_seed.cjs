const fs = require('fs');
const path = require('path');

const seedDataPath = path.join(__dirname, '../backend/seed/seedData.js');
const seedContent = fs.readFileSync(seedDataPath, 'utf8');

// Extract categoriesData
const catStart = seedContent.indexOf('const categoriesData = [');
const catEnd = seedContent.indexOf('];', catStart) + 2;
const catCode = seedContent.substring(catStart, catEnd);

// Extract productsData
const prodStart = seedContent.indexOf('const productsData = [');
const prodEnd = seedContent.indexOf('];', prodStart) + 2;
const prodCode = seedContent.substring(prodStart, prodEnd);

const sandbox = {};
const fn = new Function('sandbox', `${catCode}\n${prodCode}\nsandbox.categories = categoriesData;\nsandbox.products = productsData;`);
fn(sandbox);

const ordersPath = path.join(__dirname, '../backend/seed/seedRealOrders.js');
const ordersContent = fs.readFileSync(ordersPath, 'utf8');
const clientsStart = ordersContent.indexOf('const sampleClients = [');
const clientsEnd = ordersContent.indexOf('];', clientsStart) + 2;
const clientsCode = ordersContent.substring(clientsStart, clientsEnd);

const fnOrders = new Function('sandbox', `${clientsCode}\nsandbox.clients = sampleClients;`);
fnOrders(sandbox);

// Prepare rich mock data with IDs
const categories = sandbox.categories.map((c, i) => ({
  _id: `cat_${c.slug}`,
  id: `cat_${c.slug}`,
  name: c.name,
  slug: c.slug,
  icon: c.icon || 'Folder',
  description: c.description || `${c.name} Buxoro bo'yicha kafolatli yetkazib berish`,
  image: c.image || '',
  order: c.order || i + 1,
  active: true,
  created_at: new Date(Date.now() - (10 - i) * 86400000).toISOString()
}));

const products = sandbox.products.map((p, i) => {
  const pid = `prod_${p.slug || i + 1}`;
  const oldPrice = p.oldPrice || (p.discountPercent ? Math.round(p.price / (1 - p.discountPercent / 100)) : 0);
  const discountPercent = p.discountPercent || (oldPrice > p.price ? Math.round(((oldPrice - p.price) / oldPrice) * 100) : 0);
  return {
    _id: pid,
    id: pid,
    title: p.title,
    slug: p.slug,
    sku: p.sku || `SKU-${1000 + i}`,
    description: p.description || '',
    price: Number(p.price),
    oldPrice: Number(oldPrice),
    old_price: Number(oldPrice),
    discountPercent: Number(discountPercent),
    discount_percent: Number(discountPercent),
    category: p.category,
    categorySlug: p.categorySlug || '',
    category_slug: p.categorySlug || '',
    subcategory: p.subcategory || '',
    brand: p.brand || 'NSB',
    stock: typeof p.stock === 'number' ? p.stock : 12,
    inStock: (typeof p.stock === 'number' ? p.stock : 12) > 0,
    in_stock: (typeof p.stock === 'number' ? p.stock : 12) > 0,
    rating: p.rating || 5.0,
    reviewsCount: p.reviewsCount || 10 + (i % 25),
    reviews_count: p.reviewsCount || 10 + (i % 25),
    isBestseller: Boolean(p.isBestseller),
    is_bestseller: Boolean(p.isBestseller),
    isNewArrival: Boolean(p.isNewArrival),
    is_new_arrival: Boolean(p.isNewArrival),
    isWeeklyDeal: Boolean(p.isWeeklyDeal),
    is_weekly_deal: Boolean(p.isWeeklyDeal),
    images: p.images || [],
    specifications: p.specifications || [],
    created_at: new Date(Date.now() - (50 - i) * 86400000).toISOString()
  };
});

// Banners
const banners = [
  {
    _id: 'banner_1',
    id: 'banner_1',
    title: "Noutbuklar va Zamonaviy IT Texnikalar",
    subtitle: "Eng so‘nggi avlod Apple MacBook, ASUS, Lenovo, HP noutbuklari",
    badge: "NEXT NOUT — Yangi Avlod",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1600&auto=format&fit=crop&q=85",
    link: "/shop",
    type: "hero",
    bg_color: "#000000",
    text_color: "#ffffff",
    order: 1,
    active: true
  },
  {
    _id: 'banner_2',
    id: 'banner_2',
    title: "Apple MacBook Pro M3 & Server Texnikalari",
    subtitle: "Buxoro korxonalari va IT mutaxassislari uchun maxsus takliflar",
    badge: "Apple & IT Ishchi Stansiyalar",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1600&auto=format&fit=crop&q=85",
    link: "/shop?tag=bestseller",
    type: "hero",
    bg_color: "#0a0a0a",
    text_color: "#ffffff",
    order: 2,
    active: true
  }
];

// Coupons
const coupons = [
  {
    _id: 'coupon_1',
    id: 'coupon_1',
    code: 'NSB2026',
    discountPercent: 10,
    discount_percent: 10,
    expiryDate: '2026-12-31T23:59:59.000Z',
    expiry_date: '2026-12-31T23:59:59.000Z',
    active: true
  },
  {
    _id: 'coupon_2',
    id: 'coupon_2',
    code: 'BUKHARA5',
    discountPercent: 5,
    discount_percent: 5,
    expiryDate: '2026-12-31T23:59:59.000Z',
    expiry_date: '2026-12-31T23:59:59.000Z',
    active: true
  }
];

// Reviews
const reviews = [
  {
    _id: 'rev_1',
    id: 'rev_1',
    productId: products[0].id,
    product_id: products[0].id,
    productTitle: products[0].title,
    product_title: products[0].title,
    userName: 'Aziz Raximov',
    user_name: 'Aziz Raximov',
    userEmail: 'aziz@bukhara.uz',
    user_email: 'aziz@bukhara.uz',
    rating: 5,
    comment: 'NSB orqali butun ofisimiz uchun noutbuklar va orgtexnika xarid qildik. Buyurtma 2 soat ichida yetib keldi, hisob-fakturalar Didox orqali tasdiqlandi. 100% ishonchli!',
    verifiedPurchase: true,
    verified_purchase: true,
    status: 'approved',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    _id: 'rev_2',
    id: 'rev_2',
    productId: products[1].id,
    product_id: products[1].id,
    productTitle: products[1].title,
    product_title: products[1].title,
    userName: 'Nodira Salimova',
    user_name: 'Nodira Salimova',
    userEmail: 'nodira@zarafshon.it',
    user_email: 'nodira@zarafshon.it',
    rating: 5,
    comment: 'Apple MacBook Pro stansiyalarini buyurtma qildik. Rasmiy kafolati bor, qadoqlari butun va toza. Buxoroda professional korporativ xizmat a’lo darajada.',
    verifiedPurchase: true,
    verified_purchase: true,
    status: 'approved',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    _id: 'rev_3',
    id: 'rev_3',
    productId: products[12].id,
    product_id: products[12].id,
    productTitle: products[12].title,
    product_title: products[12].title,
    userName: 'Jamshid Toirov',
    user_name: 'Jamshid Toirov',
    userEmail: 'jamshid@neft.uz',
    user_email: 'jamshid@neft.uz',
    rating: 5,
    comment: 'Ulgurji narxlar va to‘g‘ridan-to‘g‘ri shartnoma tuzish juda qulay. Barcha kantselyariya va ofis jihozlarini faqat shu yerdan xarid qilamiz.',
    verifiedPurchase: true,
    verified_purchase: true,
    status: 'approved',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString()
  }
];

// Orders
const orders = sandbox.clients.map((client, idx) => {
  const p1 = products[idx % products.length];
  const p2 = products[(idx + 3) % products.length];
  const qty1 = (idx % 3) + 1;
  const qty2 = (idx % 2) + 1;
  const totalAmount = (p1.price * qty1) + (p2.price * qty2);

  const date = new Date(Date.now() - client.daysAgo * 86400000 - (idx * 3600000));
  const oid = `ord_${100240 + idx}`;

  return {
    _id: oid,
    id: oid,
    orderNumber: `NSB-100${240 + idx}`,
    order_number: `NSB-100${240 + idx}`,
    customerDetails: {
      fullName: client.name,
      phone: client.phone,
      city: client.city,
      address: client.address,
      notes: client.method === 'bank_transfer' ? '12% QQS bilan shartnoma talab qilinadi' : 'Tezkor yetkazish'
    },
    customer_name: client.name,
    customer_phone: client.phone,
    city: client.city,
    address: client.address,
    notes: client.method === 'bank_transfer' ? '12% QQS bilan shartnoma talab qilinadi' : 'Tezkor yetkazish',
    coordinates: { lat: 39.7681, lon: 64.4556 },
    location_url: 'https://yandex.uz/maps/?pt=64.4556,39.7681&z=15',
    items: [
      {
        product: p1._id,
        product_id: p1._id,
        title: p1.title,
        price: p1.price,
        quantity: qty1,
        image: p1.images?.[0] || ''
      },
      {
        product: p2._id,
        product_id: p2._id,
        title: p2.title,
        price: p2.price,
        quantity: qty2,
        image: p2.images?.[0] || ''
      }
    ],
    totalAmount,
    total_amount: totalAmount,
    deliveryFee: totalAmount > 500000 ? 0 : 25000,
    delivery_fee: totalAmount > 500000 ? 0 : 25000,
    paymentMethod: client.method,
    payment_method: client.method,
    paymentStatus: client.status === 'delivered' ? 'paid' : (client.status === 'cancelled' ? 'failed' : 'pending'),
    payment_status: client.status === 'delivered' ? 'paid' : (client.status === 'cancelled' ? 'failed' : 'pending'),
    orderStatus: client.status,
    order_status: client.status,
    deliveryType: 'standard',
    delivery_type: 'standard',
    createdAt: date.toISOString(),
    created_at: date.toISOString()
  };
});

// 1. Output mockData.js for frontend
const mockJsContent = `// Autogenerated rich mock database & local persistence layer for NEXT NOUT / NSB
// Works 100% out of the box on Vercel preview or before Supabase keys are configured.

export const defaultCategories = ${JSON.stringify(categories, null, 2)};

export const defaultProducts = ${JSON.stringify(products, null, 2)};

export const defaultBanners = ${JSON.stringify(banners, null, 2)};

export const defaultCoupons = ${JSON.stringify(coupons, null, 2)};

export const defaultReviews = ${JSON.stringify(reviews, null, 2)};

export const defaultOrders = ${JSON.stringify(orders, null, 2)};

export function getLocalCollection(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage access warning:', e);
    return fallback;
  }
}

export function saveLocalCollection(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}
`;

fs.writeFileSync(path.join(__dirname, '../frontend/src/services/mockData.js'), mockJsContent, 'utf8');
console.log('Wrote frontend/src/services/mockData.js successfully!');

// 2. Generate Supabase SQL Migration Script (supabase_setup.sql)
function sqlEscape(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val;
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
  return `'${String(val).replace(/'/g, "''")}'`;
}

let sql = `-- ==============================================================================
-- NEXT NOUT (NSB BUKHARA) — FULL SUPABASE DATABASE SCHEMA & SEED SCRIPT
-- Paste this script directly into Supabase SQL Editor and click RUN.
-- It creates all tables, enables RLS with permissive public access,
-- sets up the 'product-images' Storage bucket, and seeds all 45+ products,
-- categories, orders, reviews, and coupons.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
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
    brand TEXT DEFAULT 'NSB',
    stock INT DEFAULT 10,
    in_stock BOOLEAN DEFAULT TRUE,
    rating NUMERIC DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    images JSONB DEFAULT '[]'::jsonb,
    is_bestseller BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_weekly_deal BOOLEAN DEFAULT FALSE,
    specifications JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. ORDERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    city TEXT DEFAULT 'Buxoro',
    address TEXT NOT NULL,
    notes TEXT DEFAULT '',
    coordinates JSONB DEFAULT '{}'::jsonb,
    location_url TEXT DEFAULT '',
    items JSONB NOT NULL,
    total_amount NUMERIC NOT NULL,
    delivery_fee NUMERIC DEFAULT 0,
    payment_method TEXT DEFAULT 'cash',
    payment_status TEXT DEFAULT 'pending',
    order_status TEXT DEFAULT 'new',
    delivery_type TEXT DEFAULT 'standard',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. REVIEWS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    product_id TEXT DEFAULT NULL,
    product_title TEXT DEFAULT '',
    user_name TEXT NOT NULL,
    user_email TEXT DEFAULT '',
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT TRUE,
    status TEXT DEFAULT 'approved',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. BANNERS TABLE
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- 6. COUPONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_percent INT NOT NULL,
    expiry_date TIMESTAMPTZ,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Allow public reads on storefront data
CREATE POLICY "Public Categories Select" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Products Select" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Banners Select" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Public Coupons Select" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public Reviews Select" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Public Orders Select" ON public.orders FOR SELECT USING (true);

-- Allow public creation for orders and reviews
CREATE POLICY "Public Orders Insert" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Reviews Insert" ON public.reviews FOR INSERT WITH CHECK (true);

-- Allow full manage access for admin demo / management
CREATE POLICY "Admin All Products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Banners" ON public.banners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Coupons" ON public.coupons FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- STORAGE BUCKET: product-images
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS
CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public Storage Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Public Storage Manage" ON storage.objects FOR ALL USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');

-- ------------------------------------------------------------------------------
-- SEED DATA INSERTION
-- ------------------------------------------------------------------------------
`;

// Insert categories
sql += '\n-- Insert Categories\n';
categories.forEach(c => {
  sql += `INSERT INTO public.categories (id, name, slug, icon, description, image, display_order, active)
VALUES (${sqlEscape(c.id)}, ${sqlEscape(c.name)}, ${sqlEscape(c.slug)}, ${sqlEscape(c.icon)}, ${sqlEscape(c.description)}, ${sqlEscape(c.image)}, ${sqlEscape(c.order)}, ${sqlEscape(c.active)})
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, description = EXCLUDED.description;\n`;
});

// Insert products
sql += '\n-- Insert Products\n';
products.forEach(p => {
  sql += `INSERT INTO public.products (id, title, slug, sku, description, price, old_price, discount_percent, category, category_slug, subcategory, brand, stock, in_stock, rating, reviews_count, images, is_bestseller, is_new_arrival, is_weekly_deal, specifications)
VALUES (${sqlEscape(p.id)}, ${sqlEscape(p.title)}, ${sqlEscape(p.slug)}, ${sqlEscape(p.sku)}, ${sqlEscape(p.description)}, ${sqlEscape(p.price)}, ${sqlEscape(p.old_price)}, ${sqlEscape(p.discount_percent)}, ${sqlEscape(p.category)}, ${sqlEscape(p.category_slug)}, ${sqlEscape(p.subcategory)}, ${sqlEscape(p.brand)}, ${sqlEscape(p.stock)}, ${sqlEscape(p.in_stock)}, ${sqlEscape(p.rating)}, ${sqlEscape(p.reviews_count)}, ${sqlEscape(p.images)}, ${sqlEscape(p.is_bestseller)}, ${sqlEscape(p.is_new_arrival)}, ${sqlEscape(p.is_weekly_deal)}, ${sqlEscape(p.specifications)})
ON CONFLICT (slug) DO UPDATE SET price = EXCLUDED.price, stock = EXCLUDED.stock, images = EXCLUDED.images;\n`;
});

// Insert Banners
sql += '\n-- Insert Banners\n';
banners.forEach(b => {
  sql += `INSERT INTO public.banners (id, title, subtitle, badge, image, link, type, bg_color, text_color, display_order, active)
VALUES (${sqlEscape(b.id)}, ${sqlEscape(b.title)}, ${sqlEscape(b.subtitle)}, ${sqlEscape(b.badge)}, ${sqlEscape(b.image)}, ${sqlEscape(b.link)}, ${sqlEscape(b.type)}, ${sqlEscape(b.bg_color)}, ${sqlEscape(b.text_color)}, ${sqlEscape(b.order)}, ${sqlEscape(b.active)})
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, image = EXCLUDED.image;\n`;
});

// Insert Coupons
sql += '\n-- Insert Coupons\n';
coupons.forEach(c => {
  sql += `INSERT INTO public.coupons (id, code, discount_percent, expiry_date, active)
VALUES (${sqlEscape(c.id)}, ${sqlEscape(c.code)}, ${sqlEscape(c.discount_percent)}, ${sqlEscape(c.expiry_date)}, ${sqlEscape(c.active)})
ON CONFLICT (code) DO UPDATE SET discount_percent = EXCLUDED.discount_percent;\n`;
});

// Insert Reviews
sql += '\n-- Insert Reviews\n';
reviews.forEach(r => {
  sql += `INSERT INTO public.reviews (id, product_id, product_title, user_name, user_email, rating, comment, verified_purchase, status)
VALUES (${sqlEscape(r.id)}, ${sqlEscape(r.product_id)}, ${sqlEscape(r.product_title)}, ${sqlEscape(r.user_name)}, ${sqlEscape(r.user_email)}, ${sqlEscape(r.rating)}, ${sqlEscape(r.comment)}, ${sqlEscape(r.verified_purchase)}, ${sqlEscape(r.status)})
ON CONFLICT (id) DO NOTHING;\n`;
});

// Insert Orders
sql += '\n-- Insert Orders\n';
orders.forEach(o => {
  sql += `INSERT INTO public.orders (id, order_number, customer_name, customer_phone, city, address, notes, coordinates, location_url, items, total_amount, delivery_fee, payment_method, payment_status, order_status, delivery_type, created_at)
VALUES (${sqlEscape(o.id)}, ${sqlEscape(o.order_number)}, ${sqlEscape(o.customer_name)}, ${sqlEscape(o.customer_phone)}, ${sqlEscape(o.city)}, ${sqlEscape(o.address)}, ${sqlEscape(o.notes)}, ${sqlEscape(o.coordinates)}, ${sqlEscape(o.location_url)}, ${sqlEscape(o.items)}, ${sqlEscape(o.total_amount)}, ${sqlEscape(o.delivery_fee)}, ${sqlEscape(o.payment_method)}, ${sqlEscape(o.payment_status)}, ${sqlEscape(o.order_status)}, ${sqlEscape(o.delivery_type)}, ${sqlEscape(o.created_at)})
ON CONFLICT (order_number) DO NOTHING;\n`;
});

const sqlFilePath = path.join(__dirname, '../supabase_setup.sql');
fs.writeFileSync(sqlFilePath, sql, 'utf8');
console.log('Wrote supabase_setup.sql successfully! Total size:', (sql.length / 1024).toFixed(1), 'KB');
