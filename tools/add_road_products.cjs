const { createClient } = require('../frontend/node_modules/@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error('Set SUPABASE_URL and SUPABASE_KEY.');
const client = createClient(SUPABASE_URL, SUPABASE_KEY);

const products = [
  {
    id: 'prod_konus-tpu-75sm',
    title: 'Yo‘l harakati xavfsizlik konusi TPU 75 sm (Egiluvchan, nur qaytaruvchi tasmali)',
    slug: 'konus-tpu-75sm',
    sku: 'NSB-YOL-001',
    description: 'TPU (termoplastik poliuretan) materialidan tayyorlangan 75 sm balandlikdagi yuqori elastiklikka ega professional yo‘l harakati xavfsizlik konusi. Avtomobil g‘ildiraklari bosib o‘tganda ham sinmaydi, yorilmaydi va bir necha soniyada o‘z asl shakliga to‘liq qaytadi. Kechasi va noqulay ob-havo (tuman, yomg‘ir) sharoitida 360 daraja uzoq masofadan ko‘rinuvchi 2 qator nur qaytaruvchi (svetootrajayushchiy) tasmalar bilan jihozlangan.',
    price: 130000,
    old_price: 155000,
    discount_percent: 16,
    category: 'Yo‘l Konuslari & To‘siqlar',
    category_slug: 'yol-konuslari',
    subcategory: 'Signal konuslari',
    brand: 'Road Safety Pro',
    stock: 45,
    in_stock: true,
    rating: 5.0,
    reviews_count: 4,
    images: ['/uploads/konus-tpu-75sm.jpg'],
    variants: [{ name: '75 sm', price: 130000, inStock: true }],
    is_bestseller: true,
    is_new_arrival: true,
    is_weekly_deal: false,
    specifications: [
      { label: 'Balandligi', value: '75 sm' },
      { label: 'Asosiy material', value: 'Yuqori sifatli TPU (Termoplastik poliuretan)' },
      { label: 'Xususiyati', value: '100% egiluvchan, mashina ezsa ham buzilmaydi' },
      { label: 'Nur qaytarish', value: '2 qator mikro-prizmatik yorug‘lik qaytaruvchi lenta' },
      { label: 'Harorat chidamliligi', value: '-40°C dan +70°C gacha' }
    ]
  },
  {
    id: 'prod_taktil-plitka-pvc',
    title: 'PVX Taktil plitka 300x300 mm (Ko‘zi ojizlar uchun yo‘naltiruvchi va ogohlantiruvchi)',
    slug: 'taktil-plitka-pvc',
    sku: 'NSB-YOL-002',
    description: 'Ko‘rish qobiliyati cheklangan (ko‘zi ojiz va zaif ko‘ruvchi) insonlarning xavfsiz va to‘siqlarsiz harakatlanishini ta’minlash uchun mo‘ljallangan sariq PVX taktil plitka (300x300 mm). Plitka xalqaro standartlarga mos ikki xil teksturada ishlab chiqariladi: to‘g‘ri yo‘nalishni ko‘rsatuvchi bo‘ylama chiziqli qovurg‘alar hamda xavf, burilish va to‘siqlar oldidan ogohlantiruvchi konussimon nuqtalar.',
    price: 16000,
    old_price: 22000,
    discount_percent: 27,
    category: 'Yo‘l Konuslari & To‘siqlar',
    category_slug: 'yol-konuslari',
    subcategory: 'Taktil qoplamalar',
    brand: 'SafeWay',
    stock: 250,
    in_stock: true,
    rating: 5.0,
    reviews_count: 8,
    images: ['/uploads/taktil-plitka-pvc.jpg'],
    variants: [
      { name: 'Yo‘naltiruvchi (Chiziqli)', price: 16000, inStock: true },
      { name: 'Ogohlantiruvchi (Nuqtali)', price: 16000, inStock: true }
    ],
    is_bestseller: true,
    is_new_arrival: true,
    is_weekly_deal: false,
    specifications: [
      { label: 'O‘lchami', value: '300 x 300 x 7 mm' },
      { label: 'Material', value: 'Sifatli elastik PVX (Polivinilxlorid)' },
      { label: 'Turi', value: 'Yo‘naltiruvchi (chiziqli) va Ogohlantiruvchi (nuqtali)' },
      { label: 'Rangi', value: 'Yorqin signal sariq (Signal Yellow)' }
    ]
  }
];

async function run() {
  console.log('Inserting products into Supabase...');
  for (const p of products) {
    const { data, error } = await client.from('products').upsert(p, { onConflict: 'slug' }).select();
    if (error) {
      console.error('❌ Error inserting', p.slug, error.message);
    } else {
      console.log('✅ Successfully upserted:', p.slug, data ? data.length : 0);
    }
  }
}

run();
