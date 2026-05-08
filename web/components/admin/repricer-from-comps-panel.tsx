'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/client-api';
import { Loader2 } from 'lucide-react';
import { formatMoney, formatPercent } from '@/lib/format';

export function RepricerFromCompsPanel() {
  const [inventoryItemId, setInventoryItemId] = useState('');
  const [targetRoiPercent, setTargetRoiPercent] = useState('40');
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!inventoryItemId.trim()) return;
    try {
      setLoading(true);
      const data = await apiFetch<any>('/api/repricer/analyze-from-comps', {
        method: 'POST',
        body: JSON.stringify({ inventoryItemId: inventoryItemId.trim(), targetRoiPercent: Number(targetRoiPercent) }),
      });
      setResult(data);
    } finally { setLoading(false); }
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-black text-[var(--foreground)]">Reprice From Sold Comps</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">Calculate bounds using historical sold data.</p>
      </div>

      <div className="space-y-4">
        <input value={inventoryItemId} onChange={(e) => setInventoryItemId(e.target.value)} placeholder="Inventory Item ID" className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-blue-500 outline-none text-[var(--foreground)]" />
        <input type="number" value={targetRoiPercent} onChange={(e) => setTargetRoiPercent(e.target.value)} placeholder="Target ROI (%)" className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-blue-500 outline-none text-[var(--foreground)]" />
      </div>

      <button onClick={handleAnalyze} disabled={loading || !inventoryItemId} className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />} Analyze From Comps
      </button>

      {result && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div><div className="text-xs text-slate-500 font-bold">Comps Found</div><div className="text-lg font-bold text-[var(--foreground)]">{result.soldCompCount ?? 0}</div></div>
          <div><div className="text-xs text-slate-500 font-bold">Market Avg</div><div className="text-lg font-bold text-[var(--foreground)]">{formatMoney(result.marketAverage)}</div></div>
          <div><div className="text-xs text-slate-500 font-bold">Suggested</div><div className="text-lg font-black text-blue-500">{formatMoney(result.suggestedPrice)}</div></div>
        </div>
      )}
    </div>
  );
}