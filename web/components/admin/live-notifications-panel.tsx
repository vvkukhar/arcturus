'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSocket } from '@/lib/socket';

type NotificationRow = {
  id?: string;
  title: string;
  message: string;
  type?: string;
  read?: boolean;
};

export function LiveNotificationsPanel() {
  const [rows, setRows] = useState<NotificationRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

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

        if (mounted) {
          setRows(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load notifications');
        }
      }
    };

    const socket = getSocket();

    const onNotification = (payload: NotificationRow) => {
      setRows((current) => [payload, ...current]);
    };

    load();
    socket.on('notification', onNotification);

    return () => {
      mounted = false;
      socket.off('notification', onNotification);
    };
  }, []);

  const unreadCount = useMemo(
    () => rows.filter((x) => !x.read).length,
    [rows],
  );

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="text-xl font-black">Live Notifications</div>
        <div className="rounded-full border border-border bg-slate-50 px-3 py-1 text-xs font-semibold">
          {unreadCount} unread
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div className="text-sm text-slate-500">No notifications</div>
      ) : (
        rows.slice(0, 12).map((row, index) => (
          <div
            key={row.id ?? `${row.title}-${index}`}
            className="rounded-xl border border-border p-3"
          >
            <div className="font-bold">{row.title}</div>
            <div className="mt-1 text-sm text-slate-500">{row.message}</div>
            <div className="mt-1 text-xs text-slate-400">{row.type ?? 'info'}</div>
          </div>
        ))
      )}
    </div>
  );
}