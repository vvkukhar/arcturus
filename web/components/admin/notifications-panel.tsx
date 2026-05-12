'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';

type NotificationRow = {
  id: string;
  title: string;
  message: string;
  type?: string;
};

export function NotificationsPanel() {
  const { data, error, isLoading } = useSWR<NotificationRow[]>('/api/notifications', swrFetcher as any);
  const rows = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-white p-5">
      <div className="text-xl font-black">Notifications</div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load notifications
        </div>
      ) : null}

      {isLoading ? (
        <div className="text-sm text-slate-500">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-slate-500">No notifications</div>
      ) : (
        rows.slice(0, 10).map((row) => (
          <div key={row.id} className="rounded-xl border border-border p-3">
            <div className="font-bold">{row.title}</div>
            <div className="mt-1 text-sm text-slate-500">{row.message}</div>
            <div className="mt-1 text-xs text-slate-400">{row.type ?? 'info'}</div>
          </div>
        ))
      )}
    </div>
  );
}