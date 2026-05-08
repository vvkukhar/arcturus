'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '@/lib/client-api';
import { Loader2, ReceiptText } from 'lucide-react';
import { formatMoney } from '@/lib/format';
import type { SalesStats } from '@/lib/types';

function parseNumber(value: string, fallback: number | null = null): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function SalesRegistrationPanel() {
  const [inventoryItemId, setInventoryItemId] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      const data = await apiFetch<SalesStats>('/api/sales/stats');
      setStats(data);
    } catch {
      setStats({ totalProfit: 0, salesCount: 0 });
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryItemId.trim() || !sellPrice.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const parsedPrice = parseNumber(sellPrice);
      if (parsedPrice === null || parsedPrice < 0) {
        throw new Error('Please enter a valid positive sale price');
      }

      await apiFetch('/api/sales/register', {
        method: 'POST',
        body: JSON.stringify({
          inventoryItemId: inventoryItemId.trim(),
          sellPrice: parsedPrice,
        }),
      });

      setInventoryItemId('');
      setSellPrice('');
      await loadStats();
      
      alert('Sale registered successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md">
          <ReceiptText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Register Point of Sale</h2>
          <p className="text-sm font-medium text-slate-500">
            Manually log offline or unlinked transactions.
          </p>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Inventory ID</label>
          <input
            required
            value={inventoryItemId}
            onChange={(e) => setInventoryItemId(e.target.value)}
            placeholder="e.g. inv-12345"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold text-[var(--foreground)] focus:bg-[var(--card)] focus:border-emerald-500 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Final Sale Price (₴)</label>
          <input
            required
            type="number"
            step="0.01"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold text-[var(--foreground)] focus:bg-[var(--card)] focus:border-emerald-500 outline-none transition-all shadow-sm"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-md shadow-emerald-600/20"
          disabled={loading || !inventoryItemId.trim() || !sellPrice.trim()}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Processing...' : 'Complete Transaction'}
        </button>
      </form>

      <div className="pt-6 border-t border-[var(--border)]">
        <div className="rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] p-5 flex flex-col sm:flex-row justify-between gap-6">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gross Deals</div>
            <div className="text-2xl font-black text-[var(--foreground)] mt-1">{stats?.salesCount ?? 0}</div>
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gross Yield</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{formatMoney(stats?.totalProfit)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}