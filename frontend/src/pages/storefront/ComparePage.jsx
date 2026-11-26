import React from 'react';
import { Link } from 'react-router-dom';
import { GitCompare, X, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';

export default function ComparePage() {
  const { compareList, toggleCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  const formatPrice = (n) => (n || 0).toLocaleString('ru-RU');

  if (compareList.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center transition-colors duration-200">
        <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 text-[var(--color-primary-500)] flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700 shadow-xs">
          <GitCompare className="w-10 h-10" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
          Taqqoslash ro‘yxati bo‘sh
        </h2>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm mx-auto font-medium">
          Mahsulot kartochkalaridagi taqqoslash belgisini bosib 4 tagacha tovar parametrlarini solishtirishingiz mumkin.
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
          Mahsulotlarni taqqoslash ({compareList.length}/4)
        </h1>
        <button
          onClick={clearCompare}
          className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
        >
          Tozalash
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white dark:bg-[#111827] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 text-xs shadow-xs transition-colors">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
              <th className="p-4 text-left font-bold text-slate-500 dark:text-slate-400 w-48">Parametr</th>
              {compareList.map((p) => (
                <th key={p._id} className="p-4 text-left w-64 border-l border-slate-200 dark:border-slate-800">
                  <div className="relative">
                    <button
                      onClick={() => toggleCompare(p)}
                      className="absolute -top-1 -right-1 p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="w-24 aspect-[3/4] rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-3">
                      <img
                        src={p.images?.[0] || 'https://via.placeholder.com/80'}
                        alt={p.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">{p.title}</div>
                    <div className="text-sm font-black text-slate-950 dark:text-white mt-1">
                      {formatPrice(p.price)} so'm
                    </div>
                    <button
                      onClick={() => addToCart(p)}
                      className="mt-3 w-full py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 border border-slate-900 dark:border-white text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Savatchaga
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
            <tr>
              <td className="p-4 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">Kategoriya</td>
              {compareList.map((p) => (
                <td key={p._id} className="p-4 border-l border-slate-200 dark:border-slate-800 font-semibold">{p.category}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">Brend</td>
              {compareList.map((p) => (
                <td key={p._id} className="p-4 border-l border-slate-200 dark:border-slate-800 font-semibold">{p.brand || 'NSB'}</td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">Ombor qoldig‘i</td>
              {compareList.map((p) => (
                <td key={p._id} className="p-4 border-l border-slate-200 dark:border-slate-800 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {p.stock} dona
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-bold text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-800/30">Tavsif</td>
              {compareList.map((p) => (
                <td key={p._id} className="p-4 border-l border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 leading-relaxed">
                  {p.description || 'Standart tavsif'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
