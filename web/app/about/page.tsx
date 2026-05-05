'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { PackageSearch, ShieldCheck, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="bg-slate-900 dark:bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{t('about.title')}</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium">
            {t('about.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {t('about.p1')}
            </p>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {t('about.p2')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <ShieldCheck size={40} className="text-blue-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Verified Authenticity</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Every brick, minifigure, and instruction manual is strictly checked against global databases.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <TrendingUp size={40} className="text-blue-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Fair Market Pricing</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Our dynamic pricing engine ensures you pay a fair, data-backed price based on current market trends.</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm sm:col-span-2">
              <PackageSearch size={40} className="text-blue-600 mb-6" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Collector-Grade Inventory</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">We specialize in hard-to-find, retired, and exclusive sets that regular retail stores no longer carry.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}