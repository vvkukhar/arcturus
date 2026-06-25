'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { PackageSearch, ShieldCheck, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300 py-16 md:py-24">
      <div className="bg-slate-900 dark:bg-black text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">{t('about.title' as any)}</h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium">
            {t('about.subtitle' as any)}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <p className="text-lg text-[var(--foreground)] leading-relaxed font-medium">
              {t('about.p1' as any)}
            </p>
            <p className="text-lg text-[var(--foreground)] leading-relaxed font-medium">
              {t('about.p2' as any)}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
              <ShieldCheck size={40} className="text-blue-600 mb-6" />
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">{t('landing.feat1.title' as any)}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{t('landing.feat1.desc' as any)}</p>
            </div>
            <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
              <TrendingUp size={40} className="text-blue-600 mb-6" />
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">{t('about.p3.title' as any)}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{t('about.p3.desc' as any)}</p>
            </div>
            <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm sm:col-span-2">
              <PackageSearch size={40} className="text-blue-600 mb-6" />
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">{t('landing.feat2.title' as any)}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{t('landing.feat2.desc' as any)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}