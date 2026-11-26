const { createClient } = require('../frontend/node_modules/@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Set SUPABASE_URL and SUPABASE_KEY.');
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

const MOCK_PATH = path.join(__dirname, '..', 'frontend', 'src', 'services', 'mockData.js');

async function syncAll() {
  console.log('🔄 Barcha mahsulotlarni Supabase bilan sinxronlash boshlandi...');

  // Extract defaultProducts and defaultCategories from mockData.js
  const content = fs.readFileSync(MOCK_PATH, 'utf8');

  // Parse defaultCategories
  const catStart = content.indexOf('export const defaultCategories = [');
  const catArrayStart = content.indexOf('[', catStart);
  let depth = 0, catArrayEnd = -1;
  for (let i = catArrayStart; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') {
      depth--;
      if (depth === 0) { catArrayEnd = i + 1; break; }
    }
  }
  const defaultCategories = JSON.parse(content.slice(catArrayStart, catArrayEnd));

  // Parse defaultProducts
  const prodStart = content.indexOf('export const defaultProducts = [');
  const prodArrayStart = content.indexOf('[', prodStart);
  depth = 0;
  let prodArrayEnd = -1;
  for (let i = prodArrayStart; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') {
      depth--;
      if (depth === 0) { prodArrayEnd = i + 1; break; }
    }
  }
  const defaultProducts = JSON.parse(content.slice(prodArrayStart, prodArrayEnd));

  console.log(`Toifalar soni: ${defaultCategories.length}, Mahsulotlar soni: ${defaultProducts.length}`);

  for (const cat of defaultCategories) {
    const row = {
      id: cat.id || cat._id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || 'Folder',
      description: cat.description || '',
      image: cat.image || '',
      display_order: cat.order || 1,
      active: true
    };
    await client.from('categories').upsert(row, { onConflict: 'slug' });
  }

  for (const p of defaultProducts) {
    const id = p.id || p._id;
    const price = Number(p.price || 0);
    const oldPrice = Number(p.oldPrice || p.old_price || 0);
    const discount = Number(p.discountPercent || p.discount_percent || 0);
    const stock = Number(p.stock !== undefined ? p.stock : 10);
    const inStock = p.inStock !== undefined ? Boolean(p.inStock) : (stock > 0);

    const row = {
      id,
      title: p.title,
      slug: p.slug,
      sku: p.sku || '',
      description: p.description || '',
      price,
      old_price: oldPrice,
      discount_percent: discount,
      category: p.category,
      category_slug: p.categorySlug || p.category_slug,
      subcategory: p.subcategory || '',
      brand: p.brand || 'WYUE',
      stock,
      in_stock: inStock,
      rating: Number(p.rating || 5.0),
      reviews_count: Number(p.reviewsCount || p.reviews_count || 0),
      images: Array.isArray(p.images) ? p.images : [],
      variants: Array.isArray(p.variants) ? p.variants : [],
      specifications: Array.isArray(p.specifications) ? p.specifications : [],
      is_bestseller: Boolean(p.isBestseller || p.is_bestseller),
      is_new_arrival: Boolean(p.isNewArrival || p.is_new_arrival),
      is_weekly_deal: Boolean(p.isWeeklyDeal || p.is_weekly_deal)
    };

    const { error } = await client.from('products').upsert(row, { onConflict: 'slug' });
    if (error) console.error('Xatolik:', p.title, error.message);
  }

  const { data: prodData } = await client.from('products').select('id');
  console.log(`✅ Supabase sinxronlandi! Bazada jami ${prodData?.length} ta mahsulot mavjud.`);
}

syncAll().catch(console.error);
