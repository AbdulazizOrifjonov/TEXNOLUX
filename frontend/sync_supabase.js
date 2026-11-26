import { createClient } from '@supabase/supabase-js';
import { defaultCategories, defaultProducts } from './src/services/mockData.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || '';
if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

async function syncAll() {
  console.log('Starting Supabase sync...');

  // 1. Delete test category
  await client.from('categories').delete().eq('id', 'test_cat');

  // 2. Sync Categories
  console.log(`Syncing ${defaultCategories.length} categories...`);
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
    const { error } = await client.from('categories').upsert(row, { onConflict: 'slug' });
    if (error) console.error('Category error:', cat.slug, error);
  }

  // 3. Sync Products
  console.log(`Syncing ${defaultProducts.length} products...`);
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
      brand: p.brand || 'SPORT OUTLET',
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
    if (error) console.error('Product error:', p.slug, error);
  }

  const { data: catData } = await client.from('categories').select('id');
  const { data: prodData } = await client.from('products').select('id');
  console.log('✅ Supabase sync complete!');
  console.log('Total categories in Supabase:', catData?.length);
  console.log('Total products in Supabase:', prodData?.length);
}

syncAll().catch(console.error);
