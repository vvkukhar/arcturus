'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { apiFetch } from '@/lib/api';
import { Loader2, RefreshCw } from 'lucide-react';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney, formatPercent } from '@/lib/format';

interface DealRow {
  id: string;
  action: string;
  buyPrice?: number;
  targetSellPrice?: number;
  roiPercent?: number;
  listing?: { title?: string; sourceCode?: string };
  watchlistItem?: { titleSnapshot?: string };
}

export function DealsPanel() {
  const { data, isLoading, mutate, error: fetchError } = useSWR<DealRow[]>('/api/deals', swrFetcher);
  const rows = Array.isArray(data) ? data : [];

  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunDetection = useCallback(async () => {
    if (detecting) return;
    try {
      setDetecting(true);
      setError(null);
      await apiFetch('/api/deals', { method: 'POST' });
      await mutate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Detection failed');
    } finally {
      setDetecting(false);
    }
  }, [detecting, mutate]);

  const displayError = error || (fetchError ? 'Failed to fetch deals' : null);

  return (
    <div className="flex flex-col h-full space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Detected Deals</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            High ROI matches from scanner requiring immediate action.
          </p>
        </div>
        <button
          disabled={detecting || isLoading}
          onClick={handleRunDetection}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap shadow-md shadow-slate-900/20 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <RefreshCw className={`h-4 w-4 ${detecting ? 'animate-spin' : ''}`} />
          {detecting ? 'Detecting...' : 'Run Detection'}
        </button>
      </div>

      {displayError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
          {displayError}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-[300px] custom-scrollbar">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--background)]/50">
            <div className="text-[var(--foreground)] font-bold text-base">No profitable deals detected</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Run scanner or wait for new market data</div>
          </div>
        ) : (
          rows.map((row, index) => (
            <div key={row.id ?? index} className="group flex flex-col gap-4 rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 p-5 transition-all duration-200 hover:bg-[var(--card)] hover:shadow-lg hover:border-blue-500/30">
              <div className="flex items-start justify-between gap-4">
                <div className="font-black text-[var(--foreground)] text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {row.listing?.title ?? row.watchlistItem?.titleSnapshot ?? 'Unknown Deal'}
                </div>
                <StatusPill value={row.action ?? 'Pending'} />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-[var(--border)]">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Source</span>
                  <span className="font-mono text-sm font-bold text-[var(--foreground)]">{row.listing?.sourceCode ?? '—'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Buy</span>
                  <span className="text-sm font-black text-[var(--foreground)]">{formatMoney(row.buyPrice)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Target</span>
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400">{formatMoney(row.targetSellPrice)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">ROI</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{formatPercent(row.roiPercent)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}