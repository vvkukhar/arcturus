'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/client-api';
import { Loader2 } from 'lucide-react';
import { formatMoney, formatPercent } from '@/lib/format';

interface CompsRepricerResult {
  inventoryItemId?: string;
  title?: string;
  suggestedPrice?: number;
  roiPercent?: number;
  classification?: string;
  soldCompCount?: number;
  marketFloor?: number;
  marketAverage?: number;
  marketCeiling?: number;
}

function parseNumber(value: string, fallback: number | null = null): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function RepricerFromCompsPanel() {
  const [inventoryItemId, setInventoryItemId] = useState('');
  const [targetRoiPercent, setTargetRoiPercent] = useState('40');
  
  const [result, setResult] = useState<CompsRepricerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inventoryItemId.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const data = await apiFetch<CompsRepricerResult>('/api/repricer/analyze-from-comps', {
        method: 'POST',
        body: JSON.stringify({
          inventoryItemId: inventoryItemId.trim(),
          targetRoiPercent: parseNumber(targetRoiPercent, 40),
        }),
      });

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analyze failed');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!result?.suggestedPrice) return;

    try {
      setApplying(true);
      setError(null);

      await apiFetch('/api/repricer/apply', {
        method: 'PATCH',
        body: JSON.stringify({
          inventoryItemId: result.inventoryItemId ?? inventoryItemId.trim(),
          suggestedPrice: result.suggestedPrice,
        }),
      });

      alert('Price applied successfully based on comps!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Apply failed');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-black text-slate-900">Reprice From Sold Comps</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Automatically calculate bounds using historical sold data.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Inventory Item ID</label>
          <input
            required
            value={inventoryItemId}
            onChange={(e) => setInventoryItemId(e.target.value)}
            placeholder="e.g. inv-12345"
            className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Target ROI (%)</label>
          <input
            type="number"
            value={targetRoiPercent}
            onChange={(e) => setTargetRoiPercent(e.target.value)}
            placeholder="40"
            className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-50"
          disabled={loading || !inventoryItemId.trim()}
          onClick={handleAnalyze}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Analyzing...' : 'Analyze From Comps'}
        </button>

        {result?.suggestedPrice && (
          <button
            className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-6 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 disabled:opacity-50"
            disabled={applying}
            onClick={handleApply}
          >
            {applying && <Loader2 className="h-4 w-4 animate-spin" />}
            {applying ? 'Applying...' : 'Apply Suggested Price'}
          </button>
        )}
      </div>

      {result && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 mt-4">
          <div className="font-black text-slate-900 text-lg mb-4">{result.title ?? 'Comps Result'}</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Comps Found</div>
              <div className="text-lg font-bold text-slate-700">{result.soldCompCount ?? 0}</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Market Avg</div>
              <div className="text-lg font-bold text-slate-700">{formatMoney(result.marketAverage)}</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Suggested</div>
              <div className="text-lg font-black text-blue-700">{formatMoney(result.suggestedPrice)}</div>
            </div>
            <div className="col-span-2 sm:col-span-3">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Est. ROI</div>
              <div className="text-lg font-black text-emerald-600">{formatPercent(result.roiPercent)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}