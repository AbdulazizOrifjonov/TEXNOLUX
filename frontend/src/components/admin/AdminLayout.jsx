import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BrandLogo from '../common/BrandLogo';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Image,
  Tag,
  MessageSquare,
  Settings,
  FileBarChart,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Sun,
  Moon,
  Globe,
  Search,
  Phone,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Check,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import { isSupabaseConfigured } from '../../services/supabaseClient';

export default function AdminLayout({ activeTab, setActiveTab, searchTerm = '', setSearchTerm = () => {}, children }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const { lang, setLang } = useLanguage();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [zayavkalar, setZayavkalar] = useState([]);
  const [loadingZayavkalar, setLoadingZayavkalar] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // Multilingual translations for Admin menu
  const menuLabels = {
    overview: { uz: 'Boshqaruv Paneli', ru: 'Панель Управления', en: 'Dashboard' },
    products: { uz: 'Mahsulotlar (CRUD)', ru: 'Товары (CRUD)', en: 'Products' },
    categories: { uz: 'Kategoriyalar', ru: 'Категории', en: 'Categories' },
    orders: { uz: 'Buyurtmalar & Zayavkalar', ru: 'Заказы и Заявки', en: 'Orders & Leads' },
    customers: { uz: 'Mijozlar Bazasi', ru: 'База Клиентов', en: 'Customers' },
    inventory: { uz: 'Ombor & Qoldiqlar', ru: 'Склад и Остатки', en: 'Inventory' },
    banners: { uz: 'Bosh Sahifa Bannerlari', ru: 'Баннеры Главной', en: 'Banners' },
    coupons: { uz: 'Chegirma & Kuponlar', ru: 'Скидки и Купоны', en: 'Coupons' },
    reviews: { uz: 'Mijozlar Sharhlari', ru: 'Отзывы Клиентов', en: 'Reviews' },
    reports: { uz: 'Hisobotlar & Eksport', ru: 'Отчеты и Экспорт', en: 'Reports' },
    settings: { uz: 'Do‘kon Sozlamalari', ru: 'Настройки Магазина', en: 'Settings' }
  };

  const menuItems = [
    { id: 'overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'products', icon: <Package className="w-4 h-4" /> },
    { id: 'categories', icon: <Layers className="w-4 h-4" /> },
    { id: 'orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'customers', icon: <Users className="w-4 h-4" /> },
    { id: 'inventory', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'banners', icon: <Image className="w-4 h-4" /> },
    { id: 'coupons', icon: <Tag className="w-4 h-4" /> },
    { id: 'reviews', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'reports', icon: <FileBarChart className="w-4 h-4" /> },
    { id: 'settings', icon: <Settings className="w-4 h-4" /> }
  ];

  // Fetch real-time incoming orders (zayavkalar)
  const fetchZayavkalar = async () => {
    setLoadingZayavkalar(true);
    try {
      const res = await api.get('/orders?limit=30');
      if (res.data.success) {
        setZayavkalar(res.data.orders || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingZayavkalar(false);
    }
  };

  useEffect(() => {
    fetchZayavkalar();
    // Poll every 15 seconds for incoming new orders
    const interval = setInterval(fetchZayavkalar, 15000);
    return () => clearInterval(interval);
  }, []);

  // Count pending/new orders
  const newOrdersCount = zayavkalar.filter(
    (o) => o.orderStatus === 'new' || o.orderStatus === 'pending'
  ).length;

  const formatPrice = (n) => `${(n || 0).toLocaleString('ru-RU').replace(/,/g, ' ')} so‘m`;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation - Fixed on desktop, stays 100% pinned during full page scroll */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
        }`}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
          {/* Logo Brand Header */}
          <div className="p-3.5 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#000000] z-10 gap-2">
            <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center group min-w-0">
              <BrandLogo size="sm" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
              aria-label="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links with animated hover and active state */}
          <nav className="p-3 space-y-1">
            {menuItems.map((item) => {
              const label = menuLabels[item.id]?.[lang] || menuLabels[item.id]?.uz;
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer group ${
                    isSelected
                      ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-md translate-x-1'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-950 dark:hover:text-white hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="transition-transform duration-200 group-hover:scale-115">
                      {item.icon}
                    </span>
                    <span>{label}</span>
                  </div>
                  {item.id === 'orders' && newOrdersCount > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                        isSelected ? 'bg-white text-slate-950 dark:bg-slate-950 dark:text-white' : 'bg-red-500 text-white animate-pulse'
                      }`}
                    >
                      {newOrdersCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar Actions */}
        <div className="shrink-0 p-4 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-[#0b0f19]">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs transition-all shadow-2xs hover:scale-[1.02] active:scale-95"
          >
            Saytni ochish <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/account');
            }}
            className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 font-bold text-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" /> Chiqish
          </button>
        </div>
      </aside>

      {/* Main Content Area (padded on left by sidebar width on desktop) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-clip">
        {/* Top Navbar - Sticky Pinned Header */}
        <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-3 shadow-sm transition-colors duration-200 h-16 w-full max-w-full">
          {/* Left: Mobile hamburger & Breadcrumb */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden h-10 w-10 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0 cursor-pointer"
              aria-label="Menyu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="h-10 hidden xl:flex items-center px-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0">
              TEXNOLUX Platform /&nbsp;
              <span className="font-extrabold text-slate-900 dark:text-white capitalize">
                {menuLabels[activeTab]?.[lang] || activeTab}
              </span>
            </div>
          </div>

          {/* Center: Search Input (navbarga input) */}
          <div className="flex-1 min-w-0 max-w-md mx-1 sm:mx-4 relative h-10 flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                lang === 'ru'
                  ? 'Поиск...'
                  : lang === 'en'
                  ? 'Search...'
                  : 'Qidiruv...'
              }
              className="w-full h-10 pl-9 pr-7 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:border-slate-900 dark:focus:border-white outline-none transition-all box-border truncate"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: Zayavkalar Button, Kun/Tun, Lang Switcher, Status */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1. Tushgan Zayavkalar Button (bitta bossa zayavkalar paneliga o'tadi) */}
            <button
              type="button"
              onClick={() => {
                setActiveTab('orders');
              }}
              className="relative h-10 inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-4 rounded-xl bg-slate-950 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-950 font-extrabold text-xs shadow-xs hover:shadow active:scale-95 transition-all cursor-pointer box-border shrink-0 border border-slate-900 dark:border-white"
              title="Tushgan barcha zayavkalar paneliga o'tish"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">
                {lang === 'ru' ? 'Заявки' : lang === 'en' ? 'Leads' : 'Zayavkalar'}
              </span>
              {newOrdersCount > 0 ? (
                <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black shadow-2xs">
                  {newOrdersCount}
                </span>
              ) : (
                <span className="text-[10px] opacity-80">({zayavkalar.length})</span>
              )}
            </button>

            {/* 2. Kun / Tun Rejimi (Day / Night mode) */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`h-10 inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs box-border shrink-0 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-indigo-500/50 text-indigo-300'
                  : 'bg-amber-100/80 hover:bg-amber-100 border-amber-300 text-amber-900'
              }`}
              title={isDark ? "Kunduzgi rejim (Kun) ga o'tish" : "Tungi rejim (Tun) ga o'tish"}
            >
              {isDark ? (
                <>
                  <Moon className="w-4 h-4 text-indigo-400 fill-indigo-400" />
                  <span className="hidden md:inline font-extrabold">Tun</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="hidden md:inline font-extrabold">Kun</span>
                </>
              )}
            </button>

            {/* 3. Til tanlash: Compact single-pill on mobile (< sm), 3-button segment on desktop (>= sm) */}
            <button
              type="button"
              onClick={() => setLang(lang === 'uz' ? 'ru' : lang === 'ru' ? 'en' : 'uz')}
              className="sm:hidden h-10 px-2.5 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-black uppercase text-slate-800 dark:text-slate-200 active:scale-95 transition-all shrink-0 cursor-pointer"
              title="Tilni almashtirish (UZ / RU / EN)"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{lang}</span>
            </button>

            <div className="hidden sm:flex h-10 items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs box-border shrink-0">
              {['uz', 'ru', 'en'].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`h-full px-2.5 sm:px-3 flex items-center justify-center rounded-lg text-xs uppercase cursor-pointer transition-all ${
                    lang === l
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs font-black'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-extrabold'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* DB Status & Admin Avatar */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700 shrink-0">
              <div className="h-10 flex items-center gap-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Supabase DB faol" />
                <span className="hidden xl:inline text-slate-500 dark:text-slate-400 font-medium">Supabase:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">
                  {isSupabaseConfigured ? "Bog'langan" : "Tayyor (Online)"}
                </span>
              </div>
              <div className="h-10 w-10 rounded-xl bg-black border border-white/20 text-white flex items-center justify-center font-black text-sm shadow-2xs shrink-0 cursor-default" title="Admin (TEXNOLUX)">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content with Animated Page Entrance */}
        <main className="p-3 sm:p-4 md:p-6 lg:p-8 flex-1 w-full max-w-full min-w-0 overflow-x-clip bg-slate-50 dark:bg-[#000000] transition-colors duration-200">
          <div key={activeTab} className="animate-admin-page-enter w-full max-w-full min-w-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
