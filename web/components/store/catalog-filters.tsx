'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { useDebounce } from '@/lib/use-debounce';

export function CatalogFilters({ themes, initialQuery, initialTheme }: { themes: string[], initialQuery: string, initialTheme: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Локальний стейт для миттєвого відображення в UI
  const [q, setQ] = useState(initialQuery);
  const [theme, setTheme] = useState(initialTheme);
  
  const debouncedQ = useDebounce(q, 400);

  const updateFilters = useCallback((newQ: string, newTheme: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newQ.trim()) params.set('q', newQ.trim());
    else params.delete('q');

    if (newTheme) params.set('theme', newTheme);
    else params.delete('theme');

    router.push(`/store/catalog?${params.toString()}`);
  }, [router, searchParams]);

  // Запуск пошуку після того як юзер перестав друкувати
  useEffect(() => {
    if (debouncedQ !== initialQuery) {
      updateFilters(debouncedQ, theme);
    }
  }, [debouncedQ, initialQuery, theme, updateFilters]);

  // Миттєвий запуск при зміні серії
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTheme(val);
    updateFilters(q, val);
  };

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto shrink-0 bg-white/5 backdrop-blur-md p-3 rounded-[2rem] border border-white/10 shadow-xl">
      <div className="relative flex-1 sm:w-64">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input 
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Пошук наборів..." 
          className="h-14 w-full rounded-2xl border-none bg-white/10 pl-12 pr-4 text-sm font-bold text-white placeholder:text-slate-400 outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="relative flex-1 sm:w-64">
        <Filter className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <select
          value={theme}
          onChange={handleThemeChange}
          className="h-14 w-full appearance-none rounded-2xl border-none bg-white/10 pl-12 pr-10 text-sm font-bold text-white outline-none transition-all focus:bg-white/20 focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="" className="text-black">Усі серії</option>
          {themes.map((t) => (
            <option key={t} value={t} className="text-black">{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
}