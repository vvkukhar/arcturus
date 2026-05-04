'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/client-api';

interface ExplainResult {
  verdict?: string;
  roi?: number;
  reasons?: string[];
}

function parseNumber(value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

export function DealExplainer() {
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [marketFloor, setMarketFloor] = useState('');
  const [marketAverage, setMarketAverage] = useState('');
  const [liquidityScore, setLiquidityScore] = useState('');
  
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBuy = parseNumber(buyPrice);
    const parsedSell = parseNumber(sellPrice);

    if (parsedBuy === null || parsedSell === null) {
      setError('Buy and Sell prices are required and must be valid numbers.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const data = await apiFetch<ExplainResult>('/api/ai/explain-deal', {
        method: 'POST',
        body: JSON.stringify({
          buyPrice: parsedBuy,
          sellPrice: parsedSell,
          marketFloor: parseNumber(marketFloor),
          marketAverage: parseNumber(marketAverage),
          liquidityScore: parseNumber(liquidityScore),
        }),
      });

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Explain failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-black text-slate-900">AI Deal Explainer</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Get an AI breakdown of ROI and deal quality based on market variables.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Buy Price</label>
            <input required type="number" step="0.01" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Sell Price</label>
            <input required type="number" step="0.01" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Market Floor</label>
            <input type="number" step="0.01" value={marketFloor} onChange={(e) => setMarketFloor(e.target.value)} placeholder="Optional" className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Market Average</label>
            <input type="number" step="0.01" value={marketAverage} onChange={(e) => setMarketAverage(e.target.value)} placeholder="Optional" className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Liquidity Score (0-100)</label>
            <input type="number" value={liquidityScore} onChange={(e) => setLiquidityScore(e.target.value)} placeholder="Optional" className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all" />
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading || !buyPrice || !sellPrice} className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-50">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Analyzing...' : 'Explain Deal'}
        </button>
      </form>

      {result && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 mt-4 space-y-3">
          <div className="font-black text-slate-900 text-lg">{result.verdict ?? 'Analysis Complete'}</div>
          <div className="text-sm font-bold text-emerald-600">
            Est. ROI: {result.roi != null ? `${result.roi.toFixed(2)}%` : '—'}
          </div>
          <div className="space-y-2 text-sm text-slate-700 font-medium">
            {Array.isArray(result.reasons) && result.reasons.length > 0 ? (
              <ul className="list-disc pl-4 space-y-1">
                {result.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            ) : (
              <div>No detailed reasons provided.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}