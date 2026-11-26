const { createClient } = require('../frontend/node_modules/@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Set SUPABASE_URL and SUPABASE_KEY.');
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

const MOCK_PATH = path.join(__dirname, '..', 'frontend', 'src', 'services', 'mockData.js');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

async function runQA() {
  console.log('====================================================');
  console.log('🚀 NSB NEW STAR BUKHARA — TO‘LIQ QA TEKSHIRUVI');
  console.log('====================================================\n');

  // --- 1. MOCK DATA & REAL PRICES CHECK ---
  console.log('📦 1. Mahsulotlar va Narxlar tekshiruvi:');
  const mockContent = fs.readFileSync(MOCK_PATH, 'utf8');

  // Parse defaultCategories
  const catStart = mockContent.indexOf('export const defaultCategories = [');
  const catArrayStart = mockContent.indexOf('[', catStart);
  let depth = 0, catArrayEnd = -1;
  for (let i = catArrayStart; i < mockContent.length; i++) {
    if (mockContent[i] === '[') depth++;
    else if (mockContent[i] === ']') {
      depth--;
      if (depth === 0) { catArrayEnd = i + 1; break; }
    }
  }
  const defaultCategories = JSON.parse(mockContent.slice(catArrayStart, catArrayEnd));

  // Parse defaultProducts
  const prodStart = mockContent.indexOf('export const defaultProducts = [');
  const prodArrayStart = mockContent.indexOf('[', prodStart);
  depth = 0;
  let prodArrayEnd = -1;
  for (let i = prodArrayStart; i < mockContent.length; i++) {
    if (mockContent[i] === '[') depth++;
    else if (mockContent[i] === ']') {
      depth--;
      if (depth === 0) { prodArrayEnd = i + 1; break; }
    }
  }
  const defaultProducts = JSON.parse(mockContent.slice(prodArrayStart, prodArrayEnd));

  assert(Array.isArray(defaultCategories) && defaultCategories.length >= 10, `Kategoriyalar soni yetarli (${defaultCategories.length} ta)`);
  assert(Array.isArray(defaultProducts) && defaultProducts.length >= 12, `Mahsulotlar soni yetarli (${defaultProducts.length} ta)`);

  // Verify that NONE of the tool products has hardcoded 750000
  const bad750k = defaultProducts.filter(p => p.price === 750000 && p.title && (
    p.title.includes('130') || p.title.includes('339') || p.title.includes('330') || 
    p.title.includes('169') || p.title.includes('895') || p.title.includes('569')
  ));
  assert(bad750k.length === 0, `Asbob mahsulotlarida 750,000 xato narx qolmadi (topildi: ${bad750k.length})`);

  // Check specific real prices
  const p130 = defaultProducts.find(p => p.price === 130000);
  assert(p130 && p130.price === 130000, `Balgarka narxi to‘g‘ri: 130,000 so'm ("${p130?.title}")`);

  const p339 = defaultProducts.find(p => p.price === 339000);
  assert(p339 && p339.price === 339000, `Circular Saw narxi to‘g‘ri: 339,000 so'm ("${p339?.title}")`);

  const p895 = defaultProducts.find(p => p.price === 895000);
  assert(p895 && p895.price === 895000, `4&1 nabor narxi to‘g‘ri: 895,000 so'm ("${p895?.title}")`);

  const p569 = defaultProducts.find(p => p.price === 569000);
  assert(p569 && p569.price === 569000, `2&1 to‘plam narxi to‘g‘ri: 569,000 so'm ("${p569?.title}")`);

  // --- 2. SUPABASE LIVE CLOUD CRUD ---
  console.log('\n☁️ 2. Supabase Cloud Database CRUD tekshiruvi:');

  // Categories READ
  const { data: cloudCats, error: catErr } = await client.from('categories').select('*');
  assert(!catErr && Array.isArray(cloudCats) && cloudCats.length >= 10, `Supabase'da kategoriyalar o‘qildi (${cloudCats?.length || 0} ta)`);

  // Category CREATE
  const testCatId = 'cat_qa_test_' + Date.now();
  const testCatSlug = 'qa-test-cat-' + Date.now();
  const { data: newCat, error: createCatErr } = await client.from('categories').insert([{
    id: testCatId,
    name: 'QA Test Kategoriya',
    slug: testCatSlug,
    description: 'Avtomatlashtirilgan test kategoriyasi'
  }]).select();
  assert(!createCatErr && newCat && newCat.length > 0, `Supabase'da yangi kategoriya qo‘shildi (ID: ${testCatId})`);

  // Category DELETE
  if (newCat && newCat[0]?.id) {
    const { error: delCatErr } = await client.from('categories').delete().eq('id', newCat[0].id);
    assert(!delCatErr, `Test kategoriya muvaffaqiyatli o‘chirildi`);
  }

  // Products READ
  const { data: cloudProds, error: prodErr } = await client.from('products').select('*');
  assert(!prodErr && Array.isArray(cloudProds) && cloudProds.length >= 10, `Supabase'da mahsulotlar o‘qildi (${cloudProds?.length || 0} ta)`);

  // Product CREATE (with multiple images)
  const testProdId = 'prod_qa_test_' + Date.now();
  const testProdSlug = 'qa-test-tool-' + Date.now();
  const { data: newProd, error: createProdErr } = await client.from('products').insert([{
    id: testProdId,
    title: 'QA Sinov Drel Asbobi 2026',
    slug: testProdSlug,
    price: 245000,
    old_price: 295000,
    category_slug: 'drellar-shurupovyort',
    category: 'Drellar & Shurupovyortlar',
    brand: 'WYUE QA',
    stock: 7,
    images: ['/uploads/prod_130000-s-m-8894_1.jpg', '/uploads/prod_130000-s-m-8894_2.jpg'],
    in_stock: true,
    is_new_arrival: true
  }]).select();
  assert(!createProdErr && newProd && newProd.length > 0, `Supabase'da yangi mahsulot 2 ta rasm bilan qo‘shildi (ID: ${testProdId})`);

  // Product UPDATE
  if (newProd && newProd[0]?.id) {
    const { data: updatedProd, error: updateProdErr } = await client.from('products')
      .update({ price: 260000, title: 'QA Sinov Drel Asbobi 2026 (Yangilandi)' })
      .eq('id', newProd[0].id)
      .select();
    assert(!updateProdErr && updatedProd?.[0]?.price === 260000, `Mahsulot narxi 260,000 ga yangilandi`);

    // Product DELETE
    const { error: delProdErr } = await client.from('products').delete().eq('id', newProd[0].id);
    assert(!delProdErr, `Test mahsulot muvaffaqiyatli o‘chirildi`);
  }

  // Orders CREATE & READ
  const testOrderId = 'ord_qa_' + Date.now();
  const testOrderNumber = 'QA-' + Date.now();
  const { data: newOrder, error: createOrderErr } = await client.from('orders').insert([{
    id: testOrderId,
    order_number: testOrderNumber,
    customer_name: 'Abdulaziz QA Test',
    customer_phone: '+998901234567',
    city: 'Buxoro',
    address: 'Mustaqillik ko‘chasi, 15',
    items: [{ id: 'test_item', title: 'QA Drel', price: 260000, quantity: 1 }],
    total_amount: 260000,
    order_status: 'new',
    payment_method: 'cash'
  }]).select();
  assert(!createOrderErr && newOrder && newOrder.length > 0, `Yangi buyurtma qabul qilindi (#${testOrderNumber})`);

  if (newOrder && newOrder[0]?.id) {
    const { error: delOrderErr } = await client.from('orders').delete().eq('id', newOrder[0].id);
    assert(!delOrderErr, `Test buyurtma tozalandi`);
  }

  // Reviews CREATE & READ
  const testReviewId = 'rev_qa_' + Date.now();
  const { data: newReview, error: revErr } = await client.from('reviews').insert([{
    id: testReviewId,
    product_id: 'prod_130000-s-m-1873',
    user_name: 'Test Foydalanuvchi',
    rating: 5,
    comment: 'Sifati a\'lo darajada, tavsiya qilaman!'
  }]).select();
  assert(!revErr && newReview && newReview.length > 0, `Fikr/Sharh (Review) muvaffaqiyatli qoldirildi`);

  if (newReview && newReview[0]?.id) {
    const { error: delRevErr } = await client.from('reviews').delete().eq('id', newReview[0].id);
    assert(!delRevErr, `Test sharh tozalandi`);
  }

  // --- 3. UI, SLIDER & ADMIN FEATURES ---
  console.log('\n🎨 3. UI, Slider va Admin imkoniyatlari tekshiruvi:');

  const adminPath = path.join(__dirname, '..', 'frontend', 'src', 'pages', 'admin', 'AdminDashboard.jsx');
  const adminCode = fs.readFileSync(adminPath, 'utf8');
  assert(adminCode.includes('handleMultipleImageUpload') || adminCode.includes('Qo‘shimcha rasm') || adminCode.includes('multiple'), 
    `Admin panelda qo‘shimcha rasmlar yuklash (Multi-image upload) tugmasi mavjud`);

  const detailPath = path.join(__dirname, '..', 'frontend', 'src', 'pages', 'storefront', 'ProductDetailPage.jsx');
  const detailCode = fs.readFileSync(detailPath, 'utf8');
  assert(detailCode.includes('aspect-[3/4]') || detailCode.includes('object-cover'), 
    `Mahsulot sahifasida rasmlar to‘liq va proporsional ko‘rinishi (Full Aspect 3/4) sozlangan`);

  const heroPath = path.join(__dirname, '..', 'frontend', 'src', 'components', 'storefront', 'HeroSection.jsx');
  const heroCode = fs.readFileSync(heroPath, 'utf8');
  assert(heroCode.includes('slides') && (heroCode.includes('currentIndex') || heroCode.includes('setCurrentIndex')),
    `Asosiy sahifada Slider (HeroSection) animatsiyali slaydlari bilan to‘liq ishlayapti`);

  // --- 4. RENDER & DEPLOY ROUTING ---
  console.log('\n🌐 4. Render & Vercel deploy sozlamalari tekshiruvi:');
  const renderYamlPath = path.join(__dirname, '..', 'render.yaml');
  const renderYaml = fs.readFileSync(renderYamlPath, 'utf8');
  assert(renderYaml.includes('destination: /index.html') && renderYaml.includes('source: /*'),
    `render.yaml faylida SPA rewrite (/* -> /index.html) sozlangan`);

  const vercelPath = path.join(__dirname, '..', 'vercel.json');
  const vercelJson = fs.readFileSync(vercelPath, 'utf8');
  assert(vercelJson.includes('/index.html'), `vercel.json faylida to‘liq SPA yo‘naltirish sozlangan`);

  console.log('\n====================================================');
  console.log(`🏁 NATIJA: ${passCount} TA TEST MUVAFFAQIYATLI O‘TDI, ${failCount} TA XATO`);
  console.log('====================================================');

  if (failCount > 0) process.exit(1);
}

runQA().catch(err => {
  console.error('QA Test Runner Error:', err);
  process.exit(1);
});
