'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Suspense, useCallback } from 'react';

const types = [
  { label: 'All Models', value: null },
  { label: 'Sets', value: 'set' },
  { label: 'Minifigures', value: 'minifigure' },
  { label: 'Bundles', value: 'bundle' },
];

function StoreFiltersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get('type') ?? '';
  const availableOnly = searchParams.get('availableOnly') === 'true';

  const update = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/store/catalog?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="flex flex-wrap items-center gap-2 transform-gpu">
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
        {types.map((type) => {
          const isActive = (type.value ?? '') === currentType;
          return (
            <button
              key={type.label}
              onClick={() => update('type', type.value)}
              className={cn(
                'px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm border border-[var(--border)]'
                  : 'text-slate-500 hover:text-[var(--foreground)] hover:bg-[var(--card)] border border-transparent'
              )}
            >
              {type.label}
            </button>
          );
        })}
      </div>

      <div className="w-px h-8 bg-[var(--border)] hidden sm:block mx-1" />

      <button
        onClick={() => update('availableOnly', availableOnly ? null : 'true')}
        className={cn(
          'px-4 py-2.5 text-sm font-semibold rounded-2xl border transition-all duration-200 shadow-sm flex items-center gap-2',
          availableOnly
            ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50'
            : 'bg-[var(--card)] border-[var(--border)] text-slate-500 hover:text-[var(--foreground)] hover:bg-[var(--background)]'
        )}
      >
        <div className={cn(
          "w-2 h-2 rounded-full transition-colors",
          availableOnly ? "bg-blue-600 dark:bg-blue-500" : "bg-slate-300 dark:bg-slate-600"
        )} />
        In Stock Only
      </button>
    </div>
  );
}

export function StoreFilters() {
  return (
    <Suspense fallback={<div className="h-12 w-64 bg-[var(--card)] animate-pulse rounded-2xl border border-[var(--border)]" />}>
      <StoreFiltersContent />
    </Suspense>
  );
}