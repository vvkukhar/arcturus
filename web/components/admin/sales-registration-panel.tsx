'use client';

import { useEffect, useState } from 'react';
import type { SalesStats } from '@/lib/entities';
import { apiFetch } from '@/lib/client-api';

export function SalesRegistrationPanel() {
  const [inventoryItemId, setInventoryItemId] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(false);

  const loadStats = async () => {
    const data = await apiFetch<SalesStats>('/api/sales/stats');
    setStats(data);
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5">
      <div className="text-xl font-black">Sales Registration</div>

      <input
        value={inventoryItemId}
        onChange={(e) => setInventoryItemId(e.target.value)}
        placeholder="Inventory Item ID"
        className="w-full rounded-xl border border-border px-4 py-3 text-sm"
      />

      <input
        value={sellPrice}
        onChange={(e) => setSellPrice(e.target.value)}
        placeholder="Sell Price"
        className="w-full rounded-xl border border-border px-4 py-3 text-sm"
      />

      <button
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        onClick={async () => {
          if (!inventoryItemId || !sellPrice) return;

          try {
            setLoading(true);

            await apiFetch('/api/sales/register', {
              method: 'POST',
              body: JSON.stringify({
                inventoryItemId,
                sellPrice: Number(sellPrice),
              }),
            });

            setInventoryItemId('');
            setSellPrice('');
            await loadStats();
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? 'Saving...' : 'Register Sale'}
      </button>

      <div className="rounded-xl border border-border bg-slate-50 p-4 text-sm">
        <div>Total Profit: {stats?.totalProfit ?? 0}</div>
        <div>Sales Count: {stats?.salesCount ?? 0}</div>
      </div>
    </div>
  );
}