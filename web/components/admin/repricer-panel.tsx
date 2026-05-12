'use client';

import { useState, useCallback } from 'react';
import { apiFetch } from '@/lib/client-api';
import { Loader2 } from 'lucide-react';
import { formatMoney, formatPercent } from '@/lib/format';

interface RepricerResult {
  inventoryItemId?: string;
  title?: string;
  suggestedPrice?: number;
  roiPercent?: number;
  classification?: string;
}

function parseNumber(value: string, fallback: number | null = null): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function RepricerPanel() {
  const [inventoryItemId, setInventoryItemId] = useState('');
  const [marketFloor, setMarketFloor] = useState('');
  const [marketAverage, setMarketAverage] = useState('');
  const [marketCeiling, setMarketCeiling] = useState('');
  const [targetRoiPercent, setTargetRoiPercent] = useState('40');
  const [result, setResult] = useState<RepricerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleAnalyze = useCallback(async () => {
    if (loading || !inventoryItemId.trim()) return;
    try {
      setLoading(true);
      const data = await apiFetch<RepricerResult>('/api/repricer/analyze', {
        method: 'POST',
        body: JSON.stringify({
          inventoryItemId: inventoryItemId.trim(),
          marketFloor: parseNumber(marketFloor),
          marketAverage: parseNumber(marketAverage),
          marketCeiling: parseNumber(marketCeiling),
          targetRoiPercent: parseNumber(targetRoiPercent, 40),
        }),
      });
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally { 
      setLoading(false); 
    }
  }, [loading, inventoryItemId, marketFloor, marketAverage, marketCeiling, targetRoiPercent]);

  const handleApply = useCallback(async () => {
    if (applying || !result?.suggestedPrice) return;
    try {
      setApplying(true);
      await apiFetch('/api/repricer/apply', { 
        method: 'PATCH', 
        body: JSON.stringify({ 
          inventoryItemId: result.inventoryItemId ?? inventoryItemId.trim(), 
          suggestedPrice: result.suggestedPrice 
        }) 
      });
    } catch (e) {
      console.error(e);
    } finally { 
      setApplying(false); 
      setResult(null);
      setInventoryItemId('');
      setMarketFloor('');
      setMarketAverage('');
      setMarketCeiling('');
    }
  }, [applying, result, inventoryItemId]);

  return (
    <div className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-black text-[var(--foreground)]">Auto Repricer</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">Calculate suggested sell price based on market bounds.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Inventory Item ID</label>
          <input 
            value={inventoryItemId} 
            onChange={(e) => setInventoryItemId(e.target.value)} 
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-blue-500 outline-none text-[var(--foreground)]" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Target ROI (%)</label>
          <input 
            type="number" 
            value={targetRoiPercent} 
            onChange={(e) => setTargetRoiPercent(e.target.value)} 
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-blue-500 outline-none text-[var(--foreground)]" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Market Floor</label>
          <input 
            type="number" 
            step="0.01" 
            value={marketFloor} 
            onChange={(e) => setMarketFloor(e.target.value)} 
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-blue-500 outline-none text-[var(--foreground)]" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Market Average</label>
          <input 
            type="number" 
            step="0.01" 
            value={marketAverage} 
            onChange={(e) => setMarketAverage(e.target.value)} 
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-blue-500 outline-none text-[var(--foreground)]" 
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button 
          onClick={handleAnalyze} 
          disabled={loading || !inventoryItemId.trim()} 
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Analyze
        </button>
        {result?.suggestedPrice && (
          <button 
            onClick={handleApply} 
            disabled={applying} 
            className="flex items-center gap-2 rounded-xl border border-emerald-500 bg-emerald-500/10 px-6 py-2.5 text-sm font-semibold text-emerald-500 hover:bg-emerald-500/20 disabled:opacity-50"
          >
            {applying && <Loader2 className="h-4 w-4 animate-spin" />} Apply
          </button>
        )}
      </div>

      {result && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 mt-4 grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-500 uppercase font-bold">Suggested</div>
            <div className="text-xl font-black text-blue-500">{formatMoney(result.suggestedPrice)}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase font-bold">Est. ROI</div>
            <div className="text-xl font-black text-emerald-500">{formatPercent(result.roiPercent)}</div>
          </div>
        </div>
      )}
    </div>
  );
}