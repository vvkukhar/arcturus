'use client';

import { useEffect, useState } from 'react';

type NotificationRow = {
  id: string;
  title: string;
  message: string;
  type?: string;
  read?: boolean;
};

export function NotificationsCenter() {
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setError(null);

      const response = await fetch('/api/notifications', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Notifications failed: ${response.status}`);
      }

      const data = await response.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xl font-black">Notifications Center</div>
        <button
          className="rounded-xl border border-border px-3 py-2 text-xs font-semibold hover:bg-slate-50"
          onClick={load}
        >
          Reload
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div className="text-sm text-slate-500">No notifications</div>
      ) : (
        rows.map((row) => (
          <div key={row.id} className="rounded-xl border border-border p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-bold">{row.title}</div>
                <div className="mt-1 text-sm text-slate-500">{row.message}</div>
                <div className="mt-1 text-xs text-slate-400">
                  {row.type ?? 'info'} {row.read ? '• read' : '• unread'}
                </div>
              </div>

              {!row.read ? (
                <button
                  disabled={loadingId === row.id}
                  className="rounded-xl border border-border px-3 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={async () => {
                    try {
                      setLoadingId(row.id);
                      setError(null);

                      const response = await fetch('/api/notifications/read', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: row.id }),
                      });

                      if (!response.ok) {
                        throw new Error(`Mark read failed: ${response.status}`);
                      }

                      setRows((current) =>
                        current.map((x) =>
                          x.id === row.id ? { ...x, read: true } : x,
                        ),
                      );
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Mark read failed');
                    } finally {
                      setLoadingId(null);
                    }
                  }}
                >
                  {loadingId === row.id ? 'Saving...' : 'Mark Read'}
                </button>
              ) : null}
            </div>
          </div>
        ))
      )}
    </div>
  );
}