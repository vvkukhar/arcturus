'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { ShieldCheck, Search, Scale, CheckSquare } from 'lucide-react';

export default function AuthenticityPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-6">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{t('auth.title')}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            {t('auth.subtitle')}
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-8 items-start">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl shrink-0">
              <Search size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('auth.s1.title')}</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium">
                {t('auth.s1.desc')}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-8 items-start">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl shrink-0">
              <Scale size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('auth.s2.title')}</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium">
                {t('auth.s2.desc')}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-8 items-start">
            <div className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl shrink-0">
              <CheckSquare size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('auth.s3.title')}</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium">
                {t('auth.s3.desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}