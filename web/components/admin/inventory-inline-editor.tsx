'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { apiFetch } from '@/lib/client-api';
import { Loader2, Save } from 'lucide-react';
import type { InventoryItem } from '@/lib/types';

type Props = {
  item: InventoryItem;
};

function parseNumber(value: string, fallback: number | null = 0): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function InventoryInlineEditor({ item }: Props) {
  const router = useRouter();

  const [titleSnapshot, setTitleSnapshot] = useState(item.titleSnapshot ?? '');
  const [purchasePrice, setPurchasePrice] = useState(String(item.purchasePrice ?? ''));
  const [quantity, setQuantity] = useState(String(item.quantity ?? '1'));
  const [expectedSalePriceManual, setExpectedSalePriceManual] = useState(
    item.expectedSalePriceManual != null ? String(item.expectedSalePriceManual) : '',
  );
  const [condition, setCondition] = useState(item.condition ?? 'used');
  const [sealed, setSealed] = useState(Boolean(item.sealed));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      const parsedPurchasePrice = parseNumber(purchasePrice, 0);
      const parsedQuantity = parseNumber(quantity, 1);
      const parsedExpectedSalePrice = expectedSalePriceManual.trim() === '' 
        ? null 
        : parseNumber(expectedSalePriceManual, null);

      if (parsedPurchasePrice === null || parsedPurchasePrice < 0) throw new Error('Invalid purchase price');
      if (parsedQuantity === null || parsedQuantity < 1) throw new Error('Invalid quantity');

      await apiFetch('/api/admin/inventory/update', {
        method: 'PATCH',
        body: JSON.stringify({
          id: item.id,
          titleSnapshot,
          purchasePrice: parsedPurchasePrice,
          quantity: parsedQuantity,
          expectedSalePriceManual: parsedExpectedSalePrice,
          condition,
          sealed,
        }),
      });

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Quick Edit</span>
      </div>
      
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-7">
        <div className="md:col-span-2">
          <input
            value={titleSnapshot}
            onChange={(e) => setTitleSnapshot(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 outline-none"
            placeholder="Title"
          />
        </div>

        <input
          type="number"
          step="0.01"
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 outline-none"
          placeholder="Purchase (₴)"
        />

        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 outline-none"
          placeholder="Qty"
        />

        <input
          type="number"
          step="0.01"
          value={expectedSalePriceManual}
          onChange={(e) => setExpectedSalePriceManual(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 outline-none"
          placeholder="Manual Sell"
        />

        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-blue-500 outline-none cursor-pointer"
        >
          <option value="new">New</option>
          <option value="used">Used</option>
          <option value="incomplete">Incomplete</option>
        </select>

        <label className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm cursor-pointer hover:bg-slate-50">
          <input
            type="checkbox"
            checked={sealed}
            onChange={(e) => setSealed(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="font-medium text-slate-700">Sealed</span>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
        </div>
        <button
          disabled={loading}
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {loading ? 'Saving...' : 'Save Inline'}
        </button>
      </div>
    </div>
  );
}