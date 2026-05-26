'use client';

import { useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { Loader2, TrendingUp, ShieldCheck, AlertTriangle } from 'lucide-react';
import { formatMoney, formatPercent } from '@/lib/format';

interface RepricerResult {
  inventoryItemId?: string;
  title?: string;
  suggestedPrice?: number;
  roiPercent?: number;
  classification?: string;
  marketMedian?: string;
  reasons?: string[];
}

export function RepricerPanel() {
  const [inventoryItemId, setInventoryItemId] = useState('');
  const [targetRoiPercent, setTargetRoiPercent] = useState('40');
  const [mode, setMode] = useState('balanced');
  
  const [result, setResult] = useState<RepricerResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (loading || !inventoryItemId.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch<RepricerResult>('/api/repricer/analyze', {
        method: 'POST',
        body: JSON.stringify({
          inventoryItemId: inventoryItemId.trim(),
          targetRoiPercent: Number(targetRoiPercent),
          mode,
        }),
      });
      setResult(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to analyze item. Ensure the Inventory ID is correct.');
    } finally { 
      setLoading(false); 
    }
  }, [loading, inventoryItemId, targetRoiPercent, mode]);

  const handleApply = useCallback(async () => {
    if (applying || !result?.suggestedPrice) return;
    try {
      setApplying(true);
      setError(null);
      await apiFetch('/api/repricer/apply', { 
        method: 'PATCH', 
        body: JSON.stringify({ 
          inventoryItemId: result.inventoryItemId ?? inventoryItemId.trim(), 
          suggestedPrice: result.suggestedPrice 
        }) 
      });
      alert('✅ Price updated successfully!');
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Failed to apply new price');
    } finally { 
      setApplying(false); 
      setResult(null);
      setInventoryItemId('');
    }
  }, [applying, result, inventoryItemId]);

  return (
    <div className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-black text-[var(--foreground)]">Smart Auto Repricer</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">ML-driven pricing based on Sold Comps and liquidity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Inventory Item ID</label>
          <input 
            value={inventoryItemId} 
            onChange={(e) => setInventoryItemId(e.target.value)} 
            placeholder="e.g. cmpa0bng6001pfr68b6sczzro"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-blue-500 outline-none text-[var(--foreground)] font-mono" 
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
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Pricing Strategy</label>
          <select 
            value={mode} 
            onChange={(e) => setMode(e.target.value)} 
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:border-blue-500 outline-none text-[var(--foreground)] cursor-pointer"
          >
            <option value="fast_sale">🚀 Fast Sale (Quick Liquidity)</option>
            <option value="balanced">⚖️ Balanced (Optimal ROI)</option>
            <option value="premium">💎 Premium (Hold for Max Value)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button 
          onClick={handleAnalyze} 
          disabled={loading || !inventoryItemId.trim()} 
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-500/20"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} {loading ? 'Analyzing Market...' : 'Analyze Market Data'}
        </button>
      </div>

{result && (
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] p-5 mt-4 animate-in fade-in zoom-in-95 duration-300">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5 pb-5 border-b border-[var(--border)]">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1">
                Suggested Price <ShieldCheck size={12} className="text-blue-500"/>
              </div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{formatMoney(result.suggestedPrice)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 flex items-center gap-1">
                Estimated ROI <TrendingUp size={12} className="text-emerald-500"/>
              </div>
              <div className={`text-2xl font-black ${result.roiPercent && result.roiPercent >= 20 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                {formatPercent(result.roiPercent)}
              </div>
            </div>
            {/* НОВІ МЕТРИКИ */}
            <div className="hidden lg:block">
              <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">
                Floor Price
              </div>
              <div className="text-lg font-bold text-slate-600 dark:text-slate-400">{formatMoney(result.floorPrice)}</div>
            </div>
            <div className="hidden lg:block">
              <div className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">
                Stretch Price
              </div>
              <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{formatMoney(result.stretchPrice)}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Engine Reasoning</div>
            {result.reasons?.map((reason, idx) => (
              <div key={idx} className="text-sm font-medium text-slate-600 dark:text-slate-300 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span> {reason}
              </div>
            ))}
          </div>

          <button 
            onClick={handleApply} 
            disabled={applying} 
            className="mt-6 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            {applying && <Loader2 className="h-4 w-4 animate-spin" />} Apply & Reprice Item
          </button>
        </div>
      )}
    </div>
  );
}