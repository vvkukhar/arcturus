'use client';

import { useState } from 'react';

export function PriceAnalyzer() {
  const [buy, setBuy] = useState('');
  const [sell, setSell] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-white p-4">
      <div>
        <div className="text-lg font-black">Price Analyzer</div>
        <div className="mt-1 text-sm text-slate-500">
          Calculate simple profit, ROI, and classification.
        </div>
      </div>

      <input
        value={buy}
        onChange={(e) => setBuy(e.target.value)}
        placeholder="Buy price"
        className="w-full rounded-xl border border-border px-3 py-2 text-sm"
      />

      <input
        value={sell}
        onChange={(e) => setSell(e.target.value)}
        placeholder="Sell price (optional)"
        className="w-full rounded-xl border border-border px-3 py-2 text-sm"
      />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button
        disabled={loading || !buy}
        onClick={async () => {
          try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/pricing/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                buyPrice: Number(buy),
                sellPrice: sell ? Number(sell) : undefined,
              }),
            });

            if (!response.ok) {
              throw new Error(`Analyze failed: ${response.status}`);
            }

            setResult(await response.json());
          } catch (err) {
            setResult(null);
            setError(err instanceof Error ? err.message : 'Analyze failed');
          } finally {
            setLoading(false);
          }
        }}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {result ? (
        <div className="space-y-1 rounded-xl border border-border bg-slate-50 p-4 text-sm">
          <div>Sell: {result.suggestedSellPrice ?? '—'}</div>
          <div>ROI: {result.roi?.toFixed?.(2) ?? result.roi ?? '—'}%</div>
          <div>Profit: {result.profit ?? '—'}</div>
          <div>Type: {result.classification ?? '—'}</div>
        </div>
      ) : null}
    </div>
  );
}