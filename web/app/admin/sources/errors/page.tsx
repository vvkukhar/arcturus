'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { useI18n } from '@/components/providers/i18n-provider';

interface SyncErrorLog {
  id: string;
  scope: string;
  sourceCode: string | null;
  message: string;
  detailsJson?: {
    error?: string;
    [key: string]: unknown;
  };
  createdAt: string;
}

export default function SourcesErrorsPage() {
  const { t } = useI18n();
  const { data, isLoading } = useSWR<SyncErrorLog[]>('/api/proxy/sync-runs/errors', swrFetcher, { refreshInterval: 10000 });
  const rows = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 hardware-accelerated">
      <div className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Error Logs</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Centralized error reporting for unresolved matches, broken proxies, and sync failures.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-[2rem] border border-[var(--border)] bg-[var(--card)]">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
      ) : (
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
          <DataTable
            rows={rows}
            emptyText="No sync errors found. The system is perfectly healthy!"
            getRowKey={(row) => row.id}
            columns={[
              {
                key: 'timestamp',
                header: 'Timestamp',
                render: (row) => (
                  <span className="text-sm font-mono text-slate-500">
                    {new Date(row.createdAt).toLocaleString('uk-UA')}
                  </span>
                ),
              },
              {
                key: 'scope',
                header: 'Scope',
                render: (row) => (
                  <span className="inline-flex px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                    {row.scope}
                  </span>
                ),
              },
              {
                key: 'sourceCode',
                header: 'Source',
                render: (row) => (
                  <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">
                    {row.sourceCode ?? 'SYSTEM'}
                  </span>
                ),
              },
              {
                key: 'message',
                header: 'Error Message',
                render: (row) => (
                  <div className="font-medium text-red-600 dark:text-red-400">
                    {row.message}
                    {row.detailsJson?.error && (
                      <div className="text-xs text-slate-500 mt-1 truncate max-w-md" title={row.detailsJson.error}>
                        {row.detailsJson.error}
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}