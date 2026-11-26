# TEXNOLUX

**TEXNOLUX — Ishonchli va Barakali** maishiy texnika va elektronika do‘koni hamda Telegram Mini App platformasi.

## 🚀 Imkoniyatlar va Texnologiyalar

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons
- **Telegram Mini App & Bot (`tools/telegram_product_bot.js`)**:
  - Kanalga a’zolik oqimi va bir bosishda Mini App do‘konini ochish
  - Telegram botga rasm va narx yuborish orqali mahsulotlarni avtomatik kategoriya va brend bilan do‘konga qo‘shish
  - Foydalanuvchi profilini avtomatik tanish, shaxsiy avatar yuklash, buyurtmalar kuzatuvi va real-vaqt eslatmalar
- **Storefront & Admin (`/admin`)**:
  - Mahsulotlar, kategoriyalar, buyurtmalar, mijozlar bazasi, bannerlar, kuponlar va sharhlar boshqaruvi
  - Kun/Tun (Dark/Light) mavzusi hamda ko‘p tilli interfeys (`UZ / RU / EN`)
- **Deploy**: Vercel (`vercel.json` tayyorlangan)

---

## 📦 Loyihani Ishga Tushirish

```bash
# 1. Atrof-muhit sozlamalari (.env)
cp .env.example .env

# 2. Frontend bog'liqliklari va ishga tushirish
cd frontend
npm install
npm run dev

# 3. Telegram botni ishga tushirish
node ../tools/telegram_product_bot.js
```

---

## 🌐 Vercel-ga Joylash

1. [TEXNOLUX GitHub ombori](https://github.com/AbdulazizOrifjonov/TEXNOLUX) ni [Vercel](https://vercel.com) bilan ulang.
2. `vercel.json` orqali frontend avtomatik yig‘iladi (`cd frontend && npm run build`, chiqish papkasi `frontend/dist`).
