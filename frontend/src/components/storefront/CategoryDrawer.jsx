import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  Footprints,
  Shirt,
  Sparkles,
  Dumbbell,
  Package,
  Shield,
  Trophy,
  Activity,
  Layers,
  Award,
  ArrowRight,
  PhoneCall,
  LayoutGrid,
  X,
  Search,
  Cone,
  AlertTriangle,
  Construction,
  Wrench,
  HardHat,
  Hammer,
  Zap,
  FileText,
  Tv,
  Snowflake,
  Wind,
  Flame
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

const iconMap = {
  Footprints: <Footprints className="w-5 h-5 text-amber-500" />,
  Shirt: <Shirt className="w-5 h-5 text-blue-500" />,
  Sparkles: <Sparkles className="w-5 h-5 text-pink-500" />,
  Dumbbell: <Dumbbell className="w-5 h-5 text-emerald-500" />,
  Package: <Package className="w-5 h-5 text-violet-500" />,
  Shield: <Shield className="w-5 h-5 text-rose-500" />,
  Trophy: <Trophy className="w-5 h-5 text-amber-400" />,
  Activity: <Activity className="w-5 h-5 text-sky-400" />,
  Layers: <Layers className="w-5 h-5 text-indigo-400" />,
  Award: <Award className="w-5 h-5 text-amber-500" />,
  Cone: <Cone className="w-5 h-5 text-orange-500" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  Construction: <Construction className="w-5 h-5 text-yellow-500" />,
  Wrench: <Wrench className="w-5 h-5 text-blue-500" />,
  HardHat: <HardHat className="w-5 h-5 text-teal-500" />,
  Hammer: <Hammer className="w-5 h-5 text-indigo-500" />,
  Zap: <Zap className="w-5 h-5 text-red-500" />,
  Tv: <Tv className="w-5 h-5 text-indigo-500" />,
  Snowflake: <Snowflake className="w-5 h-5 text-cyan-500" />,
  Wind: <Wind className="w-5 h-5 text-sky-500" />,
  Flame: <Flame className="w-5 h-5 text-amber-500" />
};

export default function CategoryDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [previewProducts, setPreviewProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [catSearch, setCatSearch] = useState('');
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
      const headerEl = document.querySelector('header');
      if (headerEl) {
        const h = headerEl.getBoundingClientRect().height || headerEl.offsetHeight;
        if (h > 0) {
          document.documentElement.style.setProperty('--nsb-navbar-height', `${Math.round(h)}px`);
          document.documentElement.style.setProperty('--nsb-header-height', `${Math.round(h)}px`);
        }
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sahifa o'zgarganda katalogni avtomatik yopish
  useEffect(() => {
    if (isOpen) onClose();
  }, [location.pathname, location.search]);

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll safely and fetch categories on open
  useEffect(() => {
    if (isOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalBodyOverscroll = document.body.style.overscrollBehavior;
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'contain';

      const updateNavbarHeight = () => {
        const headerEl = document.querySelector('header');
        if (headerEl) {
          const h = headerEl.getBoundingClientRect().height || headerEl.offsetHeight;
          if (h > 0) {
            document.documentElement.style.setProperty('--nsb-navbar-height', `${Math.round(h)}px`);
            document.documentElement.style.setProperty('--nsb-header-height', `${Math.round(h)}px`);
          }
        }
      };
      updateNavbarHeight();

      api
        .get('/categories')
        .then((res) => {
          if (res.data.success && res.data.categories && res.data.categories.length > 0) {
            setCategories(res.data.categories);
            if (!activeCategory) {
              setActiveCategory(res.data.categories[0]);
            }
          }
        })
        .catch(() => {});

      return () => {
        document.body.style.overflow = originalBodyOverflow || '';
        document.body.style.overscrollBehavior = originalBodyOverscroll || '';
      };
    }
  }, [isOpen]);

  // Fetch preview products when activeCategory changes
  useEffect(() => {
    if (activeCategory && isOpen) {
      setLoadingProducts(true);
      api
        .get(`/products?categorySlug=${activeCategory.slug}&limit=12`)
        .then((res) => {
          if (res.data.success) {
            setPreviewProducts(res.data.products || []);
          }
        })
        .catch(() => {})
        .finally(() => setLoadingProducts(false));
    }
  }, [activeCategory, isOpen]);

  const handleCategoryClick = (slug) => {
    onClose();
    navigate(`/shop/${slug}`);
  };

  const handleProductClick = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const filteredCategories = categories.filter((cat) => {
    if (!catSearch.trim()) return true;
    const q = catSearch.toLowerCase();
    const name = (cat.name || '').toLowerCase();
    const slug = (cat.slug || '').toLowerCase();
    const sub = (cat.subcategories || []).some((s) => s.toLowerCase().includes(q));
    return name.includes(q) || slug.includes(q) || sub;
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-x-0 z-40 bg-white dark:bg-[#0b0f19] flex flex-col overflow-hidden animate-fadeIn border-t border-slate-200/80 dark:border-slate-800/80"
      style={{
        top: 'var(--nsb-navbar-height, 104px)',
        bottom: isDesktop
          ? '0px'
          : 'calc(64px + max(env(safe-area-inset-bottom, 0px), 8px))',
        overscrollBehavior: 'contain'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. Mobile-only Compact Bar (< 768px) - Clean title without duplicate logo */}
      {!isDesktop && (
        <div className="h-10 px-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/90 dark:bg-slate-900/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
              {t('header.catalog', 'Mahsulotlar katalogi')}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white cursor-pointer px-2 py-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 active:scale-95 transition-all"
            aria-label="Katalogni yopish"
          >
            <X className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Yopish</span>
          </button>
        </div>
      )}

      {/* 2. Content Area */}
      <div className="flex-1 w-full max-w-[1920px] mx-auto flex overflow-hidden">
        {/* Left Categories List: Responsive, full width on mobile (< md), sidebar on desktop (md+) */}
        <div className="w-full md:w-80 lg:w-96 shrink-0 border-r-0 md:border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-3 sm:p-4 bg-slate-50/70 dark:bg-black/60 space-y-1.5 pb-10 md:pb-4 overscroll-contain">
          {/* Category Search Input */}
          <div className="relative mb-2 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={catSearch}
              onChange={(e) => setCatSearch(e.target.value)}
              placeholder="Toifalar bo‘yicha qidirish..."
              className="w-full h-10 pl-9 pr-8 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-white transition-all shadow-2xs"
            />
            {catSearch && (
              <button
                type="button"
                onClick={() => setCatSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mobile All Products shortcut */}
          <button
            type="button"
            onClick={() => {
              onClose();
              navigate('/shop');
            }}
            className="w-full md:hidden flex items-center justify-between px-4 py-3 rounded-xl text-left text-xs font-bold bg-slate-950 dark:bg-white text-white dark:text-slate-950 mb-2 shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LayoutGrid className="w-4 h-4" />
              <span>Barcha mahsulotlar (Katalog)</span>
            </div>
            <ArrowRight className="w-4 h-4" />
          </button>

          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat) => {
              const isSelected = activeCategory?._id === cat._id;
              return (
                <button
                  key={cat._id}
                  onMouseEnter={() => setActiveCategory(cat)}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      handleCategoryClick(cat.slug);
                    } else {
                      setActiveCategory(cat);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 sm:py-3.5 rounded-xl text-left text-xs sm:text-sm transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700 font-bold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/50 font-semibold'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span
                      className={
                        isSelected
                          ? 'text-slate-950 dark:text-white font-bold'
                          : 'text-slate-500 dark:text-slate-400'
                      }
                    >
                      {iconMap[cat.icon] || <FileText className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </span>
                    <span className="truncate">{t(`cat.${cat.slug}`, cat.name)}</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected
                        ? 'text-slate-950 dark:text-white translate-x-1'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  />
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">
              Toifa topilmadi
            </div>
          )}
        </div>

        {/* Right Content Area: Stretches across all remaining screen width (Desktop only) */}
        <div className="hidden md:flex flex-1 min-w-0 overflow-y-auto p-6 lg:p-8 flex-col justify-between bg-white dark:bg-[#000000] overscroll-contain">
          {activeCategory ? (
            <div className="space-y-6">
              {/* Category Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight truncate">
                    {t(`cat.${activeCategory.slug}`, activeCategory.name)}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    {t('drawer.categoryBanner', "Toifaga tegishli barcha saralangan mahsulotlar")}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate('/shop');
                    }}
                    className="shrink-0 inline-flex items-center gap-2 px-3.5 py-2 sm:py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
                  >
                    <LayoutGrid className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Barcha mahsulotlar</span>
                  </button>
                  <button
                    onClick={() => handleCategoryClick(activeCategory.slug)}
                    className="self-start sm:self-auto shrink-0 inline-flex items-center gap-2 px-4 py-2 sm:py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
                  >
                    {t('drawer.viewAll', "Ushbu toifaga o‘tish")} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subcategories Tags */}
              {activeCategory.subcategories && activeCategory.subcategories.length > 0 && (
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2.5">
                    {t('drawer.subcategories', "Kichik toifalar")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeCategory.subcategories.map((sub, i) => (
                      <button
                        key={i}
                        onClick={() => handleCategoryClick(activeCategory.slug)}
                        className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Wide Top Products Preview Grid (2 to 6 columns) */}
              <div>
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-3">
                  {t('drawer.popularItems', "Ommabop mahsulotlar")}
                </h4>
                {loadingProducts ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="h-44 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
                    {previewProducts.map((p) => (
                      <div
                        key={p._id}
                        onClick={() => handleProductClick(p.slug)}
                        className="group p-2.5 sm:p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white transition-all cursor-pointer bg-slate-50/60 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:shadow-md"
                      >
                        <div className="w-full aspect-[3/4] rounded-lg bg-white dark:bg-slate-900 overflow-hidden mb-2 sm:mb-2.5 border border-slate-100 dark:border-slate-800">
                          <img
                            src={
                              p.images?.[0] ||
                              'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=300&auto=format&fit=crop&q=80'
                            }
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out will-change-transform"
                          />
                        </div>
                        <h5 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-slate-950 dark:group-hover:text-white transition-colors">
                          {p.title}
                        </h5>
                        <p className="text-xs font-black text-slate-950 dark:text-white mt-1">
                          {(p.price || 0).toLocaleString('ru-RU')} so‘m
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              {t('drawer.selectCategory', "Toifani tanlang")}
            </div>
          )}

          {/* Bottom Support Banner */}
          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>
                {t('drawer.consultation', "Mutaxassis konsultatsiyasi")}: <strong>+998 (90) 000-00-00</strong>
              </span>
            </div>
            <span>{t('drawer.monSat', "Dush - Shanba. 09.00 - 19.00")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
