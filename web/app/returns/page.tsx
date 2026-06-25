'use client';

import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/components/providers/i18n-provider';

export default function ReturnsPolicyPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300 py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 mb-8 transition-colors">
            <ArrowLeft size={16} /> {t('header.home' as any)}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl">
              <ShieldAlert size={28} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[var(--foreground)] tracking-tight">{t('returns.title' as any)}</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">{t('returns.subtitle' as any)}</p>
        </div>

        <div className="space-y-8">
          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">{t('returns.s1.title' as any)}</h2>
            <p className="text-[var(--foreground)] leading-relaxed text-lg font-medium mb-4">
              {t('returns.s1.desc' as any)}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[var(--foreground)] font-medium">
              <li>{t('returns.s1.l1' as any)}</li>
              <li><b>{t('returns.s1.l2' as any)}</b></li>
              <li>{t('returns.s1.l3' as any)}</li>
            </ul>
            <p className="text-red-500 font-bold mt-4">{t('returns.s1.warn' as any)}</p>
          </div>

          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">{t('returns.s2.title' as any)}</h2>
            <p className="text-[var(--foreground)] leading-relaxed text-lg font-medium">
              {t('returns.s2.desc' as any)}
            </p>
          </div>

          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4">{t('returns.s3.title' as any)}</h2>
            <p className="text-[var(--foreground)] leading-relaxed text-lg font-medium" dangerouslySetInnerHTML={{ __html: t('returns.s3.desc' as any) }} />
          </div>
        </div>
      </div>
    </div>
  );
}