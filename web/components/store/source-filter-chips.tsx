'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Suspense, useCallback } from 'react';

const themes = ['Ninjago', 'Star Wars', 'Harry Potter', 'Marvel', 'Minecraft'];

function SourceFilterChipsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTheme = searchParams.get('theme') ?? '';

  const update = useCallback((theme: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (theme) {
      params.set('theme', theme);
    } else {
      params.delete('theme');
    }

    router.push(`/store/catalog?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="flex flex-wrap gap-2 pt-2">
      <button
        onClick={() => update(null)}
        className={cn(
          'rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 border',
          currentTheme === ''
            ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-900 shadow-md'
            : 'bg-[var(--card)] border-[var(--border)] text-slate-500 hover:text-[var(--foreground)] hover:bg-[var(--background)]'
        )}
      >
        All Themes
      </button>

      {themes.map((theme) => {
        const isActive = currentTheme === theme;
        return (
          <button
            key={theme}
            onClick={() => update(theme)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200 border',
              isActive
                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                : 'bg-[var(--card)] border-[var(--border)] text-slate-500 hover:text-[var(--foreground)] hover:bg-[var(--background)]'
            )}
          >
            {theme}
          </button>
        );
      })}
    </div>
  );
}

export function SourceFilterChips() {
  return (
    <Suspense fallback={<div className="h-8 w-full bg-transparent" />}>
      <SourceFilterChipsContent />
    </Suspense>
  );
}