'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

type Props = {
  placeholder?: string;
};

export function TableSearchForm({ placeholder = 'Search' }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') ?? '');

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
    const value = q.trim();

    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }

    const query = params.toString();
    router.push(query ? `?${query}` : window.location.pathname);
  };

  return (
    <form onSubmit={submit} className="flex w-full gap-2">
      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-slate-400"
      />
      <button
        type="submit"
        className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
      >
        Search
      </button>
      {q ? (
        <button
          type="button"
          onClick={() => {
            setQ('');
            const params = new URLSearchParams(searchParams.toString());
            params.delete('q');

            const query = params.toString();
            router.push(query ? `?${query}` : window.location.pathname);
          }}
          className="rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold"
        >
          Clear
        </button>
      ) : null}
    </form>
  );
}