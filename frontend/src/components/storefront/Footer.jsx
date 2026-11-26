import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Send, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import BrandLogo from '../common/BrandLogo';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-12 pb-8 border-t border-slate-800">
      <div className="mx-auto max-w-[1820px] px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
          {/* Col 1: About & Contacts */}
          <div>
            <div className="mb-3">
              <BrandLogo size="md" showTagline darkSurface />
            </div>
            <p className="text-xs leading-relaxed text-slate-400 mb-4">
              {t('footer.desc', 'TEXNOLUX — maishiy texnika, kir yuvish mashinalari, muzlatgichlar, televizor va konditsionerlar rasmiy do‘koni.')}
            </p>
            <div className="flex flex-col gap-2.5 text-xs">
              <a
                href="tel:+998900000000"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-slate-400" />
                +998 (90) 000-00-00
              </a>
              <a
                href={import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/ReferalPeople_bot'}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Send className="w-4 h-4 text-sky-400" />
                {import.meta.env.VITE_TELEGRAM_HANDLE || '@ReferalPeople_bot'}
              </a>
              <a
                href="mailto:info@example.com"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                info@example.com
              </a>
              <span className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-amber-400" />
                {t('footer.address')}
              </span>
            </div>
          </div>

          {/* Col 2: Catalog Links */}
          <div>
            <h6 className="text-white text-sm font-bold mb-3 tracking-wide">{t('footer.catalog')}</h6>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link to="/shop?category=kir-yuvish-mashinalari" className="hover:text-white transition-colors">
                  Kir Yuvish Mashinalari
                </Link>
              </li>
              <li>
                <Link to="/shop?category=muzlatgichlar" className="hover:text-white transition-colors">
                  Muzlatgichlar &amp; Morozilniklar
                </Link>
              </li>
              <li>
                <Link to="/shop?category=televizorlar" className="hover:text-white transition-colors">
                  Televizorlar &amp; Audio
                </Link>
              </li>
              <li>
                <Link to="/shop?category=konditsionerlar" className="hover:text-white transition-colors">
                  Konditsionerlar &amp; Iqlim
                </Link>
              </li>
              <li>
                <Link to="/shop?category=oshxona-texnikasi" className="hover:text-white transition-colors">
                  Oshxona Texnikasi
                </Link>
              </li>
              <li>
                <Link to="/shop?category=uy-tozalash" className="hover:text-white transition-colors">
                  Changyutgich &amp; Dazmollar
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors font-semibold text-slate-300">
                  {t('drawer.viewAll')} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h6 className="text-white text-sm font-bold mb-3 tracking-wide">{t('footer.company')}</h6>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <Link to="/delivery" className="hover:text-white transition-colors">
                  {t('nav.delivery')}
                </Link>
              </li>
              <li>
                <Link to="/delivery#b2b" className="hover:text-white transition-colors">
                  {t('nav.b2b')}
                </Link>
              </li>
              <li>
                <Link to="/delivery#warranty" className="hover:text-white transition-colors">
                  {t('trust.badge2Title')}
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors text-slate-500">
                  {t('topbar.admin')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Account & Payments */}
          <div>
            <h6 className="text-white text-sm font-bold mb-3 tracking-wide">{t('footer.customers')}</h6>
            <ul className="flex flex-col gap-2 text-xs mb-4">
              <li>
                <Link to="/account" className="hover:text-white transition-colors">
                  {t('header.login')}
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-white transition-colors">
                  {t('header.wishlist')}
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-white transition-colors">
                  {t('header.compare')}
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors font-semibold text-slate-300">
                  {t('header.cart')}
                </Link>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block mb-2">
                {t('footer.payments')}
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="px-2 py-1 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300">Click</span>
                <span className="px-2 py-1 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300">Payme</span>
                <span className="px-2 py-1 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300">Uzcard</span>
                <span className="px-2 py-1 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300">Humo</span>
                <span className="px-2 py-1 rounded-md bg-slate-800 text-[10px] font-bold text-emerald-400">QQS 12%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 "TEXNOLUX" — Ishonchli va Barakali. {t('footer.rights')}</p>
          <p className="flex items-center gap-2">
            <span>{t('footer.vatRegistered')}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
