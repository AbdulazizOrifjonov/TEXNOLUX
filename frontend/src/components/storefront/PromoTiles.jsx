import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function PromoTiles() {
  const { t } = useLanguage();

  const tiles = [
    {
      badge: 'Kir Yuvish Mashinalari',
      badgeColor: 'text-blue-600 dark:text-sky-400',
      title: 'Avtomat & Inverter Modellar',
      desc: '6 kg dan 12 kg gacha tejamkor va shovqinsiz kir yuvish mashinalari',
      link: '/shop?category=kir-yuvish-mashinalari',
      bgColor: 'bg-[var(--color-tile-1)] dark:bg-[#131c29]',
      borderColor: 'border-sky-100 dark:border-[#1e2f47]',
      img: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400&auto=format&fit=crop&q=80',
    },
    {
      badge: 'Muzlatgichlar & Morozilniklar',
      badgeColor: 'text-emerald-600 dark:text-emerald-400',
      title: 'No Frost Muzlatgichlar',
      desc: 'Katta sig‘imli, muzlatish tizimi zamonaviy va kafolatli modellar',
      link: '/shop?category=muzlatgichlar',
      bgColor: 'bg-emerald-50/70 dark:bg-[#0f1f1b]',
      borderColor: 'border-emerald-100 dark:border-[#1c3830]',
      img: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&auto=format&fit=crop&q=80',
    },
    {
      badge: 'Televizorlar & Iqlim',
      badgeColor: 'text-amber-600 dark:text-amber-400',
      title: 'Smart TV & Konditsionerlar',
      desc: '4K Smart televizorlar va invertor split tizimlar qulay narxlarda',
      link: '/shop?category=televizorlar',
      bgColor: 'bg-[var(--color-tile-2)] dark:bg-[#1c1a16]',
      borderColor: 'border-amber-100 dark:border-[#3d3318]',
      img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {tiles.map((tile, i) => (
          <Link
            key={i}
            to={tile.link}
            className={`group ${tile.bgColor} border ${tile.borderColor} rounded-[20px] p-5 grid grid-cols-[1fr_auto] items-center gap-3.5 hover:-translate-y-0.5 transition-transform`}
          >
            <div>
              <div className={`text-[11px] font-bold uppercase tracking-wider ${tile.badgeColor}`}>
                {tile.badge}
              </div>
              <div className="mt-1.5 text-[20px] font-extrabold leading-tight tracking-tight text-slate-950 dark:text-white">
                {tile.title}
              </div>
              <div className="mt-1 text-[12px] text-slate-600 dark:text-slate-300">{tile.desc}</div>
              <div className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-bold text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                {t('promo.go', 'Ko‘rish')} <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="w-20 h-20 rounded-[12px] bg-white dark:bg-slate-800 p-1.5 border border-black/5 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-xs overflow-hidden">
              <img
                src={tile.img}
                alt={tile.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
