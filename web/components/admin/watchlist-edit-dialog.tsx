'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { Loader2, Edit2, X, DollarSign, Target, Activity } from 'lucide-react';
import type { WatchlistItem } from '@/lib/types';

type Props = {
  item: WatchlistItem;
};

function parseNumber(value: string, fallback: number | null = 0): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function WatchlistEditDialog({ item }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [desiredBuyPrice, setDesiredBuyPrice] = useState(String(item.desiredBuyPrice ?? ''));
  const [maxBuyPrice, setMaxBuyPrice] = useState(String(item.maxBuyPrice ?? ''));
  const [targetSellPrice, setTargetSellPrice] = useState(
    item.targetSellPrice != null ? String(item.targetSellPrice) : '',
  );
  const [active, setActive] = useState(item.active);
  const [priority, setPriority] = useState(String(item.priority ?? '0'));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const parsedDesired = parseNumber(desiredBuyPrice, 0);
      const parsedMax = parseNumber(maxBuyPrice, 0);
      const parsedTarget = targetSellPrice.trim() === '' ? null : parseNumber(targetSellPrice, null);
      const parsedPriority = parseNumber(priority, 0);

      if (parsedDesired === null || parsedDesired < 0) throw new Error('Invalid desired buy price');
      if (parsedMax === null || parsedMax < 0) throw new Error('Invalid max buy price');

      await apiFetch('/api/admin/watchlist/update', {
        method: 'PATCH',
        body: JSON.stringify({
          id: item.id,
          desiredBuyPrice: parsedDesired,
          maxBuyPrice: parsedMax,
          targetSellPrice: parsedTarget,
          active,
          priority: parsedPriority,
        }),
      });

      router.refresh();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button variant="secondary" className="px-3 py-2 text-xs flex items-center gap-1.5 rounded-xl shadow-sm" onClick={() => setOpen(true)}>
        <Edit2 className="h-3.5 w-3.5" />
        Edit
      </Button>
    );
  }

  const inputClasses = "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold text-[var(--foreground)] focus:bg-[var(--card)] focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden text-left">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-[var(--border)] shrink-0 flex justify-between items-center bg-[var(--background)]/50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Edit Watchlist Target</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 truncate max-w-[250px] sm:max-w-xs">{item.titleSnapshot}</p>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-full p-2 bg-[var(--card)] border border-[var(--border)] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-500 border-b border-[var(--border)] pb-2">
              <DollarSign size={16} /> Financial Targets
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Desired Buy Price (₴)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={desiredBuyPrice}
                  onChange={(e) => setDesiredBuyPrice(e.target.value)}
                  className={inputClasses}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Max Buy Price (₴)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={maxBuyPrice}
                  onChange={(e) => setMaxBuyPrice(e.target.value)}
                  className={inputClasses}
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Target Sell Price (₴)</label>
              <input
                type="number"
                step="0.01"
                value={targetSellPrice}
                onChange={(e) => setTargetSellPrice(e.target.value)}
                className={inputClasses}
                placeholder="Optional. Used for ROI estimates"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-500 border-b border-[var(--border)] pb-2">
              <Activity size={16} /> Engine Priority
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Priority (0-100)</label>
                <input
                  required
                  type="number"
                  min="0"
                  max="100"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className={inputClasses}
                />
              </div>
              
              <label className="flex h-[46px] items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 cursor-pointer hover:bg-[var(--card)] transition-colors shadow-sm">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                />
                <span className="font-bold text-[var(--foreground)] text-sm">Active Monitoring</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-[var(--border)] shrink-0 flex justify-end gap-3 bg-[var(--background)]/50">
          <Button type="button" variant="ghost" className="px-8 h-12 rounded-xl font-bold" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="px-8 h-12 rounded-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all" 
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Edit2 className="mr-2 h-5 w-5" />} 
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

      </div>
    </div>
  );
}