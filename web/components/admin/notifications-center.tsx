'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';

interface NotificationRow {
  id: string;
  title: string;
  message: string;
  type?: string;
  read?: boolean;
}

export function NotificationsCenter() {
  const { data, error: fetchError, mutate } = useSWR<NotificationRow[]>('/api/notifications', swrFetcher);
  const rows = Array.isArray(data) ? data : [];

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const displayError = error || (fetchError ? 'Failed to load notifications' : null);

  return (
    <div className="space-y-3 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-[var(--foreground)]">Notifications Center</h2>
        <button
          className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-semibold hover:bg-[var(--background)] transition-colors text-slate-500 hover:text-[var(--foreground)]"
          onClick={() => mutate()}
        >
          Reload
        </button>
      </div>

      {displayError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
          {displayError}
        </div>
      ) : null}

      {!data ? (
        <div className="text-sm text-slate-500 font-medium">Loading...</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-slate-500 font-medium">No notifications</div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {rows.map((row) => (
            <div key={row.id} className="rounded-xl border border-[var(--border)] p-4 bg-[var(--background)]/50 transition-colors hover:bg-[var(--background)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-[var(--foreground)] leading-tight">{row.title}</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{row.message}</div>
                  <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {row.type ?? 'info'} {row.read ? '• read' : '• unread'}
                  </div>
                </div>

                {!row.read ? (
                  <button
                    disabled={loadingId === row.id}
                    className="shrink-0 rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors"
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

                        await mutate(
                          rows.map((x) => (x.id === row.id ? { ...x, read: true } : x)),
                          false
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
          ))}
        </div>
      )}
    </div>
  );
}