import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowRight, Clock } from 'lucide-react';
import ProductCard from './ProductCard';
import { useLanguage } from '../../context/LanguageContext';

export default function WeeklyDeals({ products = [] }) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState({
    hours: 48,
    minutes: 36,
    seconds: 14,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 72, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter((p) => p.discountPercent > 0).slice(0, 5);

  if (dealProducts.length === 0) return null;

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <section className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pb-10">
      <div className="flex flex-row items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
            <Flame className="w-3.5 h-3.5" /> {t('home.discountUpTo')}
          </span>
          <h2 className="hidden md:block text-xl md:text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            {t('home.weeklyDeals')}
          </h2>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{pad(timeLeft.hours)}</span>:
            <span>{pad(timeLeft.minutes)}</span>:
            <span>{pad(timeLeft.seconds)}</span>
          </div>
        </div>

        <Link
          to="/shop?tag=sale"
          className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary-600)] hover:text-[var(--color-primary-700)] transition-colors"
        >
          {t('home.allDiscounts')} <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {dealProducts.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
