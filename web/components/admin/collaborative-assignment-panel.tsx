'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';

type UserRow = {
  id: string;
  name: string;
  email?: string | null;
  role?: string | null;
};

export function CollaborativeAssignmentPanel() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [inventoryItemId, setInventoryItemId] = useState('');
  const [watchlistItemId, setWatchlistItemId] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    apiFetch<UserRow[]>('/api/collaboration/users')
      .then((data) => {
        if (!mounted) return;
        const rows = Array.isArray(data) ? data : [];
        setUsers(rows);
        if (rows[0]?.id) {
          setUserId(rows[0].id);
        }
      })
      .catch(() => {
        if (mounted) setUsers([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5">
      <div className="text-xl font-black">Assignments</div>
      <select
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full rounded-xl border border-border px-4 py-3 text-sm"
      >
        <option value="">Select user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <div className="space-y-2">
        <input
          value={inventoryItemId}
          onChange={(e) => setInventoryItemId(e.target.value)}
          placeholder="Inventory Item ID"
          className="w-full rounded-xl border border-border px-4 py-3 text-sm"
        />
        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          disabled={loading === 'inventory'}
          onClick={async () => {
            if (!inventoryItemId || !userId) return;

            try {
              setLoading('inventory');
              await apiFetch('/api/collaboration/assign/inventory', {
                method: 'PATCH',
                body: JSON.stringify({
                  inventoryItemId,
                  userId,
                }),
              });
              setInventoryItemId('');
            } catch (e) {
              console.error(e);
            } finally {
              setLoading(null);
            }
          }}
        >
          {loading === 'inventory' ? 'Assigning...' : 'Assign Inventory'}
        </button>
      </div>
      <div className="space-y-2">
        <input
          value={watchlistItemId}
          onChange={(e) => setWatchlistItemId(e.target.value)}
          placeholder="Watchlist Item ID"
          className="w-full rounded-xl border border-border px-4 py-3 text-sm"
        />
        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          disabled={loading === 'watchlist'}
          onClick={async () => {
            if (!watchlistItemId || !userId) return;

            try {
              setLoading('watchlist');
              await apiFetch('/api/collaboration/assign/watchlist', {
                method: 'PATCH',
                body: JSON.stringify({
                  watchlistItemId,
                  userId,
                }),
              });
              setWatchlistItemId('');
            } catch (e) {
              console.error(e);
            } finally {
              setLoading(null);
            }
          }}
        >
          {loading === 'watchlist' ? 'Assigning...' : 'Assign Watchlist'}
        </button>
      </div>
    </div>
  );
}