'use client';

import Link from 'next/link';
import { PackageSearch } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-500">
      <PackageSearch size={64} className="text-slate-300 dark:text-slate-700 mb-6" />
      <h2 className="text-3xl font-black tracking-tight text-[var(--foreground)] mb-4">{t('catalog.notfound.title' as any)}</h2>
      <p className="text-slate-500 font-medium mb-8">
        {t('catalog.notfound.desc' as any)}
      </p>
      <Link 
        href="/store/catalog" 
        className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
      >
        {t('catalog.notfound.back' as any)}
      </Link>
    </div>
  );
}