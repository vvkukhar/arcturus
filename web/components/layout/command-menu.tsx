'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Package, User, MapPin, ShieldCheck, Tag, Truck, LogIn, UserPlus } from 'lucide-react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { useI18n } from '@/components/providers/i18n-provider';

export function CommandMenu() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { data: user } = useSWR<any>('/api/auth/me', swrFetcher);

  const commands = useMemo(() => {
    const base = [
      { name: t('nav.catalog' as any), path: '/store/catalog', icon: Package, category: 'Shop' },
      { name: t('nav.track' as any), path: '/track', icon: MapPin, category: 'Shop' },
      { name: t('dropship.title' as any), path: '/dropship', icon: Truck, category: 'Shop' },
      { name: t('sidebar.sell' as any), path: '/sell', icon: Tag, category: 'Market' },
      { name: t('nav.auth' as any), path: '/authenticity', icon: ShieldCheck, category: 'Info' },
    ];

    if (user) {
      base.unshift({ name: t('nav.account' as any), path: '/account', icon: User, category: 'Account' });
    } else {
      base.unshift(
        { name: t('auth.signIn' as any), path: '/login', icon: LogIn, category: 'Account' },
        { name: t('auth.register' as any), path: '/register', icon: UserPlus, category: 'Account' }
      );
    }

    return base;
  }, [user, t]);

  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    return commands.filter(c => c.name.toLowerCase().includes(query.toLowerCase()));
  }, [query, commands]);

  useEffect(() => {
    setMounted(true);
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open]);

  const navigate = useCallback((path: string) => {
    setOpen(false);
    setQuery('');
    router.push(path);
  }, [router]);

  if (!mounted || !open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-2xl bg-[var(--card)] rounded-[2rem] shadow-2xl border border-[var(--border)] overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center px-6 py-5 border-b border-[var(--border)]">
          <Search size={20} className="text-slate-400 mr-4 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('common.search' as any)}
            className="flex-1 bg-transparent border-none outline-none text-lg text-[var(--foreground)] placeholder-slate-400 font-medium"
          />
          <div className="hidden sm:flex items-center gap-1 text-[10px] font-black text-slate-400 bg-[var(--background)] border border-[var(--border)] px-2.5 py-1.5 rounded-lg shadow-sm">
            ESC
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-3 custom-scrollbar">
          {filteredCommands.length === 0 ? (
            <div className="p-12 text-center text-slate-500 font-medium">{t('common.empty' as any)} "{query}"</div>
          ) : (
            <div className="space-y-1">
              {filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                return (
                  <button 
                    key={idx}
                    onClick={() => navigate(cmd.path)}
                    className="w-full flex items-center justify-between px-4 py-4 rounded-xl hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-white/20 group-hover:text-white transition-colors">
                        <Icon size={18} />
                      </div>
                      <span className="font-bold text-base">{cmd.name}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">{cmd.category}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}