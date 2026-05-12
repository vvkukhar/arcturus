'use client';

import { useState, useEffect, useCallback } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { apiFetch } from '@/lib/client-api';
import type { User } from '@/lib/types';
import { Loader2 } from 'lucide-react';

export function CollaborativeAssignmentPanel() {
  const { data: rawUsers, mutate } = useSWR<User[]>('/api/collaboration/users', swrFetcher);
  const users = Array.isArray(rawUsers) ? rawUsers : [];

  const [inventoryItemId, setInventoryItemId] = useState('');
  const [watchlistItemId, setWatchlistItemId] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState<'inventory' | 'watchlist' | null>(null);

  useEffect(() => {
    if (users.length > 0 && !userId) {
      setUserId(users[0].id);
    }
  }, [users, userId]);

  const handleAssignInventory = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !inventoryItemId.trim() || !userId) return;

    try {
      setLoading('inventory');
      await apiFetch('/api/collaboration/assign/inventory', {
        method: 'PATCH',
        body: JSON.stringify({ inventoryItemId: inventoryItemId.trim(), userId }),
      });
      setInventoryItemId('');
      mutate();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Assignment failed');
    } finally {
      setLoading(null);
    }
  }, [inventoryItemId, userId, loading, mutate]);

  const handleAssignWatchlist = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !watchlistItemId.trim() || !userId) return;

    try {
      setLoading('watchlist');
      await apiFetch('/api/collaboration/assign/watchlist', {
        method: 'PATCH',
        body: JSON.stringify({ watchlistItemId: watchlistItemId.trim(), userId }),
      });
      setWatchlistItemId('');
      mutate();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Assignment failed');
    } finally {
      setLoading(null);
    }
  }, [watchlistItemId, userId, loading, mutate]);

  return (
    <div className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-black text-[var(--foreground)]">Task Assignments</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">Assign inventory or watchlist items to operators.</p>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Select Operator</label>
        <select
          required
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:bg-[var(--card)] focus:border-blue-500 outline-none cursor-pointer text-[var(--foreground)]"
        >
          <option value="" disabled>Select user...</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>{user.name} ({user.role})</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 pt-2 border-t border-[var(--border)]">
        <form onSubmit={handleAssignInventory} className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Assign Inventory</label>
          <input
            required
            value={inventoryItemId}
            onChange={(e) => setInventoryItemId(e.target.value)}
            placeholder="Inventory Item ID"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:bg-[var(--card)] focus:border-blue-500 outline-none text-[var(--foreground)]"
          />
          <button
            type="submit"
            disabled={loading !== null || !inventoryItemId.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
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
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm focus:bg-[var(--card)] focus:border-blue-500 outline-none text-[var(--foreground)]"
          />
          <button
            type="submit"
            disabled={loading !== null || !watchlistItemId.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
          >
            {loading === 'watchlist' && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading === 'watchlist' ? 'Assigning...' : 'Assign'}
          </button>
        </form>
      </div>
    </div>
  );
}