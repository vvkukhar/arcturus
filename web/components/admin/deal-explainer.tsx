'use client';

import { useState, useCallback } from 'react';
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
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBuy = parseNumber(buyPrice);
    const parsedSell = parseNumber(sellPrice);
    
    if (parsedBuy === null || parsedSell === null) {
      setError('Please enter valid buy and sell prices');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch<ExplainResult>('/api/ai/explain-deal', {
        method: 'POST',
        body: JSON.stringify({ 
          buyPrice: parsedBuy, 
          sellPrice: parsedSell, 
          marketFloor: parseNumber(marketFloor), 
          marketAverage: parseNumber(marketAverage) 
        }),
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI Explain failed');
    } finally { 
      setLoading(false); 
    }
  }, [buyPrice, sellPrice, marketFloor, marketAverage]);

  return (
    <div className="space-y-4 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-black text-[var(--foreground)]">AI Deal Explainer</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">Get an AI breakdown of ROI and deal quality.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <input required type="number" step="0.01" placeholder="Buy Price" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-blue-500 outline-none text-[var(--foreground)]" />
          <input required type="number" step="0.01" placeholder="Sell Price" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-blue-500 outline-none text-[var(--foreground)]" />
          <input type="number" step="0.01" placeholder="Market Floor (Opt)" value={marketFloor} onChange={(e) => setMarketFloor(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-blue-500 outline-none text-[var(--foreground)]" />
          <input type="number" step="0.01" placeholder="Market Average (Opt)" value={marketAverage} onChange={(e) => setMarketAverage(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-blue-500 outline-none text-[var(--foreground)]" />
        </div>
        {error && <div className="text-sm font-bold text-red-600">{error}</div>}
        <button type="submit" disabled={loading || !buyPrice || !sellPrice} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Explain Deal
        </button>
      </form>

      {result && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 mt-4 space-y-3">
          <div className="font-black text-[var(--foreground)] text-lg">{result.verdict ?? 'Analysis Complete'}</div>
          <div className="space-y-2 text-sm text-slate-400 font-medium">
            {result.reasons?.map((reason, idx) => <div key={idx}>• {reason}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}