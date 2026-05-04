'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ItemAutocomplete } from '@/components/admin/item-autocomplete';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/client-api';
import { Loader2, Plus, X } from 'lucide-react';

function parseNumber(value: string, fallback: number | null = null): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function CreateWatchlistDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  const [itemSearch, setItemSearch] = useState('');
  const [itemId, setItemId] = useState('');
  const [titleSnapshot, setTitleSnapshot] = useState('');
  const [desiredBuyPrice, setDesiredBuyPrice] = useState('');
  const [maxBuyPrice, setMaxBuyPrice] = useState('');
  const [targetSellPrice, setTargetSellPrice] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setItemSearch(''); setItemId(''); setTitleSnapshot('');
    setDesiredBuyPrice(''); setMaxBuyPrice(''); setTargetSellPrice('');
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const parsedDesired = parseNumber(desiredBuyPrice);
      const parsedMax = parseNumber(maxBuyPrice);
      const parsedTarget = parseNumber(targetSellPrice, null);

      if (!itemId.trim()) throw new Error('Item ID is required');
      if (!titleSnapshot.trim()) throw new Error('Title is required');
      if (parsedDesired == null || parsedDesired < 0) throw new Error('Invalid desired buy price');
      if (parsedMax == null || parsedMax < 0) throw new Error('Invalid max buy price');

      await apiFetch('/api/admin/watchlist/create', {
        method: 'POST',
        body: JSON.stringify({
          itemId: itemId.trim(),
          titleSnapshot: titleSnapshot.trim(),
          desiredBuyPrice: parsedDesired,
          maxBuyPrice: parsedMax,
          targetSellPrice: parsedTarget,
        }),
      });

      router.refresh();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Add to Watchlist
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-[2rem] border border-border bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Add to Watchlist</h2>
          <button onClick={handleClose} className="rounded-full p-2 hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Search Item</label>
            <ItemAutocomplete
              value={itemSearch}
              onChange={setItemSearch}
              onPick={(item) => {
                setItemSearch(item.title);
                setItemId(item.id);
                setTitleSnapshot(item.title);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Item ID</label>
              <input required value={itemId} onChange={(e) => setItemId(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Title Snapshot</label>
              <input required value={titleSnapshot} onChange={(e) => setTitleSnapshot(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Desired Buy</label>
              <input required type="number" step="0.01" value={desiredBuyPrice} onChange={(e) => setDesiredBuyPrice(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Max Buy</label>
              <input required type="number" step="0.01" value={maxBuyPrice} onChange={(e) => setMaxBuyPrice(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Sell</label>
              <input type="number" step="0.01" value={targetSellPrice} onChange={(e) => setTargetSellPrice(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Saving...' : 'Add Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}