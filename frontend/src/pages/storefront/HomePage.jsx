import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Filter, ChevronDown, Send } from 'lucide-react';
import HeroSection from '../../components/storefront/HeroSection';
import TrustBadges from '../../components/storefront/TrustBadges';
import ProductCard from '../../components/storefront/ProductCard';
import PromoTiles from '../../components/storefront/PromoTiles';
import ReviewsSection from '../../components/storefront/ReviewsSection';
import api from '../../services/api';

const HOME_CATEGORIES = [
  { id: 'all', label: 'Barcha Mahsulotlar' },
  { id: 'kir-yuvish-mashinalari', label: 'Kir Yuvish Mashinalari' },
  { id: 'muzlatgichlar', label: 'Muzlatgichlar' },
  { id: 'televizorlar', label: 'Televizorlar' },
  { id: 'konditsionerlar', label: 'Konditsionerlar' },
  { id: 'oshxona-texnikasi', label: 'Oshxona Texnikasi' },
  { id: 'uy-tozalash', label: 'Changyutgich & Dazmollar' },
  { id: 'boshqa-texnika', label: 'Boshqa Texnika' },
];

export default function HomePage() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState('all');
  const [visibleCount, setVisibleCount] = useState(60);

  useEffect(() => {
    api
      .get('/products/featured')
      .then((res) => {
        if (res.data.success) {
          const all = res.data.allProducts || [];
          setAllProducts(all);
          setVisibleCount(all.length || 60);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const matchesCategory = (p, catId) => {
    if (catId === 'all') return true;
    return p.category_slug === catId || p.categorySlug === catId;
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => matchesCategory(p, selectedCat));
  }, [allProducts, selectedCat]);

  const handleCategoryChange = (catId) => {
    setSelectedCat(catId);
    setVisibleCount(60);
  };

  const getCatCount = (catId) => {
    if (catId === 'all') return allProducts.length;
    return allProducts.filter((p) => matchesCategory(p, catId)).length;
  };

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0b0f19] transition-colors duration-200">
      {/* 1. Hero Grid Section */}
      <HeroSection />

      {/* 2. Trust Features Bar */}
      <TrustBadges />

      {/* 3. Promo Triple Tiles */}
      <PromoTiles />

      {/* 4. Barcha Mahsulotlar Katalogi */}
      <section className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pb-16">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-sky-400 text-xs font-bold tracking-wide uppercase mb-2">
                <Filter className="w-3.5 h-3.5" /> TEXNOLUX Katalog
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                Barcha Mahsulotlar Katalogi
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Jami {allProducts.length} ta mahsulot — ishonchli va barakali maishiy texnika
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-all shrink-0 self-start md:self-end"
            >
              Katalog filtrlari <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Interactive Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {HOME_CATEGORIES.map((cat) => {
              const count = getCatCount(cat.id);
              const isActive = selectedCat === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-slate-950/20 dark:text-slate-950'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              {displayedProducts.map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>

            {visibleCount < filteredProducts.length && (
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setVisibleCount((prev) => Math.min(prev + 20, filteredProducts.length))}
                  className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-sm font-black transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Yana 20 ta ko‘rsatish</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setVisibleCount(filteredProducts.length)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold transition-all active:scale-98 cursor-pointer"
                >
                  Barcha {filteredProducts.length} tasini ochish
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-14 px-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-sky-400 mb-3">
              <Send className="w-5 h-5" />
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Hozircha katalogda mahsulot yo‘q
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Telegram botga (<span className="font-bold text-blue-600 dark:text-sky-400">@ReferalPeople_bot</span>) mahsulot rasmi va narxini yuboring (masalan: <span className="font-mono">Rulls 10 kg 275$</span>) — bot nomi va kategoriyasi bilan shu yerga qo‘shadi!
            </p>
          </div>
        )}
      </section>

      {/* 5. Corporate Reviews & Social Proof */}
      <ReviewsSection />
    </div>
  );
}
