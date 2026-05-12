'use client';

import { use } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Loader2 } from 'lucide-react';
import { WatchlistInlineEditor } from '@/components/admin/watchlist-inline-editor';

export default function WatchlistItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: item, isLoading, mutate } = useSWR<any>(`/api/admin/watchlist/${id}`, swrFetcher as any);

  if (isLoading) return <div className="flex h-[calc(100vh-8rem)] items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>;
  if (!item) return <div className="flex h-[calc(100vh-8rem)] items-center justify-center font-bold text-slate-500">Watchlist Item Not Found</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-fade-in-up">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)]">{item.titleSnapshot}</h1>
        <p className="mt-1 text-sm text-slate-500 font-mono">ID: {item.id}</p>
      </div>
      <div className="max-w-3xl">
        <WatchlistInlineEditor item={item} onSuccessAction={() => mutate()} />
      </div>
    </div>
  );
}