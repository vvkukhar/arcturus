'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { MapPin, Search, PackageCheck } from 'lucide-react';

export default function TrackOrderPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-6">
            <MapPin size={40} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{t('track.title')}</h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium">
            {t('track.subtitle')}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <form className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">{t('track.input')}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="e.g. ORD-12345678"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-slate-900 dark:text-white text-base md:text-lg transition-shadow font-medium" 
                />
              </div>
            </div>
            <button 
              type="button"
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-lg mt-2"
            >
              <PackageCheck size={20} /> {t('track.button')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}