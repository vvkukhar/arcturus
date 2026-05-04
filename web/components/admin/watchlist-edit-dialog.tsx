'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/client-api';
import { Loader2, Edit2, X } from 'lucide-react';
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
      <Button variant="secondary" className="px-3 py-2 text-xs flex items-center gap-1.5" onClick={() => setOpen(true)}>
        <Edit2 className="h-3.5 w-3.5" />
        Edit
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-[2rem] border border-border bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black tracking-tight text-slate-900">Edit Watchlist Item</h2>
          <button onClick={handleClose} className="rounded-full p-2 hover:bg-slate-100 text-slate-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Desired Buy</label>
              <input
                required
                type="number"
                step="0.01"
                value={desiredBuyPrice}
                onChange={(e) => setDesiredBuyPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Max Buy</label>
              <input
                required
                type="number"
                step="0.01"
                value={maxBuyPrice}
                onChange={(e) => setMaxBuyPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Sell</label>
              <input
                type="number"
                step="0.01"
                value={targetSellPrice}
                onChange={(e) => setTargetSellPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Priority (0-10)</label>
              <input
                required
                type="number"
                min="0"
                max="10"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold cursor-pointer hover:bg-slate-100">
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span>Active Item</span>
            </label>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <div className="mt-6 flex gap-3 pt-2">
            <Button type="button" variant="ghost" className="flex-1" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}