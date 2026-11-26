import React from 'react';
import { Truck, CreditCard, ShieldCheck, Clock, MapPin, Building, Phone } from 'lucide-react';

export default function DeliveryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 transition-colors duration-200">
      <h1 className="text-3xl font-black text-slate-950 dark:text-white mb-2 tracking-tight">
        Yetkazib berish va to‘lov shartlari
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 font-medium">
        NSB NEW STAR BUKHARA do‘koni barcha mijozlarga eng qulay va tezkor xizmatni taqdim etadi.
      </p>

      {/* Grid of 3 Information Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/50 shadow-xs transition-colors">
          <Truck className="w-8 h-8 text-[var(--color-primary-500)] dark:text-white mb-3" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">Buxoro bo‘ylab 2 soatda</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Shahar hududida 200 000 so'mdan ortiq buyurtmalar uchun yetkazib berish mutlaqo bepul!
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 shadow-xs transition-colors">
          <CreditCard className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">Barcha to‘lov turlari</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Click, Payme, Uzcard, Humo, naqd pul yoki korxonalar uchun QQS hisob-faktura orqali.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 shadow-xs transition-colors">
          <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-3" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white mb-1">100% Sifat kafolati</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Barcha tovarlar zavod kafolati bilan sotiladi. 14 kun ichida almashtirish kafolatlangan.
          </p>
        </div>
      </div>

      {/* Detailed FAQs / Info */}
      <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Building className="w-5 h-5 text-[var(--color-primary-500)] dark:text-white" />
            Yuridik shaxslar va B2B korxonalar uchun
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Biz davlat tashkilotlari, maktablar, banklar va xususiy kompaniyalar bilan Didox orqali elektron hisob-faktura (QQS bilan) asosida shartnoma tuzamiz. Ulgurji buyurtmalarga maxsus arzonlashtirilgan narxlar amal qiladi.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs transition-colors">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--color-primary-500)] dark:text-white" />
            Yetkazib berish vaqti va tartibi
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Buyurtmalar har kuni soat 08:30 dan 21:00 gacha qabul qilinadi. Buxoro viloyatining boshqa tumanlariga (G‘ijduvon, Vobkent, Jondor, Qorako‘l) 24 soat ichida yetkaziladi.
          </p>
        </div>
      </div>
    </div>
  );
}
