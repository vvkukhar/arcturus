'use client';

import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { apiFetch } from '@/lib/api';
import { RefreshCw, ServerCrash, DatabaseZap, Loader2, PlaySquare } from 'lucide-react';
import { MetricCard } from '@/components/admin/metric-card';
import { StatusPill } from '@/components/admin/status-pill';
import { getSocket } from '@/lib/socket';

interface SyncSummary {
  totalItems: number;
  needsRefresh: number;
  fresh: number;
  aging: number;
  stale: number;
}

interface CriticalItem {
  id: string;
  title: string;
  snapshotFreshnessLabel: string;
}

export default function SyncCenterPage() {
  const { data: summary, mutate: mutateSummary } = useSWR<SyncSummary>('/api/proxy/sync/dashboard/summary', swrFetcher);
  const { data: criticalData } = useSWR<CriticalItem[]>('/api/proxy/sync/critical?limit=10', swrFetcher);
  
  const critical = Array.isArray(criticalData) ? criticalData : null;
  const isMounted = useRef(false);

  const [loading, setLoading] = useState(false);
  const [syncState, setSyncState] = useState({
    status: 'idle',
    processedItems: 0,
    totalItems: 0,
    message: 'Ready for sync',
  });

  useEffect(() => {
    isMounted.current = true;
    const socket = getSocket();
    
    const handleStarted = (data: any) => {
      if (isMounted.current) {
        setSyncState({ status: 'running', processedItems: 0, totalItems: data.totalItems, message: 'Syncing...' });
      }
    };
    
    const handleProgress = (data: any) => {
      if (isMounted.current) {
        setSyncState(prev => ({ ...prev, processedItems: data.processedItems, totalItems: data.totalItems }));
      }
    };
    
    const handleFinished = () => {
      if (isMounted.current) {
        setSyncState(prev => ({ ...prev, status: 'finished', message: 'Sync completed', processedItems: prev.totalItems }));
        mutateSummary();
      }
    };
    
    const handleFailed = (data: any) => {
      if (isMounted.current) {
        setSyncState(prev => ({ ...prev, status: 'failed', message: data.message }));
      }
    };

    socket.on('sync.started', handleStarted);
    socket.on('sync.progress', handleProgress);
    socket.on('sync.finished', handleFinished);
    socket.on('sync.failed', handleFailed);
    
    return () => {
      isMounted.current = false;
      socket.off('sync.started', handleStarted);
      socket.off('sync.progress', handleProgress);
      socket.off('sync.finished', handleFinished);
      socket.off('sync.failed', handleFailed);
    };
  }, [mutateSummary]);

  const handleRefreshAll = async () => {
    if (loading || syncState.status === 'running') return;
    try {
      setLoading(true);
      await apiFetch('/api/admin/sync/refresh-all', { method: 'POST' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Sync queue failed');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const isRunning = syncState.status === 'running';
  const progressPercent = syncState.totalItems > 0 ? (syncState.processedItems / syncState.totalItems) * 100 : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Sync Center</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Asynchronous background synchronization via BullMQ.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Monitored Assets" value={summary?.totalItems ?? 0} subtitle="Tracked in database" />
        <MetricCard title="Needs Refresh" value={summary?.needsRefresh ?? 0} subtitle="Stale or missing snapshots" />
        <MetricCard title="Fresh Snapshots" value={summary?.fresh ?? 0} subtitle="Updated in last 6 hours" />
        <MetricCard title="Aging / Stale" value={(summary?.aging ?? 0) + (summary?.stale ?? 0)} subtitle="Requires attention" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                <DatabaseZap size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-[var(--foreground)]">Global Async Refresh</h2>
                <p className="text-sm font-medium text-slate-500">Dispatch bulk computation jobs.</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-[var(--background)]/50 border border-[var(--border)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Queue Status</span>
                <StatusPill value={syncState.status} />
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-[var(--foreground)]">{syncState.message}</span>
                {isRunning && <span className="text-sm font-black text-indigo-600">{progressPercent.toFixed(1)}%</span>}
              </div>
              
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-500 ease-out" 
                  style={{ width: `${isRunning ? progressPercent : (syncState.status === 'finished' ? 100 : 0)}%` }}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRefreshAll}
                disabled={loading || isRunning}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-indigo-700 disabled:opacity-50"
              >
                {(loading || isRunning) ? <Loader2 className="h-5 w-5 animate-spin" /> : <PlaySquare className="h-5 w-5" />}
                {(loading || isRunning) ? 'Queueing...' : 'Dispatch Refresh'}
              </button>
              <button
                onClick={() => setSyncState({ status: 'idle', processedItems: 0, totalItems: 0, message: 'Ready' })}
                disabled={isRunning}
                className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3.5 text-slate-500 transition-all hover:bg-[var(--background)] hover:text-[var(--foreground)] disabled:opacity-50"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
              <ServerCrash size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--foreground)]">Critical Assets</h2>
              <p className="text-sm font-medium text-slate-500">Items missing data or severely outdated.</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {!critical ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-slate-300" /></div>
            ) : critical.length === 0 ? (
              <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--background)]/50 text-sm font-bold text-slate-400">
                No critical items found. All good!
              </div>
            ) : (
              critical.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-[var(--border)] bg-[var(--background)]/50 hover:bg-[var(--card)] transition-colors group">
                  <div>
                    <div className="font-bold text-[var(--foreground)] line-clamp-1 max-w-[200px]">{item.title}</div>
                    <div className="text-xs font-mono text-slate-500 mt-1">ID: {item.id}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <StatusPill value={item.snapshotFreshnessLabel} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}