'use client';

import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { getSocket } from '@/lib/socket';

type NotificationRow = {
  id?: string;
  title: string;
  message: string;
  type?: string;
  read?: boolean;
};

export function LiveNotificationsPanel() {
  const { data, error: fetchError } = useSWR<NotificationRow[]>('/api/notifications', swrFetcher, { revalidateOnFocus: false });
  const [liveRows, setLiveRows] = useState<NotificationRow[]>([]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setLiveRows(data);
    }
  }, [data]);

  useEffect(() => {
    const socket = getSocket();
    
    const onNotification = (payload: NotificationRow) => {
      setLiveRows((current) => {
        if (payload.id && current.some(r => r.id === payload.id)) return current;
        return [payload, ...current].slice(0, 50);
      });
    };

    socket.on('notification', onNotification);
    return () => {
      socket.off('notification', onNotification);
    };
  }, []);

  const unreadCount = useMemo(() => liveRows.filter((x) => !x.read).length, [liveRows]);

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xl font-black text-[var(--foreground)]">Live Notifications</div>
        <div className="rounded-full border border-[var(--border)] bg-[var(--background)]/50 px-3 py-1 text-xs font-semibold text-slate-500">
          {unreadCount} unread
        </div>
      </div>

      {fetchError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
          Failed to load initial notifications
        </div>
      ) : null}

      <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
        {liveRows.length === 0 ? (
          <div className="text-sm text-slate-500 p-2">No notifications</div>
        ) : (
          liveRows.slice(0, 15).map((row, index) => (
            <div key={row.id ?? `${row.title}-${index}`} className="rounded-xl border border-[var(--border)] bg-[var(--background)]/30 p-3 hover:bg-[var(--background)]/80 transition-colors">
              <div className="font-bold text-[var(--foreground)]">{row.title}</div>
              <div className="mt-1 text-sm text-slate-500 leading-tight">{row.message}</div>
              <div className="mt-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.type ?? 'info'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}