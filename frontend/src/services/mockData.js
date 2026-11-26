/**
 * Mock Data Service for TEXNOLUX Platform
 * Clean initial state: 0 preloaded products; populated live via Telegram bot or Admin panel.
 */

export const defaultCategories = [
  {
    _id: 'cat_kir_yuvish',
    id: 'cat_kir_yuvish',
    name: 'Kir Yuvish Mashinalari',
    slug: 'kir-yuvish-mashinalari',
    department: 'maishiy-texnika',
    departmentName: 'Maishiy Texnika',
    icon: 'Sparkles',
    description: 'Avtomat va invertor kir yuvish mashinalari (6 kg - 12 kg)',
    image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600&auto=format&fit=crop&q=80',
    order: 1,
    active: true
  },
  {
    _id: 'cat_muzlatgichlar',
    id: 'cat_muzlatgichlar',
    name: 'Muzlatgichlar & Morozilniklar',
    slug: 'muzlatgichlar',
    department: 'maishiy-texnika',
    departmentName: 'Maishiy Texnika',
    icon: 'Snowflake',
    description: 'No Frost muzlatgichlar, ikki kamerali xolodilniklar va morozilniklar',
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&auto=format&fit=crop&q=80',
    order: 2,
    active: true
  },
  {
    _id: 'cat_televizorlar',
    id: 'cat_televizorlar',
    name: 'Televizorlar & Audio',
    slug: 'televizorlar',
    department: 'elektronika',
    departmentName: 'Elektronika & TV',
    icon: 'Tv',
    description: '4K Smart TV, Android TV, QLED televizorlar va audio tizimlar',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&auto=format&fit=crop&q=80',
    order: 3,
    active: true
  },
  {
    _id: 'cat_konditsionerlar',
    id: 'cat_konditsionerlar',
    name: 'Konditsionerlar & Iqlim',
    slug: 'konditsionerlar',
    department: 'iqlim-texnikasi',
    departmentName: 'Iqlim Texnikasi',
    icon: 'Wind',
    description: 'Invertor split konditsionerlar, isitgichlar va havo sovutgichlar',
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=600&auto=format&fit=crop&q=80',
    order: 4,
    active: true
  },
  {
    _id: 'cat_oshxona',
    id: 'cat_oshxona',
    name: 'Oshxona Texnikasi',
    slug: 'oshxona-texnikasi',
    department: 'oshxona',
    departmentName: 'Oshxona Texnikasi',
    icon: 'Flame',
    description: 'Gaz plitalar, duxovkalar, mikroto‘lqinli pechlar, vityajkalar va mayda oshxona texnikasi',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&auto=format&fit=crop&q=80',
    order: 5,
    active: true
  },
  {
    _id: 'cat_uy_tozalash',
    id: 'cat_uy_tozalash',
    name: 'Changyutgich & Dazmollar',
    slug: 'uy-tozalash',
    department: 'uy-texnikasi',
    departmentName: 'Uy Texnikasi',
    icon: 'Zap',
    description: 'Changyutgichlar, robot-pilesoslar, dazmollar va parogeneratorlar',
    image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&auto=format&fit=crop&q=80',
    order: 6,
    active: true
  },
  {
    _id: 'cat_boshqa_texnika',
    id: 'cat_boshqa_texnika',
    name: 'Boshqa Texnika',
    slug: 'boshqa-texnika',
    department: 'maishiy-texnika',
    departmentName: 'Maishiy Texnika',
    icon: 'Layers',
    description: 'Barcha turdagi qo‘shimcha maishiy texnika va elektronika jihozlari',
    image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600&auto=format&fit=crop&q=80',
    order: 7,
    active: true
  }
];

export const defaultProducts = [
  {
    "_id": "prod_immer-90-tali-gaz-2695",
    "id": "prod_immer-90-tali-gaz-2695",
    "title": "Immer 90 tali gaz",
    "slug": "immer-90-tali-gaz-2695",
    "sku": "TXL-622695",
    "price": 4690250,
    "oldPrice": 5393788,
    "old_price": 5393788,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "Immer",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615384_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Immer 90 tali gaz — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "Immer"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:37:02.695Z"
  },
  {
    "_id": "prod_boshqa-texnika-9002",
    "id": "prod_boshqa-texnika-9002",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-9002",
    "sku": "TXL-619002",
    "price": 1285000,
    "oldPrice": 1477750,
    "old_price": 1477750,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615369_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:59.002Z"
  },
  {
    "_id": "prod_ziffler-kuler-7869",
    "id": "prod_ziffler-kuler-7869",
    "title": "Ziffler kuler",
    "slug": "ziffler-kuler-7869",
    "sku": "TXL-617869",
    "price": 963750,
    "oldPrice": 1108313,
    "old_price": 1108313,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Muzlatgichlar & Morozilniklar",
    "category_slug": "muzlatgichlar",
    "categorySlug": "muzlatgichlar",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "Ziffler",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615252_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Ziffler kuler — mahsulotlarni uzoq vaqt yangi saqlovchi ishonchli va tejamkor sovutish texnikasi.",
    "specifications": [
      {
        "label": "Brend",
        "value": "Ziffler"
      },
      {
        "label": "Sovutish tizimi",
        "value": "Standart / Zamonaviy"
      },
      {
        "label": "Kafolat",
        "value": "1 yil rasmiy kafolat"
      }
    ],
    "created_at": "2026-11-25T06:36:57.869Z"
  },
  {
    "_id": "prod_boshqa-texnika-7753",
    "id": "prod_boshqa-texnika-7753",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-7753",
    "sku": "TXL-617753",
    "price": 1991750,
    "oldPrice": 2290513,
    "old_price": 2290513,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615166_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:57.753Z"
  },
  {
    "_id": "prod_10kg-avtomat-kir-yuvish-mashinasi-7407",
    "id": "prod_10kg-avtomat-kir-yuvish-mashinasi-7407",
    "title": "10kg Avtomat Kir Yuvish Mashinasi",
    "slug": "10kg-avtomat-kir-yuvish-mashinasi-7407",
    "sku": "TXL-617407",
    "price": 5782500,
    "oldPrice": 6649875,
    "old_price": 6649875,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Kir Yuvish Mashinalari",
    "category_slug": "kir-yuvish-mashinalari",
    "categorySlug": "kir-yuvish-mashinalari",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615150_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "10kg Avtomat Kir Yuvish Mashinasi — zamonaviy va tejamkor kir yuvish texnikasi. Kiyimlarni ehtiyotkorlik bilan toza yuvadi, suv va elektr energiyasini tejaydi.",
    "specifications": [
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Yuklama hajmi",
        "value": "10 kg"
      },
      {
        "label": "Turi",
        "value": "To‘liq avtomat"
      },
      {
        "label": "Kafolat",
        "value": "1 yil rasmiy kafolat"
      }
    ],
    "created_at": "2026-11-25T06:36:57.407Z"
  },
  {
    "_id": "prod_boshqa-texnika-6868",
    "id": "prod_boshqa-texnika-6868",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-6868",
    "sku": "TXL-616868",
    "price": 3212500,
    "oldPrice": 3694375,
    "old_price": 3694375,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615483_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:56.868Z"
  },
  {
    "_id": "prod_boshqa-texnika-6646",
    "id": "prod_boshqa-texnika-6646",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-6646",
    "sku": "TXL-616646",
    "price": 1991750,
    "oldPrice": 2290513,
    "old_price": 2290513,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611985_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:56.646Z"
  },
  {
    "_id": "prod_boshqa-texnika-6469",
    "id": "prod_boshqa-texnika-6469",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-6469",
    "sku": "TXL-616469",
    "price": 2827000,
    "oldPrice": 3251050,
    "old_price": 3251050,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615800_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:56.469Z"
  },
  {
    "_id": "prod_lg-8kg-avtomat-kir-yuvish-mashinasi-6289",
    "id": "prod_lg-8kg-avtomat-kir-yuvish-mashinasi-6289",
    "title": "LG 8kg Avtomat Kir Yuvish Mashinasi",
    "slug": "lg-8kg-avtomat-kir-yuvish-mashinasi-6289",
    "sku": "TXL-616289",
    "price": 5589750,
    "oldPrice": 6428212,
    "old_price": 6428212,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Kir Yuvish Mashinalari",
    "category_slug": "kir-yuvish-mashinalari",
    "categorySlug": "kir-yuvish-mashinalari",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "LG",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615411_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "LG 8kg Avtomat Kir Yuvish Mashinasi — zamonaviy va tejamkor kir yuvish texnikasi. Kiyimlarni ehtiyotkorlik bilan toza yuvadi, suv va elektr energiyasini tejaydi.",
    "specifications": [
      {
        "label": "Brend",
        "value": "LG"
      },
      {
        "label": "Yuklama hajmi",
        "value": "8 kg"
      },
      {
        "label": "Turi",
        "value": "To‘liq avtomat"
      },
      {
        "label": "Kafolat",
        "value": "1 yil rasmiy kafolat"
      }
    ],
    "created_at": "2026-11-25T06:36:56.289Z"
  },
  {
    "_id": "prod_7tech-marazilka-249-litir-6265",
    "id": "prod_7tech-marazilka-249-litir-6265",
    "title": "7TECh marazilka 249 litir",
    "slug": "7tech-marazilka-249-litir-6265",
    "sku": "TXL-616265",
    "price": 3019750,
    "oldPrice": 3472712,
    "old_price": 3472712,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615788_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "7TECh marazilka 249 litir — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:56.265Z"
  },
  {
    "_id": "prod_boshqa-texnika-6240",
    "id": "prod_boshqa-texnika-6240",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-6240",
    "sku": "TXL-616240",
    "price": 1092250,
    "oldPrice": 1256088,
    "old_price": 1256088,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615531_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:56.240Z"
  },
  {
    "_id": "prod_rulls-kir-yuvish-mashinasi-8-kg-sig-im-6166",
    "id": "prod_rulls-kir-yuvish-mashinasi-8-kg-sig-im-6166",
    "title": "RULLS kir yuvish mashinasi 🧺 🔹 8 kg sig‘im",
    "slug": "rulls-kir-yuvish-mashinasi-8-kg-sig-im-6166",
    "sku": "TXL-616166",
    "price": 2557150,
    "oldPrice": 2940723,
    "old_price": 2940723,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Kir Yuvish Mashinalari",
    "category_slug": "kir-yuvish-mashinalari",
    "categorySlug": "kir-yuvish-mashinalari",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "Rulls",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615383_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "RULLS kir yuvish mashinasi 🧺 🔹 8 kg sig‘im — zamonaviy va tejamkor kir yuvish texnikasi. Kiyimlarni ehtiyotkorlik bilan toza yuvadi, suv va elektr energiyasini tejaydi.",
    "specifications": [
      {
        "label": "Brend",
        "value": "Rulls"
      },
      {
        "label": "Yuklama hajmi",
        "value": "8 kg"
      },
      {
        "label": "Turi",
        "value": "To‘liq avtomat"
      },
      {
        "label": "Dvigatel",
        "value": "Inverter (tejamkor va jim)"
      },
      {
        "label": "Kafolat",
        "value": "1 yil rasmiy kafolat"
      }
    ],
    "created_at": "2026-11-25T06:36:56.166Z"
  },
  {
    "_id": "prod_immer-8kg-avtomat-kir-yuvish-mashinasi-6148",
    "id": "prod_immer-8kg-avtomat-kir-yuvish-mashinasi-6148",
    "title": "Immer 8kg Avtomat Kir Yuvish Mashinasi",
    "slug": "immer-8kg-avtomat-kir-yuvish-mashinasi-6148",
    "sku": "TXL-616148",
    "price": 2698500,
    "oldPrice": 3103275,
    "old_price": 3103275,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Kir Yuvish Mashinalari",
    "category_slug": "kir-yuvish-mashinalari",
    "categorySlug": "kir-yuvish-mashinalari",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "Immer",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615111_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Immer 8kg Avtomat Kir Yuvish Mashinasi — zamonaviy va tejamkor kir yuvish texnikasi. Kiyimlarni ehtiyotkorlik bilan toza yuvadi, suv va elektr energiyasini tejaydi.",
    "specifications": [
      {
        "label": "Brend",
        "value": "Immer"
      },
      {
        "label": "Yuklama hajmi",
        "value": "8 kg"
      },
      {
        "label": "Turi",
        "value": "To‘liq avtomat"
      },
      {
        "label": "Kafolat",
        "value": "1 yil rasmiy kafolat"
      }
    ],
    "created_at": "2026-11-25T06:36:56.148Z"
  },
  {
    "_id": "prod_pasuda-moyka-ziffler-6118",
    "id": "prod_pasuda-moyka-ziffler-6118",
    "title": "Pasuda moyka Ziffler",
    "slug": "pasuda-moyka-ziffler-6118",
    "sku": "TXL-616118",
    "price": 4112000,
    "oldPrice": 4728800,
    "old_price": 4728800,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "Ziffler",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615268_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Pasuda moyka Ziffler — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "Ziffler"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:56.118Z"
  },
  {
    "_id": "prod_immer-185-75-sm-6098",
    "id": "prod_immer-185-75-sm-6098",
    "title": "Immer 185/75 sm",
    "slug": "immer-185-75-sm-6098",
    "sku": "TXL-616098",
    "price": 5898150,
    "oldPrice": 6782872,
    "old_price": 6782872,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "Immer",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615462_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Immer 185/75 sm — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "Immer"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:56.098Z"
  },
  {
    "_id": "prod_immer-60-tali-gaz-5929",
    "id": "prod_immer-60-tali-gaz-5929",
    "title": "Immer 60 tali Gaz",
    "slug": "immer-60-tali-gaz-5929",
    "sku": "TXL-615929",
    "price": 2698500,
    "oldPrice": 3103275,
    "old_price": 3103275,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "Immer",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615270_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Immer 60 tali Gaz — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "Immer"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:55.929Z"
  },
  {
    "_id": "prod_boshqa-texnika-5766",
    "id": "prod_boshqa-texnika-5766",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-5766",
    "sku": "TXL-615766",
    "price": 771000,
    "oldPrice": 886650,
    "old_price": 886650,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615301_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:55.766Z"
  },
  {
    "_id": "prod_hisense-7kg-avtomat-kir-yuvish-mashinasi-5720",
    "id": "prod_hisense-7kg-avtomat-kir-yuvish-mashinasi-5720",
    "title": "Hisense 7kg Avtomat Kir Yuvish Mashinasi",
    "slug": "hisense-7kg-avtomat-kir-yuvish-mashinasi-5720",
    "sku": "TXL-615720",
    "price": 3276750,
    "oldPrice": 3768262,
    "old_price": 3768262,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Kir Yuvish Mashinalari",
    "category_slug": "kir-yuvish-mashinalari",
    "categorySlug": "kir-yuvish-mashinalari",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "Hisense",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-615130_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Hisense 7kg Avtomat Kir Yuvish Mashinasi — zamonaviy va tejamkor kir yuvish texnikasi. Kiyimlarni ehtiyotkorlik bilan toza yuvadi, suv va elektr energiyasini tejaydi.",
    "specifications": [
      {
        "label": "Brend",
        "value": "Hisense"
      },
      {
        "label": "Yuklama hajmi",
        "value": "7 kg"
      },
      {
        "label": "Turi",
        "value": "To‘liq avtomat"
      },
      {
        "label": "Kafolat",
        "value": "1 yil rasmiy kafolat"
      }
    ],
    "created_at": "2026-11-25T06:36:55.720Z"
  },
  {
    "_id": "prod_boshqa-texnika-5516",
    "id": "prod_boshqa-texnika-5516",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-5516",
    "sku": "TXL-615516",
    "price": 4497500,
    "oldPrice": 5172125,
    "old_price": 5172125,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611892_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:55.516Z"
  },
  {
    "_id": "prod_boshqa-texnika-5335",
    "id": "prod_boshqa-texnika-5335",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-5335",
    "sku": "TXL-615335",
    "price": 2955500,
    "oldPrice": 3398825,
    "old_price": 3398825,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611883_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:55.335Z"
  },
  {
    "_id": "prod_boshqa-texnika-5235",
    "id": "prod_boshqa-texnika-5235",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-5235",
    "sku": "TXL-615235",
    "price": 2184500,
    "oldPrice": 2512175,
    "old_price": 2512175,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611799_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:55.235Z"
  },
  {
    "_id": "prod_boshqa-texnika-4913",
    "id": "prod_boshqa-texnika-4913",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-4913",
    "sku": "TXL-614913",
    "price": 925200,
    "oldPrice": 1063980,
    "old_price": 1063980,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611967_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:54.913Z"
  },
  {
    "_id": "prod_boshqa-texnika-4799",
    "id": "prod_boshqa-texnika-4799",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-4799",
    "sku": "TXL-614799",
    "price": 10280000,
    "oldPrice": 11822000,
    "old_price": 11822000,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611919_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:54.799Z"
  },
  {
    "_id": "prod_boshqa-texnika-4479",
    "id": "prod_boshqa-texnika-4479",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-4479",
    "sku": "TXL-614479",
    "price": 2248750,
    "oldPrice": 2586063,
    "old_price": 2586063,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-612103_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:54.479Z"
  },
  {
    "_id": "prod_380-litir-4419",
    "id": "prod_380-litir-4419",
    "title": "380 litir",
    "slug": "380-litir-4419",
    "sku": "TXL-614419",
    "price": 5782500,
    "oldPrice": 6649875,
    "old_price": 6649875,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611778_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "380 litir — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:54.419Z"
  },
  {
    "_id": "prod_7kg-avtomat-kir-yuvish-mashinasi-4269",
    "id": "prod_7kg-avtomat-kir-yuvish-mashinasi-4269",
    "title": "7kg Avtomat Kir Yuvish Mashinasi",
    "slug": "7kg-avtomat-kir-yuvish-mashinasi-4269",
    "sku": "TXL-614269",
    "price": 2827000,
    "oldPrice": 3251050,
    "old_price": 3251050,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Kir Yuvish Mashinalari",
    "category_slug": "kir-yuvish-mashinalari",
    "categorySlug": "kir-yuvish-mashinalari",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611786_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "7kg Avtomat Kir Yuvish Mashinasi — zamonaviy va tejamkor kir yuvish texnikasi. Kiyimlarni ehtiyotkorlik bilan toza yuvadi, suv va elektr energiyasini tejaydi.",
    "specifications": [
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Yuklama hajmi",
        "value": "7 kg"
      },
      {
        "label": "Turi",
        "value": "To‘liq avtomat"
      },
      {
        "label": "Kafolat",
        "value": "1 yil rasmiy kafolat"
      }
    ],
    "created_at": "2026-11-25T06:36:54.269Z"
  },
  {
    "_id": "prod_boshqa-texnika-3466",
    "id": "prod_boshqa-texnika-3466",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-3466",
    "sku": "TXL-613466",
    "price": 1799000,
    "oldPrice": 2068850,
    "old_price": 2068850,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611956_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:53.466Z"
  },
  {
    "_id": "prod_boshqa-texnika-3384",
    "id": "prod_boshqa-texnika-3384",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-3384",
    "sku": "TXL-613384",
    "price": 1606250,
    "oldPrice": 1847187,
    "old_price": 1847187,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611948_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:53.384Z"
  },
  {
    "_id": "prod_boshqa-texnika-3284",
    "id": "prod_boshqa-texnika-3284",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-3284",
    "sku": "TXL-613284",
    "price": 321250,
    "oldPrice": 369438,
    "old_price": 369438,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611930_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:53.284Z"
  },
  {
    "_id": "prod_boshqa-texnika-3253",
    "id": "prod_boshqa-texnika-3253",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-3253",
    "sku": "TXL-613253",
    "price": 2120250,
    "oldPrice": 2438288,
    "old_price": 2438288,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611992_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:53.253Z"
  },
  {
    "_id": "prod_boshqa-texnika-3200",
    "id": "prod_boshqa-texnika-3200",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-3200",
    "sku": "TXL-613200",
    "price": 4497500,
    "oldPrice": 5172125,
    "old_price": 5172125,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611940_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:53.200Z"
  },
  {
    "_id": "prod_boshqa-texnika-3178",
    "id": "prod_boshqa-texnika-3178",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-3178",
    "sku": "TXL-613178",
    "price": 5525500,
    "oldPrice": 6354325,
    "old_price": 6354325,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611782_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:53.178Z"
  },
  {
    "_id": "prod_boshqa-texnika-2939",
    "id": "prod_boshqa-texnika-2939",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-2939",
    "sku": "TXL-612939",
    "price": 449750,
    "oldPrice": 517212,
    "old_price": 517212,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611870_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:52.939Z"
  },
  {
    "_id": "prod_boshqa-texnika-2855",
    "id": "prod_boshqa-texnika-2855",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-2855",
    "sku": "TXL-612855",
    "price": 989450,
    "oldPrice": 1137868,
    "old_price": 1137868,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-612075_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:52.855Z"
  },
  {
    "_id": "prod_12-tali-18-tali-450-2709",
    "id": "prod_12-tali-18-tali-450-2709",
    "title": "12 tali 18 tali 450$",
    "slug": "12-tali-18-tali-450-2709",
    "sku": "TXL-612709",
    "price": 3790750,
    "oldPrice": 4359363,
    "old_price": 4359363,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611148_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "12 tali 18 tali 450$ — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:52.709Z"
  },
  {
    "_id": "prod_rulls-10-kg-avtomat-kir-yuvish-mashinasi-2662",
    "id": "prod_rulls-10-kg-avtomat-kir-yuvish-mashinasi-2662",
    "title": "Rulls 10 kg Avtomat Kir Yuvish Mashinasi",
    "slug": "rulls-10-kg-avtomat-kir-yuvish-mashinasi-2662",
    "sku": "TXL-612662",
    "price": 3533750,
    "oldPrice": 4063812,
    "old_price": 4063812,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Kir Yuvish Mashinalari",
    "category_slug": "kir-yuvish-mashinalari",
    "categorySlug": "kir-yuvish-mashinalari",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "Rulls",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-612084_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Rulls 10 kg Avtomat Kir Yuvish Mashinasi — zamonaviy va tejamkor kir yuvish texnikasi. Kiyimlarni ehtiyotkorlik bilan toza yuvadi, suv va elektr energiyasini tejaydi.",
    "specifications": [
      {
        "label": "Brend",
        "value": "Rulls"
      },
      {
        "label": "Yuklama hajmi",
        "value": "10 kg"
      },
      {
        "label": "Turi",
        "value": "To‘liq avtomat"
      },
      {
        "label": "Kafolat",
        "value": "1 yil rasmiy kafolat"
      }
    ],
    "created_at": "2026-11-25T06:36:52.662Z"
  },
  {
    "_id": "prod_boshqa-texnika-2562",
    "id": "prod_boshqa-texnika-2562",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-2562",
    "sku": "TXL-612562",
    "price": 1413500,
    "oldPrice": 1625525,
    "old_price": 1625525,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611792_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:52.562Z"
  },
  {
    "_id": "prod_boshqa-texnika-2507",
    "id": "prod_boshqa-texnika-2507",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-2507",
    "sku": "TXL-612507",
    "price": 771000,
    "oldPrice": 886650,
    "old_price": 886650,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611847_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:52.507Z"
  },
  {
    "_id": "prod_boshqa-texnika-2481",
    "id": "prod_boshqa-texnika-2481",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-2481",
    "sku": "TXL-612481",
    "price": 771000,
    "oldPrice": 886650,
    "old_price": 886650,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-612077_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:52.481Z"
  },
  {
    "_id": "prod_boshqa-texnika-2453",
    "id": "prod_boshqa-texnika-2453",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-2453",
    "sku": "TXL-612453",
    "price": 1542000,
    "oldPrice": 1773300,
    "old_price": 1773300,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611854_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:52.453Z"
  },
  {
    "_id": "prod_boshqa-texnika-2405",
    "id": "prod_boshqa-texnika-2405",
    "title": "Boshqa Texnika",
    "slug": "boshqa-texnika-2405",
    "sku": "TXL-612405",
    "price": 2120250,
    "oldPrice": 2438288,
    "old_price": 2438288,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-611830_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "Boshqa Texnika — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:52.405Z"
  },
  {
    "_id": "prod_200-litir-2297",
    "id": "prod_200-litir-2297",
    "title": "200 litir",
    "slug": "200-litir-2297",
    "sku": "TXL-612297",
    "price": 3276750,
    "oldPrice": 3768262,
    "old_price": 3768262,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Boshqa Texnika",
    "category_slug": "boshqa-texnika",
    "categorySlug": "boshqa-texnika",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-610683_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "200 litir — TEXNOLUX do‘konidan sifatli va rasmiy kafolatli maishiy texnika. O‘zbekiston bo‘ylab tezkor yetkazib berish xizmati mavjud.",
    "specifications": [
      {
        "label": "Yo‘nalish",
        "value": "Maishiy Texnika"
      },
      {
        "label": "Toifa",
        "value": "Boshqa Texnika"
      },
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Holati",
        "value": "Yangi / Kafolatli"
      },
      {
        "label": "Yetkazib berish",
        "value": "O‘zbekiston bo‘ylab tezkor"
      }
    ],
    "created_at": "2026-11-25T06:36:52.297Z"
  },
  {
    "_id": "prod_8-5-kg-avtomat-kir-yuvish-mashinasi-2130",
    "id": "prod_8-5-kg-avtomat-kir-yuvish-mashinasi-2130",
    "title": "8.5 kg Avtomat Kir Yuvish Mashinasi",
    "slug": "8-5-kg-avtomat-kir-yuvish-mashinasi-2130",
    "sku": "TXL-612130",
    "price": 5127150,
    "oldPrice": 5896223,
    "old_price": 5896223,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Kir Yuvish Mashinalari",
    "category_slug": "kir-yuvish-mashinalari",
    "categorySlug": "kir-yuvish-mashinalari",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-610779_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "8.5 kg Avtomat Kir Yuvish Mashinasi — zamonaviy va tejamkor kir yuvish texnikasi. Kiyimlarni ehtiyotkorlik bilan toza yuvadi, suv va elektr energiyasini tejaydi.",
    "specifications": [
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Yuklama hajmi",
        "value": "8.5 kg"
      },
      {
        "label": "Turi",
        "value": "To‘liq avtomat"
      },
      {
        "label": "Kafolat",
        "value": "1 yil rasmiy kafolat"
      }
    ],
    "created_at": "2026-11-25T06:36:52.130Z"
  },
  {
    "_id": "prod_10-5-kg-avtomat-kir-yuvish-mashinasi-1059",
    "id": "prod_10-5-kg-avtomat-kir-yuvish-mashinasi-1059",
    "title": "10.5 kg Avtomat Kir Yuvish Mashinasi",
    "slug": "10-5-kg-avtomat-kir-yuvish-mashinasi-1059",
    "sku": "TXL-611059",
    "price": 4497500,
    "oldPrice": 5172125,
    "old_price": 5172125,
    "discountPercent": 13,
    "discount_percent": 13,
    "category": "Kir Yuvish Mashinalari",
    "category_slug": "kir-yuvish-mashinalari",
    "categorySlug": "kir-yuvish-mashinalari",
    "department": "maishiy-texnika",
    "departmentName": "Maishiy Texnika",
    "subcategory": "",
    "brand": "TEXNOLUX",
    "stock": 25,
    "inStock": true,
    "in_stock": true,
    "rating": 5,
    "reviews_count": 0,
    "images": [
      "/uploads/prod-610480_1.jpg"
    ],
    "is_bestseller": true,
    "is_new_arrival": true,
    "is_weekly_deal": false,
    "variantLabel": "",
    "variants": [],
    "description": "10.5 kg Avtomat Kir Yuvish Mashinasi — zamonaviy va tejamkor kir yuvish texnikasi. Kiyimlarni ehtiyotkorlik bilan toza yuvadi, suv va elektr energiyasini tejaydi.",
    "specifications": [
      {
        "label": "Brend",
        "value": "TEXNOLUX"
      },
      {
        "label": "Yuklama hajmi",
        "value": "10.5 kg"
      },
      {
        "label": "Turi",
        "value": "To‘liq avtomat"
      },
      {
        "label": "Kafolat",
        "value": "1 yil rasmiy kafolat"
      }
    ],
    "created_at": "2026-11-25T06:36:51.059Z"
  }
];

export const defaultBanners = [];

export const defaultCoupons = [];

export const defaultReviews = [];

export const defaultOrders = [];

// ── LOCAL STORAGE ADAPTER HELPERS ──
export function getLocalCollection(key, fallback) {
  try {
    const obsoleteKeys = [
      'nsb_products_v14_clean_bot',
      'nsb_categories_v14_clean_bot',
      'nsb_banners_v14_clean_bot',
      'nsb_coupons_v14_clean_bot',
      'nsb_reviews_v14_clean_bot',
      'nsb_orders_v14_clean_bot',
      'nsb_products_v13_bot_only',
      'nsb_products_v12_all_catalog',
      'nsb_products_v11_all_catalog',
      'nsb_products_v10_real',
      'nsb_products_v9_realprices',
      'nsb_products_v8_realprices',
      'nsb_products_v7_realprices',
      'nsb_products_v6_sport',
      'nsb_products_v5_sport',
      'nsb_products_v4_sport',
      'nsb_products_v3_sport',
      'nsb_products_v2_sport',
      'nsb_products_v1_sport',
      'nsb_products_sport',
      'nsb_products',
      'products',
      'nsb_categories_v8_multidept',
      'nsb_categories_v3_sport',
      'nsb_banners_v4_sport',
      'nsb_banners_v3_sport'
    ];
    for (const oldKey of obsoleteKeys) {
      if (oldKey !== key) {
        try { localStorage.removeItem(oldKey); } catch (_) {}
      }
    }

    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);

    if (key.includes('categories') && Array.isArray(parsed)) {
      const hasOldCats = parsed.some(c =>
        ['yol-xavfsizligi', 'drellar-shurupovyortlar', 'krossovkalar', 'trenajorlar'].includes(c.slug)
      );
      if (hasOldCats || parsed.length !== fallback.length) {
        localStorage.setItem(key, JSON.stringify(fallback));
        return fallback;
      }
      return parsed;
    }

    return Array.isArray(parsed) ? parsed : fallback;
  } catch (err) {
    console.warn('LocalStorage read error:', err);
    return fallback;
  }
}

export function saveLocalCollection(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage write error:', err);
  }
}
