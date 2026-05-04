'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/client-api';
import { Loader2 } from 'lucide-react';
import { formatMoney, formatPercent } from '@/lib/format';

interface AnalyzerResult {
  suggestedSellPrice?: number;
  roi?: number;
  profit?: number;
  classification?: string;
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

  const handleAnalyze = async (e: React.FormEvent) => {
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
  };

  return (
    <div className="space-y-4 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-black text-slate-900">Simple Price Analyzer</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Quickly calculate raw profit, ROI, and class rating without market bounds.
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Buy Price (₴)</label>
            <input
              required
              type="number"
              step="0.01"
              value={buy}
              onChange={(e) => setBuy(e.target.value)}
              placeholder="0.00"
              className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Expected Sell (₴)</label>
            <input
              type="number"
              step="0.01"
              value={sell}
              onChange={(e) => setSell(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !buy}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Analyzing...' : 'Run Analysis'}
        </button>
      </form>

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Sell</div>
            <div className="mt-1 text-lg font-bold text-slate-900">{formatMoney(result.suggestedSellPrice)}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Est. Profit</div>
            <div className="mt-1 text-lg font-bold text-emerald-600">{formatMoney(result.profit)}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">ROI</div>
            <div className="mt-1 text-lg font-bold text-emerald-600">{formatPercent(result.roi)}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Classification</div>
            <div className="mt-1 text-sm font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-1 rounded-md">{result.classification ?? '—'}</div>
          </div>
        </div>
      )}
    </div>
  );
}