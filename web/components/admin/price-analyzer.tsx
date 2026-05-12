'use client';

import { useState, useCallback } from 'react';
import { apiFetch } from '@/lib/client-api';
import { Loader2, Calculator } from 'lucide-react';
import { formatMoney, formatPercent } from '@/lib/format';

interface AnalyzerResult {
  suggestedSellPrice?: number;
  roi?: number;
  profit?: number;
  classification?: string;
  floorPrice?: number;
  stretchPrice?: number;
}

function parseNumber(value: string, fallback: number | null = null): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function PriceAnalyzer() {
  const [buy, setBuy] = useState('');
  const [sell, setSell] = useState('');
  const [result, setResult] = useState<AnalyzerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBuy = parseNumber(buy);
    const parsedSell = parseNumber(sell);

    if (parsedBuy === null || parsedBuy < 0) {
      setError('Please enter a valid buy price.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const data = await apiFetch<AnalyzerResult>('/api/pricing/analyze', {
        method: 'POST',
        body: JSON.stringify({
          buyPrice: parsedBuy,
          sellPrice: parsedSell !== null ? parsedSell : undefined,
        }),
      });

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analyze failed');
    } finally {
      setLoading(false);
    }
  }, [buy, sell]);

  return (
    <div className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm transition-all hover:shadow-md h-full">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
          <Calculator className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Scenario Analyzer</h2>
          <p className="text-sm font-medium text-slate-500">
            Simulate ROI, profit margins, and ideal exit pricing.
          </p>
        </div>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Entry Price (₴)</label>
            <input
              required
              type="number"
              step="0.01"
              value={buy}
              onChange={(e) => setBuy(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold text-[var(--foreground)] focus:bg-[var(--card)] focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Target Exit (₴)</label>
            <input
              type="number"
              step="0.01"
              value={sell}
              onChange={(e) => setSell(e.target.value)}
              placeholder="Auto-calculate if empty"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold text-[var(--foreground)] focus:bg-[var(--card)] focus:border-indigo-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !buy}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-indigo-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-md shadow-indigo-600/20"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Computing...' : 'Run Simulation'}
        </button>
      </form>

      {result && (
        <div className="animate-in fade-in zoom-in-95 duration-300 grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--border)]">
          <div className="bg-[var(--background)]/50 p-4 rounded-2xl border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Target Sell</div>
            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">{formatMoney(result.suggestedSellPrice)}</div>
          </div>
          <div className="bg-[var(--background)]/50 p-4 rounded-2xl border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Est. Profit</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{formatMoney(result.profit)}</div>
          </div>
          <div className="bg-[var(--background)]/50 p-4 rounded-2xl border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">ROI</div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{formatPercent(result.roi)}</div>
          </div>
          <div className="bg-[var(--background)]/50 p-4 rounded-2xl border border-[var(--border)]">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Class</div>
            <div className="text-sm font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 mt-1">{result.classification ?? '—'}</div>
          </div>
        </div>
      )}
    </div>
  );
}