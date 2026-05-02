'use client';

import { useEffect, useState } from 'react';
import type { SuggestionItem } from '@/lib/entities';
import { apiFetch } from '@/lib/client-api';

export function SuggestionsPanel() {
  const [buy, setBuy] = useState<SuggestionItem[]>([]);
  const [sell, setSell] = useState<SuggestionItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const [buyData, sellData] = await Promise.all([
        apiFetch<SuggestionItem[]>('/api/suggestions/buy'),
        apiFetch<SuggestionItem[]>('/api/suggestions/sell'),
      ]);

      setBuy(Array.isArray(buyData) ? buyData : []);
      setSell(Array.isArray(sellData) ? sellData : []);
    };

    load();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="text-xl font-black">Buy Suggestions</div>

        {buy.length === 0 ? (
          <div className="mt-3 text-sm text-slate-500">No suggestions</div>
        ) : (
          buy.map((x) => (
            <div key={x.id} className="mt-3 rounded-xl border border-border p-3">
              <div className="font-bold">{x.title}</div>
              <div className="mt-1 text-sm text-slate-500">
                ROI: {x.roi.toFixed(2)}%
              </div>
              <div className="mt-1 text-xs text-slate-400">{x.action}</div>
            </div>
          ))
        )}
      </div>

      <div className="rounded-2xl border border-border bg-white p-5">
        <div className="text-xl font-black">Sell Suggestions</div>

        {sell.length === 0 ? (
          <div className="mt-3 text-sm text-slate-500">No suggestions</div>
        ) : (
          sell.map((x) => (
            <div key={x.id} className="mt-3 rounded-xl border border-border p-3">
              <div className="font-bold">{x.title}</div>
              <div className="mt-1 text-sm text-slate-500">
                ROI: {x.roi.toFixed(2)}%
              </div>
              <div className="mt-1 text-xs text-slate-400">{x.action}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}