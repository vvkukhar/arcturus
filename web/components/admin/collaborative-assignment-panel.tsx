'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export function CollaborativeAssignmentPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [inventoryItemId, setInventoryItemId] = useState('');
  const [watchlistItemId, setWatchlistItemId] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState<'inventory' | 'watchlist' | null>(null);

  useEffect(() => {
    let mounted = true;
    apiFetch<User[]>('/api/collaboration/users')
      .then((data) => {
        if (!mounted) return;
        const rows = Array.isArray(data) ? data : [];
        setUsers(rows);
        if (rows[0]?.id) setUserId(rows[0].id);
      })
      .catch(() => {
        if (mounted) setUsers([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleAssignInventory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inventoryItemId.trim() || !userId) return;

    try {
      setLoading('inventory');
      await apiFetch('/api/collaboration/assign/inventory', {
        method: 'PATCH',
        body: JSON.stringify({ inventoryItemId: inventoryItemId.trim(), userId }),
      });
      setInventoryItemId('');
      alert('Inventory assigned successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Assignment failed');
    } finally {
      setLoading(null);
    }
  };

  const handleAssignWatchlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!watchlistItemId.trim() || !userId) return;

    try {
      setLoading('watchlist');
      await apiFetch('/api/collaboration/assign/watchlist', {
        method: 'PATCH',
        body: JSON.stringify({ watchlistItemId: watchlistItemId.trim(), userId }),
      });
      setWatchlistItemId('');
      alert('Watchlist item assigned successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Assignment failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-black text-slate-900">Task Assignments</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">Assign inventory or watchlist items to operators.</p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Operator</label>
        <select
          required
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
        >
          <option value="" disabled>Select user...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 pt-2 border-t border-slate-100">
        <form onSubmit={handleAssignInventory} className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Assign Inventory</label>
          <input
            required
            value={inventoryItemId}
            onChange={(e) => setInventoryItemId(e.target.value)}
            placeholder="Inventory Item ID"
            className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading !== null || !inventoryItemId.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
          >
            {loading === 'inventory' && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading === 'inventory' ? 'Assigning...' : 'Assign'}
          </button>
        </form>

        <form onSubmit={handleAssignWatchlist} className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Assign Watchlist</label>
          <input
            required
            value={watchlistItemId}
            onChange={(e) => setWatchlistItemId(e.target.value)}
            placeholder="Watchlist Item ID"
            className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading !== null || !watchlistItemId.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-50"
          >
            {loading === 'watchlist' && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading === 'watchlist' ? 'Assigning...' : 'Assign'}
          </button>
        </form>
      </div>
    </div>
  );
}