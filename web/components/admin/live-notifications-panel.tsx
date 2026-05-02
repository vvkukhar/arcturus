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

  useEffect(() => {
    fetch('/api/notifications')
      .then((r) => r.json())
      .then((data) => setRows(Array.isArray(data) ? data : []));

    const socket = getSocket();

    const onNotification = (payload: NotificationRow) => {
      setRows((current) => [payload, ...current]);
    };

    socket.on('notification', onNotification);

    return () => {
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
        <div className="rounded-full border border-border bg-slate-50 px-3 py-1 text-xs fontsemibold">
          {unreadCount} unread
        </div>
      </div>
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