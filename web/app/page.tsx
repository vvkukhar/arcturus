'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { ArrowRight, ShieldCheck, Zap, PackageSearch, Gem, LogIn, UserPlus, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Magnetic } from '@/components/ui/magnetic';
import { useI18n } from '@/components/providers/i18n-provider';
import { swrFetcher } from '@/lib/swr-fetcher';

const FEATURES = [
  { icon: ShieldCheck, color: 'blue', titleKey: 'landing.feat1.title', descKey: 'landing.feat1.desc' },
  { icon: PackageSearch, color: 'indigo', titleKey: 'landing.feat2.title', descKey: 'landing.feat2.desc' },
  { icon: Zap, color: 'purple', titleKey: 'landing.feat3.title', descKey: 'landing.feat3.desc' }
] as const;

export default function HomePage() {
  const { t } = useI18n();
  const { data: user, isLoading } = useSWR<any>('/api/auth/me', swrFetcher);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-transparent font-sans">
      <div className="pointer-events-none absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] animate-float rounded-full bg-blue-400/20 mix-blend-multiply blur-[120px] dark:mix-blend-normal" />
      <div className="pointer-events-none absolute -bottom-[10%] -right-[10%] h-[50vw] w-[50vw] animate-float rounded-full bg-indigo-400/20 mix-blend-multiply blur-[120px] delay-300 dark:mix-blend-normal" />

      <header className="absolute left-0 right-0 top-0 z-50 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
            <Gem className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-[var(--foreground)]">ARCTURUS</span>
        </div>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/store/catalog" className="hidden sm:block text-sm font-bold text-slate-600 transition-colors hover:text-[var(--foreground)] dark:text-slate-300">
            {t('nav.catalog' as any)}
          </Link>
          
          {!isLoading && !user ? (
            <>
              <Link href="/login" className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-300 transition-colors">
                <LogIn size={16} /> {t('auth.signIn' as any)}
              </Link>
              <Button href="/register" className="rounded-full px-5 sm:px-6 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 gap-2">
                <UserPlus size={16} className="hidden sm:block" /> {t('auth.register' as any)}
              </Button>
            </>
          ) : null}

          {!isLoading && user ? (
            <Button href="/account" className="rounded-full px-6 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 gap-2">
              <User size={16} /> {t('nav.account' as any)}
            </Button>
          ) : null}
        </nav>
      </header>

      <section className="relative z-10 flex flex-1 flex-col justify-center px-6 pb-24 pt-40">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200/50 bg-[var(--card)]/50 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-600 shadow-sm backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-500 dark:border-slate-800/50 dark:text-blue-400">
            <ShieldCheck size={16} aria-hidden="true" />
            {t('landing.badge' as any)}
          </div>
          
          <h1 className="text-6xl font-black leading-[1.05] tracking-tighter text-[var(--foreground)] animate-in fade-in slide-in-from-bottom-6 duration-700 sm:text-[7rem]">
            {t('landing.title1' as any)} <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400">
              {t('landing.title2' as any)}
            </span>
          </h1>
          
          <p className="mx-auto mt-8 max-w-2xl text-xl font-medium leading-relaxed text-slate-600 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 dark:text-slate-400 sm:text-2xl">
            {t('landing.desc' as any)}
          </p>
          
          <div className="mt-14 flex flex-col items-center justify-center gap-5 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300 sm:flex-row">
            <Magnetic>
              <Button href="/store/catalog" size="lg" className="group h-16 w-full rounded-[2rem] bg-slate-900 px-10 text-lg transition-all hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 sm:w-auto">
                {t('landing.btn' as any)}
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-2" aria-hidden="true" />
              </Button>
            </Magnetic>
          </div>
        </div>

        <div className="mx-auto mt-32 grid max-w-6xl gap-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 md:grid-cols-3">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div key={i} className="group rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)]/40 p-10 shadow-lg backdrop-blur-3xl transition-all hover:-translate-y-2 hover:bg-[var(--card)] hover:shadow-xl">
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-${feature.color}-100 text-${feature.color}-600 transition-transform group-hover:scale-110 dark:bg-${feature.color}-900/30 dark:text-${feature.color}-400`}>
                  <Icon size={28} strokeWidth={2.5} aria-hidden="true" />
                </div>
                <h3 className="mb-4 text-2xl font-black tracking-tight text-[var(--foreground)]">
                  {t(feature.titleKey as any)}
                </h3>
                <p className="font-medium leading-relaxed text-slate-600 dark:text-slate-400">
                  {t(feature.descKey as any)}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}