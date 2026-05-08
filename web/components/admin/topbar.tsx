'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CommandPalette } from '@/components/admin/command-palette';
import { LogOut, RefreshCcw, Sun, Moon, Globe } from 'lucide-react';
import { apiFetch } from '@/lib/client-api';
import { useI18n } from '@/components/providers/i18n-provider';
import { useTheme } from '@/components/providers/theme-provider';

export function AdminTopbar() {
  const router = useRouter();
  const { t, lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
      router.replace('/login');
    } catch (error) {
      alert('Failed to logout cleanly. Please clear cookies.');
    }
  };

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'uk' : 'en');
  };

  return (
    <>
      <CommandPalette />
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl px-6 py-4 transition-colors duration-300">
        <div>
          <div className="text-lg font-black text-[var(--foreground)]">{t('admin.workspace' as any)}</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-slate-500">{t('admin.quickActions' as any)}:</span>
            <kbd className="rounded-md border border-[var(--border)] bg-[var(--background)] px-2 py-0.5 font-mono text-[11px] font-bold text-slate-500">⌘K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors uppercase border border-transparent hover:border-[var(--border)]"
          >
            <Globe size={16} />
            {lang}
          </button>

          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-transparent hover:border-[var(--border)]"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Button
            variant="secondary"
            className="gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 shadow-none border border-[var(--border)]"
            onClick={() => router.refresh()}
          >
            <RefreshCcw size={16} />
            <span className="hidden sm:inline">{t('admin.refresh' as any)}</span>
          </Button>

          <Button
            variant="outline"
            className="gap-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 hover:border-red-300 dark:bg-red-900/20 dark:border-red-900/50 dark:hover:bg-red-900/40"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">{t('admin.logout' as any)}</span>
          </Button>
        </div>
      </div>
    </>
  );
}