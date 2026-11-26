import React from 'react';
import { Truck, ShieldCheck, CreditCard, Percent, Headphones } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function TrustBadges() {
  const { t } = useLanguage();

  const badges = [
    {
      icon: Truck,
      title: t('trust.badge1Title'),
      subtitle: t('trust.badge1Desc'),
    },
    {
      icon: ShieldCheck,
      title: t('trust.badge2Title'),
      subtitle: t('trust.badge2Desc'),
    },
    {
      icon: CreditCard,
      title: t('trust.badge3Title'),
      subtitle: t('trust.badge3Desc'),
    },
    {
      icon: Percent,
      title: t('trust.badge4Title'),
      subtitle: t('trust.badge4Desc'),
    },
    {
      icon: Headphones,
      title: t('trust.badge5Title'),
      subtitle: t('trust.badge5Desc'),
    },
  ];

  return (
    <section className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 pb-10">
      <div className="bg-[var(--color-soft)] dark:bg-[#111827] rounded-2xl p-6 lg:p-7 grid grid-cols-2 md:grid-cols-3 gap-5 lg:grid-cols-5 border border-[var(--color-primary-100)] dark:border-slate-800 transition-colors duration-200">
        {badges.map((b, i) => {
          const Icon = b.icon;
          return (
            <div key={i} className="flex flex-col">
              <span className="inline-grid place-items-center w-11 h-11 rounded-xl bg-white dark:bg-slate-800 text-[var(--color-primary-500)] dark:text-white shadow-xs border border-slate-200/50 dark:border-slate-700/60">
                <Icon className="w-5 h-5" />
              </span>
              <div className="mt-3 text-[14px] font-bold text-slate-950 dark:text-white">
                {b.title}
              </div>
              <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {b.subtitle}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
