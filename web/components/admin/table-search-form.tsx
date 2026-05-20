'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState, useEffect, Suspense } from 'react';
import { Search, X } from 'lucide-react';

type Props = {
  placeholder?: string;
};

function TableSearchFormContent({ placeholder = 'Search...' }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    setQ(searchParams.get('q') ?? '');
  }, [searchParams]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const value = q.trim();

    if (value) params.set('q', value);
    else params.delete('q');

    router.push(`?${params.toString()}`);
  };

  const clear = () => {
    setQ('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={submit} className="flex w-full items-center relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] py-3.5 pl-12 pr-24 text-sm font-medium text-[var(--foreground)] shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
      />
      <div className="absolute inset-y-0 right-2 flex items-center gap-1">
        {q && (
          <button type="button" onClick={clear} className="p-2 rounded-xl text-slate-400 hover:text-[var(--foreground)] hover:bg-[var(--background)] transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
        <button type="submit" className="rounded-xl bg-slate-900 dark:bg-white px-4 py-2 text-xs font-semibold text-white dark:text-slate-900 transition-colors hover:bg-black dark:hover:bg-slate-200">
          Find
        </button>
      </div>
    </form>
  );
}

export function TableSearchForm(props: Props) {
  return (
    <Suspense fallback={<div className="h-[50px] w-full bg-[var(--card)] animate-pulse rounded-2xl border border-[var(--border)]" />}>
      <TableSearchFormContent {...props} />
    </Suspense>
  );
}