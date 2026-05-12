'use client';

import useSWR from 'swr';
import type { SuggestionItem } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { swrFetcher } from '@/lib/swr-fetcher';

export function SuggestionsPanel() {
  const { data: buyData, isLoading: buyLoading } = useSWR<SuggestionItem[]>('/api/suggestions/buy', swrFetcher as any);
  const { data: sellData, isLoading: sellLoading } = useSWR<SuggestionItem[]>('/api/suggestions/sell', swrFetcher as any);

  const buy = Array.isArray(buyData) ? buyData : [];
  const sell = Array.isArray(sellData) ? sellData : [];

  if (buyLoading || sellLoading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Buy Suggestions</h2>
        <div className="mt-4 space-y-3">
          {buy.length === 0 ? (
            <div className="text-sm font-medium text-slate-500">No active buy suggestions.</div>
          ) : (
            buy.map((x) => (
              <div key={x.id} className="rounded-xl border border-[var(--border)] bg-[var(--background)]/50 p-4 transition-colors hover:bg-[var(--card)] hover:shadow-sm">
                <div className="font-bold text-[var(--foreground)] line-clamp-1">{x.title}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">ROI: {x.roi.toFixed(2)}%</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-[var(--foreground)] bg-[var(--background)] border border-[var(--border)] px-2 py-1 rounded-md">{x.action}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Sell Suggestions</h2>
        <div className="mt-4 space-y-3">
          {sell.length === 0 ? (
            <div className="text-sm font-medium text-slate-500">No active sell suggestions.</div>
          ) : (
            sell.map((x) => (
              <div key={x.id} className="rounded-xl border border-[var(--border)] bg-[var(--background)]/50 p-4 transition-colors hover:bg-[var(--card)] hover:shadow-sm">
                <div className="font-bold text-[var(--foreground)] line-clamp-1">{x.title}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">ROI: {x.roi.toFixed(2)}%</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-[var(--foreground)] bg-[var(--background)] border border-[var(--border)] px-2 py-1 rounded-md">{x.action}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}