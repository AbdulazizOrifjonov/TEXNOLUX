import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronRight, Check, X, RotateCcw } from 'lucide-react';
import ProductCard from '../../components/storefront/ProductCard';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

export default function CatalogPage() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, lang } = useLanguage();

  const searchQuery = searchParams.get('search') || '';
  const tagParam = searchParams.get('tag') || '';
  const categoryParam = searchParams.get('category') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter States - Synchronized with URL category query & params
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || categoryParam || '');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => {
      if (res.data.success) setCategories(res.data.categories);
    });
  }, []);

  useEffect(() => {
    const cat = categorySlug || searchParams.get('category') || '';
    setSelectedCategory(cat);
  }, [categorySlug, searchParams]);

  const handleSelectCategory = (slug) => {
    setSelectedCategory(slug);
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedBrand, minPrice, maxPrice, inStockOnly, sortBy, searchQuery, tagParam]);

  const fetchProducts = () => {
    setLoading(true);
    let url = `/products?limit=1000&sort=${sortBy}`;
    if (selectedCategory) url += `&categorySlug=${selectedCategory}`;
    if (selectedBrand) url += `&brand=${selectedBrand}`;
    if (minPrice) url += `&minPrice=${minPrice}`;
    if (maxPrice) url += `&maxPrice=${maxPrice}`;
    if (inStockOnly) url += `&inStock=true`;
    if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
    if (tagParam) url += `&tag=${tagParam}`;

    api
      .get(url)
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.products);
          setTotal(res.data.total);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMinPrice('');
    setMaxPrice('');
    setInStockOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  const brands = ['Rulls', 'Artel', 'Shivaki', 'LG', 'Samsung', 'Beko', 'Premier', 'Avalon', 'Midea', 'TCL', 'Gree', 'Hoffmann', 'Immer', 'Bosch', 'Hisense'];

  return (
    <div className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
      {/* Localized Breadcrumb */}
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5 font-medium">
        <Link to="/" className="hover:text-[var(--color-primary-600)] dark:hover:text-pink-400 transition-colors">
          {t('catalog.breadcrumbHome', 'Bosh sahifa')}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        <Link to="/shop" className="hover:text-[var(--color-primary-600)] dark:hover:text-pink-400 transition-colors">
          {t('catalog.breadcrumbCatalog', 'Katalog')}
        </Link>
        {selectedCategory && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span className="text-slate-900 dark:text-white font-bold capitalize">
              {t(`cat.${selectedCategory}`, categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory.replace(/-/g, ' '))}
            </span>
          </>
        )}
      </div>

      {/* Title & Top Sorting Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
            {searchQuery
              ? `"${searchQuery}" ${t('catalog.searchFor', 'bo‘yicha qidiruv')}`
              : selectedCategory
              ? t(`cat.${selectedCategory}`, categories.find((c) => c.slug === selectedCategory)?.name || t('catalog.title', 'Barcha Mahsulotlar'))
              : t('catalog.title', 'Barcha Mahsulotlar')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {t('catalog.found', 'Topildi')}: <strong className="text-slate-950 dark:text-white font-bold">{total}</strong> {t('catalog.productsCount', 'ta mahsulot')}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" /> {t('catalog.filters', 'Filterlar')}
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline font-medium">
              {t('catalog.sort', 'Saralash')}:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 font-semibold text-slate-900 dark:text-white cursor-pointer text-xs focus:bg-white dark:focus:bg-slate-800 focus:border-slate-900 dark:focus:border-slate-400 outline-none transition-all shadow-2xs"
            >
              <option value="newest">{t('catalog.sortNewest', 'Yangi qo‘shilganlar')}</option>
              <option value="popularity">{t('catalog.sortPopular', 'Ommabopligi bo‘yicha')}</option>
              <option value="price_asc">{t('catalog.sortPriceAsc', 'Narx: Arzondan qimmatga')}</option>
              <option value="price_desc">{t('catalog.sortPriceDesc', 'Narx: Qimmatdan arzonga')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid lg:grid-cols-[260px_1fr] gap-6 items-start">
        {/* Left Filter Sidebar (Desktop) - 100% Pinned during catalog scroll */}
        <aside 
          style={{ top: 'calc(var(--nsb-header-height, 130px) + 16px)' }}
          className="hidden lg:block bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-5 sticky self-start max-h-[calc(100vh-var(--nsb-header-height,130px)-32px)] overflow-y-auto overscroll-contain shadow-xs transition-[top] duration-200 scrollbar-thin"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-900 dark:text-white" /> {t('catalog.filters', 'Filterlar')}
            </span>
            {(selectedCategory || selectedBrand || minPrice || maxPrice || inStockOnly) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] font-bold text-slate-900 dark:text-white hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> {t('catalog.reset', 'Tozalash')}
              </button>
            )}
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2.5">
              {t('catalog.categories', 'Kategoriyalar')}
            </h4>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => handleSelectCategory('')}
                className={`w-full text-left text-xs font-semibold py-2 px-3 rounded-xl transition-colors cursor-pointer ${
                  !selectedCategory
                    ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t('catalog.all', 'Barchasi')}
              </button>
              {categories.map((c) => (
                <button
                  key={c._id || c.slug}
                  type="button"
                  onClick={() => handleSelectCategory(c.slug)}
                  className={`w-full text-left text-xs font-semibold py-2 px-3 rounded-xl transition-colors truncate cursor-pointer ${
                    selectedCategory === c.slug
                      ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {t(`cat.${c.slug}`, c.name)}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2.5">
              {t('catalog.price', 'Narx (so‘m)')}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder={t('catalog.from', 'Dan')}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-slate-900 dark:focus:border-slate-400 outline-none transition-all"
              />
              <input
                type="number"
                placeholder={t('catalog.to', 'Gacha')}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-800 focus:border-slate-900 dark:focus:border-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Brand Filter */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2.5">
              {t('catalog.brands', 'Brendlar')}
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {brands.map((b) => (
                <label
                  key={b}
                  className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-950 dark:hover:text-white"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrand === b}
                    onChange={() => setSelectedBrand(selectedBrand === b ? '' : b)}
                    className="rounded text-[var(--color-primary-500)] focus:ring-0"
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* In Stock Only */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer hover:text-slate-950 dark:hover:text-white">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-[var(--color-primary-500)] focus:ring-0"
              />
              <span>{t('catalog.inStockOnly', 'Faqat omborda bor tovarlar')}</span>
            </label>
          </div>
        </aside>

        {/* Right Products Grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-72 rounded-xl bg-slate-100 dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-950 dark:text-white mb-2">
                {t('catalog.noProductsFound', 'Hech qanday mahsulot topilmadi')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
                {t('catalog.tryChangingFilters', 'Qidiruv parametrlarini o‘zgartirib ko‘ring')}
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-xs font-bold shadow-xs hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                {t('catalog.reset', 'Filtrlarni tozalash')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setMobileFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white dark:bg-[#111827] shadow-xl flex flex-col">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-900 dark:text-white" /> {t('catalog.filters', 'Filterlar')}
                </span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Categories */}
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2.5">
                    {t('catalog.categories', 'Kategoriyalar')}
                  </h4>
                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        handleSelectCategory('');
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left text-xs font-semibold py-2 px-3 rounded-xl transition-colors ${
                        !selectedCategory
                          ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {t('catalog.all', 'Barchasi')}
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c._id || c.slug}
                        type="button"
                        onClick={() => {
                          handleSelectCategory(c.slug);
                          setMobileFilterOpen(false);
                        }}
                        className={`w-full text-left text-xs font-semibold py-2 px-3 rounded-xl transition-colors ${
                          selectedCategory === c.slug
                            ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {t(`cat.${c.slug}`, c.name)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2.5">
                    {t('catalog.price', 'Narx (so‘m)')}
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder={t('catalog.from', 'Dan')}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder={t('catalog.to', 'Gacha')}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Brands */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2.5">
                    {t('catalog.brands', 'Brendlar')}
                  </h4>
                  <div className="space-y-2">
                    {brands.map((b) => (
                      <label key={b} className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                        <input
                          type="checkbox"
                          checked={selectedBrand === b}
                          onChange={() => setSelectedBrand(selectedBrand === b ? '' : b)}
                          className="rounded text-[var(--color-primary-500)]"
                        />
                        <span>{b}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* In Stock */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded text-[var(--color-primary-500)]"
                    />
                    <span>{t('catalog.inStockOnly', 'Faqat omborda bor tovarlar')}</span>
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-300"
                >
                  {t('catalog.reset', 'Tozalash')}
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-bold text-xs shadow-xs"
                >
                  {t('catalog.apply', 'Qo‘llash')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
