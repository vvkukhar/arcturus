'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Loader2, PlaySquare, Power, ShieldAlert } from 'lucide-react';
import { StatusPill } from '@/components/admin/status-pill';
import { apiFetch } from '@/lib/client-api';
import { useState } from 'react';

interface SourceHealth {
  sourceCode: string;
  sourceName: string;
  enabled: boolean;
  latestErrorMessage?: string;
  activeListingCount: number;
  listingCount: number;
  latestRunStatus: string;
  latestRunStartedAt?: string;
  freshnessLabel: string;
}

export default function SourcesHealthPage() {
  const { data, isLoading, mutate } = useSWR<SourceHealth[]>('/api/proxy/source-health/summary', swrFetcher, { refreshInterval: 5000 });
  const rows = Array.isArray(data) ? data : [];
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggle = async (sourceCode: string, currentStatus: boolean) => {
    if (loadingId) return;
    try {
      setLoadingId(`toggle-${sourceCode}`);
      await apiFetch('/api/proxy/source-health/source/enabled', {
        method: 'PATCH',
        body: JSON.stringify({ sourceCode, enabled: !currentStatus }),
      });
      await mutate();
    } catch {
      alert('Failed to toggle source');
    } finally {
      setLoadingId(null);
    }
  };

  const handleRerun = async (sourceCode: string) => {
    if (loadingId) return;
    try {
      setLoadingId(`rerun-${sourceCode}`);
      await apiFetch('/api/proxy/source-health/rerun', {
        method: 'POST',
        body: JSON.stringify({ sourceCode }),
      });
      alert('Rerun triggered successfully');
      await mutate();
    } catch {
      alert('Failed to trigger rerun');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 hardware-accelerated">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Sources Health</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Real-time monitoring of marketplace scrapers, API endpoints, and data ingestion pipelines.</p>
      </div>

      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center bg-[var(--background)]/50">
            <ShieldAlert size={32} className="text-slate-300 mb-4" />
            <div className="text-lg font-bold text-slate-500">No sources configured</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse whitespace-nowrap text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-500 text-xs">Source</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-500 text-xs">Status</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-500 text-xs">Active Listings</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-500 text-xs">Last Run</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-500 text-xs">Freshness</th>
                  <th className="px-6 py-4 font-black uppercase tracking-widest text-slate-500 text-xs text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {rows.map((row) => (
                  <tr key={row.sourceCode} className="hover:bg-[var(--background)]/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-[var(--foreground)] text-base">{row.sourceName}</div>
                      <div className="text-xs font-mono text-slate-400 mt-0.5">{row.sourceCode}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${row.enabled ? (row.latestErrorMessage ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-slate-300'}`} />
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{row.enabled ? 'Active' : 'Disabled'}</span>
                      </div>
                      {row.latestErrorMessage && (
                        <div className="text-[10px] text-red-500 font-bold max-w-[200px] truncate mt-1" title={row.latestErrorMessage}>
                          Error: {row.latestErrorMessage}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-black text-[var(--foreground)]">{row.activeListingCount}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{row.listingCount} total</div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill value={row.latestRunStatus} />
                      <div className="text-[10px] font-bold text-slate-400 mt-1">
                        {row.latestRunStartedAt ? new Date(row.latestRunStartedAt).toLocaleString('uk-UA') : 'Never'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill value={row.freshnessLabel} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          disabled={loadingId !== null}
                          onClick={() => handleRerun(row.sourceCode)}
                          className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
                          title="Trigger Rerun"
                        >
                          {loadingId === `rerun-${row.sourceCode}` ? <Loader2 size={16} className="animate-spin" /> : <PlaySquare size={16} />}
                        </button>
                        <button
                          disabled={loadingId !== null}
                          onClick={() => handleToggle(row.sourceCode, row.enabled)}
                          className={`p-2 rounded-xl transition-colors disabled:opacity-50 ${row.enabled ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50'}`}
                          title={row.enabled ? 'Disable Source' : 'Enable Source'}
                        >
                          {loadingId === `toggle-${row.sourceCode}` ? <Loader2 size={16} className="animate-spin" /> : <Power size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}