'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Lock, Crown, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/components/providers/i18n-provider';

export function ProGate({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { data: user, isLoading } = useSWR<any>('/api/auth/me', swrFetcher);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex justify-center items-center">
        <Loader2 className="animate-spin text-indigo-500 w-10 h-10" />
      </div>
    );
  }

  const hasAccess = user && (user.role === 'admin' || user.role === 'operator' || user.isPro);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-[70vh] rounded-[3rem] overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="absolute inset-0 opacity-20 filter blur-md pointer-events-none select-none overflow-hidden">
        {children}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--background)]/80 to-[var(--background)] z-10" />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20 border border-indigo-200 dark:border-indigo-800">
          <Lock size={40} />
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-[var(--foreground)] tracking-tight mb-4">
          {t('pro.title' as any)}
        </h2>
        <p className="text-lg font-medium text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
          {t('pro.tier1.desc' as any)}
        </p>
        <Link 
          href="/pro"
          className="group px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl"
        >
          <Crown size={20} className="text-amber-400 dark:text-amber-500" />
          {t('pro.tier1.btn' as any)}
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}