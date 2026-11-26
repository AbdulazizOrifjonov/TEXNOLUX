import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingCart, Heart, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function MobileBottomNav({ onToggleCatalog, onCloseCatalog, isCatalogOpen = false }) {
  const location = useLocation();
  const { cartCount } = useCart();
  const { wishlist } = useWishlist();
  const { user, guestAvatar, unreadCount } = useAuth();
  const { t } = useLanguage();

  const pathname = location.pathname;

  const isCatalog = isCatalogOpen;
  const isHome = pathname === '/' && !isCatalogOpen;
  const isCart = pathname === '/cart' && !isCatalogOpen;
  const isWishlist = pathname === '/wishlist' && !isCatalogOpen;
  const isAccount = pathname === '/account' && !isCatalogOpen;

  const handleNavClick = () => {
    if (onCloseCatalog) onCloseCatalog();
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-[120] md:hidden bg-white/95 dark:bg-[#000000]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-slate-800/90 shadow-[0_-4px_25px_rgba(0,0,0,0.12)] pb-[max(env(safe-area-inset-bottom,0px),8px)] pt-1 transition-colors duration-200"
      aria-label="Mobil pastki navigatsiya"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {/* 1. Bosh Sahifa */}
        <Link
          to="/"
          onClick={handleNavClick}
          className={`flex flex-col items-center justify-center h-full py-1 group active:scale-90 transition-transform ${
            isHome
              ? 'text-slate-950 dark:text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <Home className={`w-5 h-5 transition-transform ${isHome ? 'scale-110 stroke-[2.5]' : ''}`} />
          </div>
          <span className={`text-[10px] mt-1 tracking-tight ${isHome ? 'font-extrabold' : 'font-semibold'}`}>
            {t('nav.home', 'Bosh sahifa')}
          </span>
        </Link>

        {/* 2. Katalog */}
        <button
          type="button"
          onClick={onToggleCatalog}
          className={`flex flex-col items-center justify-center h-full py-1 group active:scale-90 transition-transform cursor-pointer ${
            isCatalog
              ? 'text-slate-950 dark:text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <LayoutGrid className={`w-5 h-5 transition-transform ${isCatalog ? 'scale-110 stroke-[2.5]' : ''}`} />
          </div>
          <span className={`text-[10px] mt-1 tracking-tight ${isCatalog ? 'font-extrabold' : 'font-semibold'}`}>
            {t('header.catalog', 'Katalog')}
          </span>
        </button>

        {/* 3. Savat */}
        <Link
          to="/cart"
          onClick={handleNavClick}
          className={`flex flex-col items-center justify-center h-full py-1 group active:scale-90 transition-transform ${
            isCart
              ? 'text-slate-950 dark:text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <ShoppingCart className={`w-5 h-5 transition-transform ${isCart ? 'scale-110 stroke-[2.5]' : ''}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[9px] font-black flex items-center justify-center shadow-xs animate-scale">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-1 tracking-tight ${isCart ? 'font-extrabold' : 'font-semibold'}`}>
            {t('header.cart', 'Savat')}
          </span>
        </Link>

        {/* 4. Sevimlilar */}
        <Link
          to="/wishlist"
          onClick={handleNavClick}
          className={`flex flex-col items-center justify-center h-full py-1 group active:scale-90 transition-transform ${
            isWishlist
              ? 'text-slate-950 dark:text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 transition-transform ${isWishlist ? 'scale-110 stroke-[2.5] fill-red-500 text-red-500' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-0.5 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-950 text-[9px] font-black flex items-center justify-center shadow-xs">
                {wishlist.length > 99 ? '99+' : wishlist.length}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-1 tracking-tight ${isWishlist ? 'font-extrabold' : 'font-semibold'}`}>
            {t('header.wishlist', 'Sevimlilar')}
          </span>
        </Link>

        {/* 5. Kabinet / Kirish */}
        <Link
          to="/account"
          onClick={handleNavClick}
          className={`flex flex-col items-center justify-center h-full py-1 group active:scale-90 transition-transform ${
            isAccount
              ? 'text-slate-950 dark:text-white'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <div className="relative">
            {(user?.avatar || guestAvatar) ? (
              <img
                src={user?.avatar || guestAvatar}
                alt={user?.name || 'Profil'}
                className={`w-5 h-5 rounded-full object-cover ring-1 transition-transform ${
                  isAccount ? 'scale-110 ring-slate-950 dark:ring-white' : 'ring-slate-300 dark:ring-slate-600'
                }`}
              />
            ) : (
              <User className={`w-5 h-5 transition-transform ${isAccount ? 'scale-110 stroke-[2.5]' : ''}`} />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] px-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black flex items-center justify-center shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] mt-1 tracking-tight truncate max-w-[64px] ${isAccount ? 'font-extrabold' : 'font-semibold'}`}>
            {user ? user.name?.split(' ')[0] : t('header.login', 'Kirish')}
          </span>
        </Link>
      </div>
    </nav>
  );
}
