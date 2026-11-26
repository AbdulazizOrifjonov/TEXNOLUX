import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function VIPBanner() {
  const [visible, setVisible] = useState(true);
  const { t } = useLanguage();

  if (!visible) return null;

  return (
    <div className="relative bg-slate-950 dark:bg-black text-white dark:text-slate-200 py-1.5 border-b border-blue-500/40 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-[1820px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between">
        <a
          href={import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/ReferalPeople_bot'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
        >
          <span className="font-extrabold bg-blue-600/30 border border-blue-400/30 px-2 py-0.5 rounded-md text-[11px] uppercase tracking-wider text-sky-300">
            TEXNOLUX
          </span>
          <span className="hidden sm:inline font-semibold">
            {t('vip.text', 'Maishiy texnika, kir yuvish mashinalari, muzlatgich va konditsionerlarga qulay narxlar!')}
          </span>
          <span className="sm:hidden font-semibold">
            {t('vip.textMobile', 'TEXNOLUX — Ishonchli va Barakali maishiy texnika!')}
          </span>
          <span className="font-extrabold underline underline-offset-2 ml-1">
            {t('vip.join', 'Qo‘shilish →')}
          </span>
        </a>
        <button
          onClick={() => setVisible(false)}
          className="p-1 text-white/80 hover:text-white dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer rounded-md hover:bg-white/10 dark:hover:bg-slate-800"
          aria-label="Yopish"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
