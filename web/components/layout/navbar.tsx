'use client';

import Link from 'next/link';
import { useCart } from '../providers/cart-provider';
import { useTheme } from '../providers/theme-provider';
import { useI18n } from '../providers/i18n-provider';
import { useSidebar } from '../providers/sidebar-provider';
import { ShoppingCart, Menu, Search, Package, Sun, Moon, Globe, User } from 'lucide-react';

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useI18n();
  const { toggle } = useSidebar();

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'uk' : 'en');
  };

  const dispatchCommand = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
  };

  return (
    <nav className="w-full backdrop-blur-xl bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <div className="flex items-center gap-4 lg:gap-8">
            <button 
              onClick={toggle}
              className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>

            <Link href="/store" className="flex items-center gap-2 group">
              <div className="bg-slate-900 dark:bg-blue-600 text-white p-1.5 md:p-2 rounded-lg lg:rounded-xl group-hover:scale-105 transition-transform">
                <Package size={20} className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="font-extrabold text-lg md:text-xl lg:text-2xl tracking-tight text-slate-900 dark:text-white">
                Arcturus
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-1 md:gap-3">
            <button 
              onClick={dispatchCommand}
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-colors mr-2 border border-slate-200 dark:border-slate-800"
            >
              <Search size={16} />
              <span className="text-sm font-bold">Search...</span>
              <span className="text-[10px] font-black bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded shadow-sm">⌘K</span>
            </button>

            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 md:py-2 text-xs md:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors uppercase"
            >
              <Globe size={16} className="w-4 h-4 md:w-5 md:h-5" />
              {lang}
            </button>

            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 md:p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} className="w-5 h-5 md:w-6 md:h-6" /> : <Moon size={20} className="w-5 h-5 md:w-6 md:h-6" />}
            </button>

            <Link href="/account" className="hidden sm:flex p-2 md:p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <User size={20} className="w-5 h-5 md:w-6 md:h-6" />
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 md:p-2.5 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors group"
            >
              <ShoppingCart size={22} className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-blue-600 text-[9px] md:text-[11px] font-bold text-white shadow-sm animate-fade-in-up">
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