'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Loader2, Save } from 'lucide-react';
import type { WatchlistItem } from '@/lib/types';

type Props = {
  item: WatchlistItem;
  onSuccessAction?: () => void;
};

function parseNumber(value: string, fallback: number | null = 0): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function WatchlistInlineEditor({ item, onSuccessAction }: Props) {
  const [titleSnapshot, setTitleSnapshot] = useState(item.titleSnapshot ?? '');
  const [desiredBuyPrice, setDesiredBuyPrice] = useState(String(item.desiredBuyPrice ?? ''));
  const [maxBuyPrice, setMaxBuyPrice] = useState(String(item.maxBuyPrice ?? ''));
  const [targetSellPrice, setTargetSellPrice] = useState(
    item.targetSellPrice != null ? String(item.targetSellPrice) : '',
  );
  const [active, setActive] = useState(Boolean(item.active));
  const [priority, setPriority] = useState(String(item.priority ?? '0'));
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (loading) return;
    try {
      setLoading(true);
      setError(null);

      const parsedDesired = parseNumber(desiredBuyPrice, 0);
      const parsedMax = parseNumber(maxBuyPrice, 0);
      const parsedTarget = targetSellPrice.trim() === '' ? null : parseNumber(targetSellPrice, null);
      const parsedPriority = parseNumber(priority, 0);

      if (parsedDesired === null || parsedDesired < 0) throw new Error('Invalid desired buy');
      if (parsedMax === null || parsedMax < 0) throw new Error('Invalid max buy');

      await apiFetch('/api/admin/watchlist/update', {
        method: 'PATCH',
        body: JSON.stringify({
          id: item.id,
          titleSnapshot: titleSnapshot.trim(),
          desiredBuyPrice: parsedDesired,
          maxBuyPrice: parsedMax,
          targetSellPrice: parsedTarget,
          active,
          priority: parsedPriority,
        }),
      });

      if (onSuccessAction) onSuccessAction();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm font-bold text-[var(--foreground)] focus:bg-[var(--card)] focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-500";

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Quick Edit Configuration</span>
      </div>
      
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-7">
        <div className="md:col-span-2">
          <input
            value={titleSnapshot}
            onChange={(e) => setTitleSnapshot(e.target.value)}
            className={inputClasses}
            placeholder="Title Snapshot"
          />
        </div>

        <input
          type="number"
          step="0.01"
          value={desiredBuyPrice}
          onChange={(e) => setDesiredBuyPrice(e.target.value)}
          className={inputClasses}
          placeholder="Desired Buy"
        />

        <input
          type="number"
          step="0.01"
          value={maxBuyPrice}
          onChange={(e) => setMaxBuyPrice(e.target.value)}
          className={inputClasses}
          placeholder="Max Buy"
        />

        <input
          type="number"
          step="0.01"
          value={targetSellPrice}
          onChange={(e) => setTargetSellPrice(e.target.value)}
          className={inputClasses}
          placeholder="Target Sell"
        />

        <input
          type="number"
          min="0"
          max="100"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className={inputClasses}
          placeholder="Priority"
        />

        <label className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm cursor-pointer hover:bg-[var(--card)] transition-colors">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="font-bold text-[var(--foreground)]">Active</span>
        </label>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
        </div>
        <button
          disabled={loading}
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-5 py-2 text-sm font-semibold text-white dark:text-slate-900 transition-colors hover:bg-black dark:hover:bg-slate-200 disabled:opacity-50 shadow-sm"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {loading ? 'Saving...' : 'Save Inline'}
        </button>
      </div>
    </div>
  );
}