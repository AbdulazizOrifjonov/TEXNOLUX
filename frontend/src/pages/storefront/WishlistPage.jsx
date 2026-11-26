import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import ProductCard from '../../components/storefront/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center transition-colors duration-200">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[var(--color-primary-500)] flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight">Sevimlilar ro‘yxati bo‘sh</h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm mx-auto font-medium">
          O‘zingizga yoqqan tovarlarni yurakcha belgisini bosib saqlab qo‘yishingiz mumkin.
        </p>
        <Link
          to="/shop"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 border border-slate-900 dark:border-white text-white font-bold text-sm shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          Katalogga o‘tish <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-8 transition-colors duration-200">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
          Sevimlilar ({wishlist.length})
        </h1>
        <Link to="/shop" className="text-xs font-bold text-[var(--color-primary-600)] dark:text-white hover:underline">
          Katalogga qaytish →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {wishlist.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
