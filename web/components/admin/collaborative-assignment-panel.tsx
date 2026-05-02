'use client';

import { useEffect, useState } from 'react';

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
    fetch('/api/collaboration/users')
      .then((r) => r.json())
      .then((data) => {
        const rows = Array.isArray(data) ? data : [];
        setUsers(rows);

        if (rows[0]?.id) {
          setUserId(rows[0].id);
        }
      });
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
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={async () => {
            if (!inventoryItemId || !userId) return;

            try {
              setLoading('inventory');
              await fetch('/api/collaboration/assign/inventory', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  inventoryItemId,
                  userId,
                }),
              });
              setInventoryItemId('');
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
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={async () => {
            if (!watchlistItemId || !userId) return;

            try {
              setLoading('watchlist');
              await fetch('/api/collaboration/assign/watchlist', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  watchlistItemId,
                  userId,
                }),
              });
              setWatchlistItemId('');
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