'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const types = [
  { label: 'All Models', value: null },
  { label: 'Sets', value: 'set' },
  { label: 'Minifigures', value: 'minifigure' },
  { label: 'Bundles', value: 'bundle' },
];

export function StoreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get('type') ?? '';
  const availableOnly = searchParams.get('availableOnly') === 'true';

  const update = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/store/catalog?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
        {types.map((type) => {
          const isActive = (type.value ?? '') === currentType;
          return (
            <button
              key={type.label}
              onClick={() => update('type', type.value)}
              className={cn(
                'px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              )}
            >
              {type.label}
            </button>
          );
        })}
      </div>

      <div className="w-px h-8 bg-slate-200 hidden sm:block mx-1" />

      <button
        onClick={() => update('availableOnly', availableOnly ? null : 'true')}
        className={cn(
          'px-4 py-2.5 text-sm font-semibold rounded-2xl border transition-all duration-200 shadow-sm flex items-center gap-2',
          availableOnly
            ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
        )}
      >
        <div className={cn(
          "w-2 h-2 rounded-full",
          availableOnly ? "bg-blue-600" : "bg-slate-300"
        )} />
        In Stock Only
      </button>
    </div>
  );
}