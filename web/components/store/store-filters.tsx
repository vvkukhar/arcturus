'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const types = [
  { label: 'All', value: null },
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
    <div className="flex flex-wrap gap-2">
      {types.map((type) => (
        <button
          key={type.label}
          onClick={() => update('type', type.value)}
          className={`rounded-xl border border-border px-3 py-2 text-sm font-semibold ${
            (type.value ?? '') === currentType
              ? 'bg-slate-900 text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          {type.label}
        </button>
      ))}

      <button
        onClick={() => update('availableOnly', availableOnly ? null : 'true')}
        className={`rounded-xl border border-border px-3 py-2 text-sm font-semibold ${
          availableOnly
            ? 'bg-slate-900 text-white'
            : 'bg-white text-slate-700 hover:bg-slate-50'
        }`}
      >
        Available Only
      </button>
    </div>
  );
}