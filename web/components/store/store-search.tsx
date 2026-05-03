'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

export function StoreSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') ?? '');

  const submit = (event: FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set('q', value.trim());
    } else {
      params.delete('q');
    }

    router.push(`/store/catalog?${params.toString()}`);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search LEGO sets, minifigures, themes..."
        className="min-w-0 flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
      />

      <button
        type="submit"
        className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:opacity-90"
      >
        Search
      </button>
    </form>
  );
}