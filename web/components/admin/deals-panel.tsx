'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { apiFetch } from '@/lib/api';
import { Loader2, RefreshCw, ExternalLink, PlusCircle, TrendingUp, Zap } from 'lucide-react';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney, formatPercent } from '@/lib/format';
import { toast } from 'sonner';

interface DealRow {
  id: string;
  action: string;
  score: number;
  buyPrice?: number;
  targetSellPrice?: number;
  profit?: number;
  roiPercent?: number;
  watchlistItemId: string;
  listing?: { title?: string; sourceCode?: string; url?: string };
  watchlistItem?: { titleSnapshot?: string };
}

export function DealsPanel() {
  // Звертаємося до роуту Next.js
  const { data, isLoading, mutate, error: fetchError } = useSWR<DealRow[]>('/api/deals', swrFetcher, { refreshInterval: 15000 });
  const rows = Array.isArray(data) ? data : [];

  const [detecting, setDetecting] = useState(false);
  const [queueingId, setQueueingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunDetection = useCallback(async () => {
    if (detecting) return;
    try {
      setDetecting(true);
      setError(null);
      await apiFetch('/api/deals', { method: 'POST' });
      await mutate();
      toast.success('Ринки проаналізовано! Нові угоди додано.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Detection failed');
    } finally {
      setDetecting(false);
    }
  }, [detecting, mutate]);

  const handleQueue = async (watchlistItemId: string, dealId: string) => {
    if (!watchlistItemId || !dealId) return;
    try {
      setQueueingId(dealId);
      await apiFetch('/api/proxy/flows/purchase/add', {
        method: 'POST',
        body: JSON.stringify({ watchlistItemId }),
      });
      toast.success('Додано в чергу закупівель!');
    } catch (err: any) {
      toast.error(err.message || 'Помилка додавання');
    } finally {
      setQueueingId(null);
    }
  };

  const displayError = error || (fetchError ? 'Failed to fetch deals' : null);

  return (
    <div className="flex flex-col h-full space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Detected Deals</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Гарячі угоди зі скрапера. Відразу оцінюйте профіт та забирайте в чергу.
          </p>
        </div>
        <button
          disabled={detecting || isLoading}
          onClick={handleRunDetection}
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50 shadow-md shadow-emerald-600/20"
        >
          <RefreshCw className={`h-4 w-4 ${detecting ? 'animate-spin' : ''}`} />
          {detecting ? 'Аналізую...' : 'Run Detection'}
        </button>
      </div>

      {displayError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
          {displayError}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-[300px] custom-scrollbar">
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center text-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--background)]/50">
            <div className="text-[var(--foreground)] font-bold text-base">Угод не знайдено</div>
            <div className="text-sm font-medium text-slate-500 mt-1">Запустіть скрапер або перевірте налаштування Watchlist</div>
          </div>
        ) : (
          rows.map((row, index) => (
            <div key={row.id ?? index} className="group flex flex-col gap-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)]/50 p-5 transition-all duration-200 hover:bg-[var(--card)] hover:shadow-lg hover:border-emerald-500/30">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="font-black text-[var(--foreground)] text-lg leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {row.listing?.title ?? row.watchlistItem?.titleSnapshot ?? 'Unknown Deal'}
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-xs font-black flex items-center gap-1 shadow-sm border border-orange-200 dark:border-orange-800/50">
                    <Zap size={14}/> {row.score} pts
                  </div>
                  <StatusPill value={row.action ?? 'Pending'} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-3 border-t border-[var(--border)]">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Source</span>
                  <span className="font-mono text-sm font-bold text-[var(--foreground)]">{row.listing?.sourceCode ?? '—'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Buy</span>
                  <span className="text-sm font-black text-[var(--foreground)]">{formatMoney(row.buyPrice)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Target</span>
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400">{formatMoney(row.targetSellPrice)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Profit</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">+{formatMoney(row.profit)}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">ROI</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <TrendingUp size={14}/> {formatPercent(row.roiPercent)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[var(--border)]">
                {row.listing?.url && (
                  <a 
                    href={row.listing.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-[var(--background)] border border-[var(--border)] hover:bg-[var(--card)] hover:border-blue-300 text-[var(--foreground)] px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-[0.98]"
                  >
                    Переглянути лот <ExternalLink size={16} />
                  </a>
                )}
                <button
                  onClick={() => handleQueue(row.watchlistItemId, row.id)}
                  disabled={queueingId === row.id}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                >
                  {queueingId === row.id ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
                  В Чергу Закупівель
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}