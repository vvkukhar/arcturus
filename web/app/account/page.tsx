'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { User, Package, Heart, Settings } from 'lucide-react';

export default function AccountPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-10 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="p-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{t('account.title')}</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">user@arcturus.store</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3 space-y-2">
            <button className="w-full flex items-center gap-3 p-4 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 rounded-xl font-bold border border-blue-100 dark:border-blue-900 shadow-sm transition-all">
              <Package size={20} /> {t('account.orders')}
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800">
              <Heart size={20} /> {t('account.wishlist')}
            </button>
            <button className="w-full flex items-center gap-3 p-4 bg-transparent text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white rounded-xl font-bold transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800">
              <Settings size={20} /> {t('account.settings')}
            </button>
          </div>

          <div className="lg:col-span-9">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{t('account.orders')}</h2>
              </div>
              <div className="p-8 md:p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-700 mb-4">
                  <Package size={28} />
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white mb-2">No orders yet</p>
                <p className="text-slate-500 dark:text-slate-400 font-medium">When you place an order, it will appear here.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}