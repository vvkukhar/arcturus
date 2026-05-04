'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';
import { Loader2 } from 'lucide-react';
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

  const loadStats = async () => {
    try {
      const data = await apiFetch<SalesStats>('/api/sales/stats');
      setStats(data);
    } catch {
      // safe fallback
      setStats({ totalProfit: 0, salesCount: 0 });
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

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
    <div className="space-y-6 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Register Sale</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Manually register a sale to update inventory and profit metrics.
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Inventory Item ID</label>
          <input
            required
            value={inventoryItemId}
            onChange={(e) => setInventoryItemId(e.target.value)}
            placeholder="e.g. inv-12345"
            className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Final Sale Price (₴)</label>
          <input
            required
            type="number"
            step="0.01"
            value={sellPrice}
            onChange={(e) => setSellPrice(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
          disabled={loading || !inventoryItemId.trim() || !sellPrice.trim()}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Registering...' : 'Register Sale'}
        </button>
      </form>

      <div className="pt-6 border-t border-slate-100">
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Sales</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats?.salesCount ?? 0}</div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Profit</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">{formatMoney(stats?.totalProfit)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}