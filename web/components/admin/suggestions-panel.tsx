'use client';

import { useEffect, useState } from 'react';
import type { SuggestionItem } from '@/lib/types';
import { apiFetch } from '@/lib/client-api';
import { Loader2 } from 'lucide-react';

export function SuggestionsPanel() {
  const [buy, setBuy] = useState<SuggestionItem[]>([]);
  const [sell, setSell] = useState<SuggestionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        const [buyData, sellData] = await Promise.all([
          apiFetch<SuggestionItem[]>('/api/suggestions/buy'),
          apiFetch<SuggestionItem[]>('/api/suggestions/sell'),
        ]);

        if (mounted) {
          setBuy(Array.isArray(buyData) ? buyData : []);
          setSell(Array.isArray(sellData) ? sellData : []);
        }
      } catch {
        if (mounted) {
          setBuy([]);
          setSell([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-48 items-center justify-center rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-sm">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-xl font-black text-[var(--foreground)]">Buy Suggestions</h2>
        <div className="mt-4 space-y-3">
          {buy.length === 0 ? (
            <div className="text-sm font-medium text-slate-500">No active buy suggestions.</div>
          ) : (
            buy.map((x) => (
              <div key={x.id} className="rounded-xl border border-[var(--border)] bg-[var(--background)]/50 p-4 transition-colors hover:bg-[var(--card)] hover:shadow-sm">
                <div className="font-bold text-[var(--foreground)]">{x.title}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-semibold text-emerald-500">ROI: {x.roi.toFixed(2)}%</div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-[var(--foreground)] bg-[var(--background)] border border-[var(--border)] px-2 py-1 rounded-md">{x.action}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
        <h2 className="text-xl font-black text-[var(--foreground)]">Sell Suggestions</h2>
        <div className="mt-4 space-y-3">
          {sell.length === 0 ? (
            <div className="text-sm font-medium text-slate-500">No active sell suggestions.</div>
          ) : (
            sell.map((x) => (
              <div key={x.id} className="rounded-xl border border-[var(--border)] bg-[var(--background)]/50 p-4 transition-colors hover:bg-[var(--card)] hover:shadow-sm">
                <div className="font-bold text-[var(--foreground)]">{x.title}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-semibold text-blue-500">ROI: {x.roi.toFixed(2)}%</div>
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