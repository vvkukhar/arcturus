'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { PackageOpen, ArrowRight } from 'lucide-react';

export default function SellPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-6">
            <PackageOpen size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{t('sell.title')}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            {t('sell.subtitle')}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium mb-8">
            {t('sell.desc')}
          </p>
          <a href="mailto:purchasing@arcturus.store" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-xl transition-transform hover:scale-105 shadow-xl">
            Contact Purchasing Team <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}