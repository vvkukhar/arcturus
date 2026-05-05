'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { ShieldAlert } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <ShieldAlert size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">{t('privacy.title')}</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{t('privacy.lastUpdated')}</p>
        </div>

        <div className="space-y-10">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('privacy.s1.title')}</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium">{t('privacy.s1.desc')}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('privacy.s2.title')}</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium">{t('privacy.s2.desc')}</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('privacy.s3.title')}</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium">{t('privacy.s3.desc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}