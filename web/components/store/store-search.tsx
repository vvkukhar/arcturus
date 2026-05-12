'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState, useEffect, Suspense } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/components/providers/i18n-provider';

function StoreSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(searchParams.get('q') ?? '');
  }, [searchParams]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = value.trim();

    if (trimmed) {
      params.set('q', trimmed);
    } else {
      params.delete('q');
    }

    router.push(`/store/catalog?${params.toString()}`);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row relative">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={(t('search.placeholder' as any) as string)}
          className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] py-3.5 pl-11 pr-4 text-sm font-medium text-[var(--foreground)] shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
        />
      </div>
      <Button type="submit" className="py-3.5 px-8 sm:w-auto w-full text-base h-[50px]">
        {(t('search.button' as any) as string)}
      </Button>
    </form>
  );
}

export function StoreSearch() {
  return (
    <Suspense fallback={<div className="h-[50px] w-full bg-[var(--card)] animate-pulse rounded-2xl border border-[var(--border)]" />}>
      <StoreSearchContent />
    </Suspense>
  );
}