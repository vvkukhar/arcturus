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

  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data : []));
  }, []);

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-white p-5">
      <div className="text-xl font-black">Notifications Center</div>
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
                  className="rounded-xl border border-border px-3 py-2 text-xs font-semibold"
                  onClick={async () => {
                    try {
                      setLoadingId(row.id);
                      await fetch('/api/notifications/read', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: row.id }),
                      });
                      setRows((current) =>
                        current.map((x) =>
                          x.id === row.id ? { ...x, read: true } : x,
                        ),
                      );
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