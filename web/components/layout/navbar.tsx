'use client';

import Link from 'next/link';
import { useCart } from '@/lib/store/cart';
import { useTheme } from '../providers/theme-provider';
import { useI18n } from '../providers/i18n-provider';
import { useSidebar } from '../providers/sidebar-provider';
import { ShoppingCart, Menu, Search, Package, Sun, Moon, Globe, User, LogIn } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useI18n();
  const { toggle } = useSidebar();
  const [mounted, setMounted] = useState(false);
  
  const { data: user, isLoading } = useSWR<any>('/api/auth/me', swrFetcher);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLang(lang === 'en' ? 'uk' : 'en');
  }, [lang, setLang]);

  const dispatchCommand = useCallback(() => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  }, []);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-white/90 shadow-sm backdrop-blur-xl transition-colors duration-300 dark:bg-slate-950/90">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <div className="flex items-center gap-4 lg:gap-8">
            <button 
              onClick={toggle}
              className="-ml-2 rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
              aria-label="Toggle Menu"
            >
              <Menu size={24} />
            </button>

            <Link href="/" className="group flex items-center gap-2 outline-none">
              <div className="rounded-lg bg-slate-900 p-1.5 text-white transition-transform group-hover:scale-105 dark:bg-blue-600 md:p-2 lg:rounded-xl">
                <Package className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-[var(--foreground)] md:text-xl lg:text-2xl">
                Arcturus
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            <button 
              onClick={dispatchCommand}
              className="mr-2 hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-slate-100 px-3 py-2 text-slate-500 transition-colors hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 md:flex"
              aria-label="Search commands"
            >
              <Search size={16} aria-hidden="true" />
              <span className="text-sm font-bold">Search...</span>
              <kbd className="rounded bg-white px-1.5 py-0.5 text-[10px] font-black shadow-sm dark:bg-slate-900">⌘K</kbd>
            </button>

            {mounted && (
              <>
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1.5 text-xs font-bold uppercase text-slate-600 transition-colors hover:border-[var(--border)] hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:px-3 md:py-2 md:text-sm"
                  aria-label={`Switch to ${lang === 'en' ? 'Ukrainian' : 'English'}`}
                >
                  <Globe className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
                  {lang}
                </button>

                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="rounded-full border border-transparent p-2 text-slate-500 transition-colors hover:border-[var(--border)] hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:p-2.5"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5 md:h-6 md:w-6" /> : <Moon className="h-5 w-5 md:h-6 md:w-6" />}
                </button>
              </>
            )}

            {!isLoading && !user && mounted && (
              <div className="hidden md:flex items-center gap-2 mx-2">
                <Link href="/login" className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  {t('auth.signIn' as any)}
                </Link>
                <Link href="/register" className="px-4 py-2 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors shadow-md shadow-blue-600/20">
                  {t('auth.register' as any)}
                </Link>
              </div>
            )}

            {!isLoading && !user && mounted && (
              <Link href="/login" className="md:hidden rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 sm:flex md:p-2.5" aria-label="Login">
                <LogIn className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
              </Link>
            )}

            {!isLoading && !!user && mounted && (
              <Link href="/account" className="rounded-full p-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/50 sm:flex md:p-2.5 mx-1" aria-label="Account">
                <User className="h-5 w-5 md:h-6 md:w-6" aria-hidden="true" />
              </Link>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="group relative rounded-full p-2 text-slate-800 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 md:p-2.5 ml-1"
              aria-label="Open Cart"
            >
              <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110 md:h-6 md:w-6" aria-hidden="true" />
              {mounted && totalItems > 0 && (
                <span className="absolute right-0 top-0 flex h-4 w-4 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white shadow-sm animate-in zoom-in md:h-5 md:w-5 md:text-[11px]">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}