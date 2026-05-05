'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { Truck, CreditCard, Package } from 'lucide-react';

export default function DeliveryPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">{t('delivery.title')}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            {t('delivery.subtitle')}
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-8 items-start">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0">
              <Truck size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('delivery.novaPoshta')}</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium">
                {t('delivery.npDesc')}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-8 items-start">
            <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl shrink-0">
              <CreditCard size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('delivery.payment')}</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium">
                {t('delivery.payDesc')}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-8 items-start">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl shrink-0">
              <Package size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{t('delivery.packaging')}</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium">
                {t('delivery.packDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}