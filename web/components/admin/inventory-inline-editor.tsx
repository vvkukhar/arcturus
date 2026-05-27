'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Loader2, Save } from 'lucide-react';
import type { InventoryItem } from '@/lib/types';

type Props = {
  item: InventoryItem;
  onSuccessAction?: () => void;
};

function parseNumber(value: string, fallback: number | null = 0): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function InventoryInlineEditor({ item, onSuccessAction }: Props) {
  const [titleSnapshot, setTitleSnapshot] = useState(item.titleSnapshot ?? '');
  const [purchasePrice, setPurchasePrice] = useState(String(item.purchasePrice ?? ''));
  const [quantity, setQuantity] = useState(String(item.quantity ?? '1'));
  const [expectedSalePriceManual, setExpectedSalePriceManual] = useState(
    item.expectedSalePriceManual != null ? String(item.expectedSalePriceManual) : '',
  );
  const [condition, setCondition] = useState(item.condition ?? 'used');
  const [sealed, setSealed] = useState(Boolean(item.sealed));
  const [notes, setNotes] = useState(item.notes ?? '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (loading) return;
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
          titleSnapshot: titleSnapshot.trim(),
          purchasePrice: parsedPurchasePrice,
          quantity: parsedQuantity,
          expectedSalePriceManual: parsedExpectedSalePrice,
          condition,
          sealed,
          notes: notes.trim() || null,
        }),
      });

      if (onSuccessAction) onSuccessAction();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold text-[var(--foreground)] focus:bg-[var(--card)] focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-500";

  return (
    <div className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Configuration</h2>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Title Snapshot</label>
          <input
            value={titleSnapshot}
            onChange={(e) => setTitleSnapshot(e.target.value)}
            className={inputClasses}
            placeholder="Title"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Purchase Price (₴)</label>
          <input
            type="number"
            step="0.01"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className={inputClasses}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Manual Sell Price (₴)</label>
          <input
            type="number"
            step="0.01"
            value={expectedSalePriceManual}
            onChange={(e) => setExpectedSalePriceManual(e.target.value)}
            className={inputClasses}
            placeholder="Auto-calculate if empty"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={inputClasses}
            placeholder="1"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Condition</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className={`${inputClasses} cursor-pointer`}
          >
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>

        <div className="space-y-1.5 flex flex-col justify-end">
          <label className="flex h-[46px] items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 cursor-pointer hover:bg-[var(--card)] transition-colors shadow-sm">
            <input
              type="checkbox"
              checked={sealed}
              onChange={(e) => setSealed(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
            />
            <span className="font-bold text-[var(--foreground)] text-sm">Factory Sealed</span>
          </label>
        </div>
      </div>

      <div className="space-y-1.5 flex-1 flex flex-col">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Product Description / Notes (Visible to buyers)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Detailed description of the item..."
          className={`${inputClasses} flex-1 resize-none min-h-[120px] custom-scrollbar`}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[var(--border)] mt-auto">
        <div className="w-full sm:w-auto">
          {error && <span className="text-sm font-bold text-red-600">{error}</span>}
        </div>
        <button
          disabled={loading}
          onClick={handleSave}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-sm font-bold text-white transition-all hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-600/20 active:scale-95"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}