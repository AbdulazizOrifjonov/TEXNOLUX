import React from 'react';
import { Star, CheckCircle2, Building2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ReviewsSection() {
  const { t, lang } = useLanguage();

  const reviewsByLang = {
    uz: [
      {
        author: 'Aziz Raximov',
        role: 'Xonadon egasi, Toshkent',
        date: '3 noyabr 2026',
        comment: 'TEXNOLUX dan Rulls 10 kg kir yuvish mashinasi xarid qildik. Sifati ajoyib, juda jim ishlaydi va o‘sha kuniyoq yetkazib berishdi!',
        rating: 5,
      },
      {
        author: 'Nodira Salimova',
        role: 'Oila bekasi, Samarqand',
        date: '28 oktyabr 2026',
        comment: 'No Frost muzlatgich va mikroto‘lqinli pech buyurtma berdik. Narxlari bozordan ancha arzon va rasmiy kafolati bor ekan.',
        rating: 5,
      },
      {
        author: 'Jamshid Toirov',
        role: 'Ofis menejeri',
        date: '15 oktyabr 2026',
        comment: 'Ofisimiz uchun invertor konditsioner va Smart TV oldik. Tezkor xizmat va halol maslahat uchun TEXNOLUX jamoasiga rahmat.',
        rating: 5,
      },
      {
        author: 'Dilshod Karimov',
        role: 'Doimiy mijoz',
        date: '8 oktyabr 2026',
        comment: 'Oshxona texnikalari va changyutgichni shu yerdan oldik. Ishonchli va barakali do‘kon, barchaga tavsiya qilaman!',
        rating: 5,
      },
    ],
    ru: [
      {
        author: 'Азиз Рахимов',
        role: 'Покупатель, Ташкент',
        date: '3 ноября 2026',
        comment: 'Купили в TEXNOLUX стиральную машину Rulls 10 кг. Отличное качество, работает тихо, доставили в тот же день!',
        rating: 5,
      },
      {
        author: 'Нодира Салимова',
        role: 'Домохозяйка, Самарканд',
        date: '28 октября 2026',
        comment: 'Заказали холодильник No Frost и микроволновку. Цены очень выгодные, дали официальную гарантию.',
        rating: 5,
      },
      {
        author: 'Жамшид Тоиров',
        role: 'Офис-менеджер',
        date: '15 октября 2026',
        comment: 'Взяли инверторный кондиционер и Smart TV для офиса. Быстрая доставка и грамотная консультация!',
        rating: 5,
      },
      {
        author: 'Дильшод Каримов',
        role: 'Постоянный клиент',
        date: '8 октября 2026',
        comment: 'Покупали кухонную технику и пылесос в TEXNOLUX. Очень надежный магазин, рекомендую всем!',
        rating: 5,
      },
    ],
    en: [
      {
        author: 'Aziz Rakhimov',
        role: 'Homeowner, Tashkent',
        date: 'November 3, 2026',
        comment: 'Bought a Rulls 10 kg washing machine from TEXNOLUX. Great quality, super quiet operation, and same-day delivery!',
        rating: 5,
      },
      {
        author: 'Nodira Salimova',
        role: 'Customer, Samarkand',
        date: 'October 28, 2026',
        comment: 'Ordered a No Frost refrigerator and microwave oven. Great prices and official warranty included.',
        rating: 5,
      },
      {
        author: 'Jamshid Toirov',
        role: 'Office Manager',
        date: 'October 15, 2026',
        comment: 'Got an inverter air conditioner and Smart TV for our office. Fast service and honest advice.',
        rating: 5,
      },
      {
        author: 'Dilshod Karimov',
        role: 'Regular Customer',
        date: 'October 8, 2026',
        comment: 'Purchased kitchen appliances and vacuum cleaner here. Truly reliable store!',
        rating: 5,
      },
    ]
  };

  const reviews = reviewsByLang[lang] || reviewsByLang.uz;

  return (
    <section className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-12 bg-slate-50 dark:bg-[#050505] border-y border-slate-200 dark:border-slate-800/80 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider mb-2">
            {t('reviews.badge', 'Mijozlar ishonchi')}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('reviews.title', 'Mijozlarimiz fikrlari')}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t('reviews.desc', 'TEXNOLUX do‘konidan xarid qilgan mijozlarning haqiqiy fikrlari.')}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            4.9 / 5.0 <span className="text-slate-400 font-normal">• TEXNOLUX</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {reviews.map((rev, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#0f0f0f] rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(rev.rating)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                  <CheckCircle2 className="w-3 h-3" />
                  Tasdiqlangan
                </span>
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-5 italic">
                “{rev.comment}”
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {rev.author}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                  {rev.role} • {rev.date}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
