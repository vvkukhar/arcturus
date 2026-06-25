'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Layers } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '@/lib/use-debounce';
import { useI18n } from '@/components/providers/i18n-provider';

export function CatalogFilters({ themes, initialQuery, initialTheme, initialType }: { themes: string[], initialQuery: string, initialTheme: string, initialType: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  
  const [q, setQ] = useState(initialQuery);
  const [theme, setTheme] = useState(initialTheme);
  const [type, setType] = useState(initialType);
  
  const debouncedQ = useDebounce(q, 400);

  const updateFilters = useCallback((newQ: string, newTheme: string, newType: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newQ.trim()) params.set('q', newQ.trim());
    else params.delete('q');

    if (newTheme) params.set('theme', newTheme);
    else params.delete('theme');

    if (newType) params.set('type', newType);
    else params.delete('type');

    router.push(`/store/catalog?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    if (debouncedQ !== initialQuery) {
      updateFilters(debouncedQ, theme, type);
    }
  }, [debouncedQ, initialQuery, theme, type, updateFilters]);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTheme(val);
    updateFilters(q, val, type);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setType(val);
    updateFilters(q, theme, val);
  };

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto shrink-0 bg-white/5 backdrop-blur-md p-3 rounded-[2rem] border border-white/10 shadow-xl">
      <div className="relative flex-1 sm:w-56">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input 
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t('catalog.search.placeholder' as any)} 
          className="h-14 w-full rounded-2xl border-none bg-white/10 pl-12 pr-4 text-sm font-bold text-white placeholder:text-slate-400 outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="relative flex-1 sm:w-48">
        <Layers className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <select
          value={type}
          onChange={handleTypeChange}
          className="h-14 w-full appearance-none rounded-2xl border-none bg-white/10 pl-12 pr-10 text-sm font-bold text-white outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="" className="text-black">{t('catalog.type.all' as any)}</option>
          <option value="set" className="text-black">{t('catalog.type.set' as any)}</option>
          <option value="minifigure" className="text-black">{t('catalog.type.minifigure' as any)}</option>
          <option value="bundle" className="text-black">{t('catalog.type.bundle' as any)}</option>
          <option value="part" className="text-black">{t('catalog.type.part' as any)}</option>
        </select>
      </div>

      <div className="relative flex-1 sm:w-48">
        <Filter className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <select
          value={theme}
          onChange={handleThemeChange}
          className="h-14 w-full appearance-none rounded-2xl border-none bg-white/10 pl-12 pr-10 text-sm font-bold text-white outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="" className="text-black">{t('catalog.theme.all' as any)}</option>
          {themes.map((tItem) => (
            <option key={tItem} value={tItem} className="text-black">{tItem}</option>
          ))}
        </select>
      </div>
    </div>
  );
}