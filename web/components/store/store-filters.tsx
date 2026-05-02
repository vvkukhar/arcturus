'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function StoreFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

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
      <button
        onClick={() => update('type', null)}
        className="rounded-xl border px-3 py-2 text-sm"
      >
        All
      </button>
      <button
        onClick={() => update('type', 'set')}
        className="rounded-xl border px-3 py-2 text-sm"
      >
        Sets
      </button>
      <button
        onClick={() => update('type', 'minifigure')}
        className="rounded-xl border px-3 py-2 text-sm"
      >
        Minifigures
      </button>
      <button
        onClick={() => update('type', 'bundle')}
        className="rounded-xl border px-3 py-2 text-sm"
      >
        Bundles
      </button>
      <button
        onClick={() => update('availableOnly', 'true')}
        className="rounded-xl border px-3 py-2 text-sm"
      >
        Available Only
      </button>
    </div>
  );
}