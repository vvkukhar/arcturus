'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const { t } = useI18n();

  const faqs = [
    { q: 'faq.q1', a: 'faq.a1' },
    { q: 'faq.q2', a: 'faq.a2' },
    { q: 'faq.q3', a: 'faq.a3' },
    { q: 'faq.q4', a: 'faq.a4' },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-2xl mb-6">
            <HelpCircle size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] mb-6 tracking-tight">{t('faq.title' as any)}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            {t('faq.subtitle' as any)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[var(--card)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm">
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-3">{t(faq.q as any)}</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium text-lg">{t(faq.a as any)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}