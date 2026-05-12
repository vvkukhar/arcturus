'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { Mail, Send } from 'lucide-react';

export default function ContactPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300 py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-6">
            <Mail size={40} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[var(--foreground)] mb-4 tracking-tight">{t('contact.title' as any)}</h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium">
            {t('contact.subtitle' as any)}
          </p>
        </div>

        <div className="bg-[var(--card)] p-6 md:p-10 rounded-3xl border border-[var(--border)] shadow-sm">
          <form className="flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">{t('contact.name' as any)}</label>
              <input type="text" required className="w-full px-4 py-4 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-[var(--foreground)] text-base transition-shadow font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">{t('contact.email' as any)}</label>
              <input type="email" required className="w-full px-4 py-4 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-[var(--foreground)] text-base transition-shadow font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wider">{t('contact.message' as any)}</label>
              <textarea rows={5} required className="w-full px-4 py-4 bg-[var(--background)] border border-[var(--border)] rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-[var(--foreground)] text-base transition-shadow font-medium resize-none"></textarea>
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-lg mt-2">
              <Send size={20} /> {t('contact.send' as any)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}