'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/client-api';
import { Loader2, Edit2, X } from 'lucide-react';
import type { InventoryItem } from '@/lib/types';

type Props = {
  item: InventoryItem;
};

function parseNumber(value: string, fallback: number | null = 0): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function InventoryEditDialog({ item }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [purchasePrice, setPurchasePrice] = useState(String(item.purchasePrice ?? ''));
  const [quantity, setQuantity] = useState(String(item.quantity ?? '1'));
  const [expectedSalePriceManual, setExpectedSalePriceManual] = useState(
    item.expectedSalePriceManual != null ? String(item.expectedSalePriceManual) : '',
  );
  
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

      const parsedPurchasePrice = parseNumber(purchasePrice, 0);
      const parsedQuantity = parseNumber(quantity, 1);
      const parsedExpectedSalePrice = expectedSalePriceManual.trim() === '' 
        ? null 
        : parseNumber(expectedSalePriceManual, null);

      if (parsedPurchasePrice === null || parsedPurchasePrice < 0) throw new Error('Invalid purchase price');
      if (parsedQuantity === null || parsedQuantity < 1) throw new Error('Quantity must be at least 1');

      await apiFetch('/api/admin/inventory/update', {
        method: 'PATCH',
        body: JSON.stringify({
          id: item.id,
          purchasePrice: parsedPurchasePrice,
          quantity: parsedQuantity,
          expectedSalePriceManual: parsedExpectedSalePrice,
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
          <h2 className="text-xl font-black tracking-tight text-slate-900">Edit Inventory Item</h2>
          <button onClick={handleClose} className="rounded-full p-2 hover:bg-slate-100 text-slate-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Purchase Price</label>
            <input
              required
              type="number"
              step="0.01"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Quantity</label>
            <input
              required
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Manual Sell Price</label>
            <input
              type="number"
              step="0.01"
              value={expectedSalePriceManual}
              onChange={(e) => setExpectedSalePriceManual(e.target.value)}
              placeholder="Leave empty to auto-calculate"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
            />
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