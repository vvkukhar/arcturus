'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { DatabaseZap, Loader2 } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';
import { useState, useEffect } from 'react';

interface SourceRunLog {
  id: string;
  sourceId: string;
  startedAt: string;
  finishedAt: string | null;
  status: string;
  itemsSeen: number;
  itemsMatched: number;
  itemsInserted: number;
  itemsUpdated: number;
  errorMessage: string | null;
  source?: {
    code: string;
    name: string;
  };
}

export default function SourcesRunsPage() {
  const { data, isLoading } = useSWR<SourceRunLog[]>('/api/proxy/sync-runs', swrFetcher, { refreshInterval: 10000 });
  const rows = Array.isArray(data) ? data : [];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 hardware-accelerated">
      <div className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
          <DatabaseZap size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Execution Runs</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Detailed logs of scanner jobs, matching algorithms, and cron executions.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-[2rem] border border-[var(--border)] bg-[var(--card)]">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : (
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] overflow-hidden shadow-sm">
          <DataTable
            rows={rows}
            emptyText="No execution runs logged yet."
            getRowKey={(row) => row.id}
            columns={[
              {
                key: 'timestamp',
                header: 'Started At',
                render: (row) => (
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[var(--foreground)]">
                      {mounted ? new Date(row.startedAt).toLocaleString('uk-UA') : ''}
                    </span>
                    {mounted && row.finishedAt && (
                      <span className="text-xs font-mono text-slate-500 mt-0.5">
                        {((new Date(row.finishedAt).getTime() - new Date(row.startedAt).getTime()) / 1000).toFixed(1)}s duration
                      </span>
                    )}
                  </div>
                ),
              },
              {
                key: 'sourceCode',
                header: 'Source',
                render: (row) => (
                  <span className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">
                    {row.source?.code ?? 'UNKNOWN'}
                  </span>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (row) => <StatusPill value={row.status} />,
              },
              {
                key: 'metrics',
                header: 'Items Processed',
                render: (row) => (
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-wider text-slate-500">
                    <div>Seen: <span className="text-[var(--foreground)]">{row.itemsSeen}</span></div>
                    <div>Matched: <span className="text-blue-500">{row.itemsMatched}</span></div>
                    <div>New: <span className="text-emerald-500">{row.itemsInserted}</span></div>
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