'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function StoreSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') ?? '');

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
          placeholder="Search LEGO sets, minifigures, themes..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-slate-400"
        />
      </div>
      <Button type="submit" className="py-3.5 px-8 sm:w-auto w-full text-base h-[50px]">
        Search
      </Button>
    </form>
  );
}