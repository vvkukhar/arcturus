'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { apiFetch } from '@/lib/api';
import { OperatorSpeedDesk } from '@/components/admin/operator-speed-desk';
import { useI18n } from '@/components/providers/i18n-provider';
import { Loader2 } from 'lucide-react';
import { useCallback } from 'react';

export default function AdminOperatorUnresolvedPage() {
  const { t } = useI18n();
  const { data: rows, isLoading, mutate } = useSWR<any[]>('/api/proxy/operator/unresolved-matches', swrFetcher, { revalidateOnFocus: false });
  const { data: summary, mutate: mutateSummary } = useSWR<any>('/api/proxy/operator/unresolved-summary', swrFetcher);

  const handleResolveAction = useCallback(async (id: string, itemId: string) => {
    try {
      await apiFetch('/api/proxy/operator/resolve-match', {
        method: 'PATCH',
        body: JSON.stringify({ queueId: id, itemId }),
      });
      mutate((currentData) => Array.isArray(currentData) ? currentData.filter(item => item.id !== id) : [], false);
      mutateSummary();
    } catch (e) {
      console.error(e);
    }
  }, [mutate, mutateSummary]);

  const handleDismissAction = useCallback(async (id: string) => {
    try {
      await apiFetch('/api/proxy/operator/dismiss-match', {
        method: 'PATCH',
        body: JSON.stringify({ queueId: id }),
      });
      mutate((currentData) => Array.isArray(currentData) ? currentData.filter(item => item.id !== id) : [], false);
      mutateSummary();
    } catch (e) {
      console.error(e);
    }
  }, [mutate, mutateSummary]);

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600"/>
      </div>
    );
  }

  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 hardware-accelerated">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">{t('operator.title' as any)}</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">{t('operator.subtitle' as any)}</p>
        </div>
        
        <div className="flex gap-4">
          <div className="text-center px-4">
            <div className="text-2xl font-black text-amber-500">{summary?.pending ?? 0}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('operator.stats.pending' as any)}</div>
          </div>
          <div className="text-center px-4 border-l border-[var(--border)]">
            <div className="text-2xl font-black text-emerald-500">{summary?.resolved ?? 0}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('operator.stats.resolved' as any)}</div>
          </div>
          <div className="text-center px-4 border-l border-[var(--border)]">
            <div className="text-2xl font-black text-slate-500">{summary?.dismissed ?? 0}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t('operator.stats.dismissed' as any)}</div>
          </div>
        </div>
      </div>

      <OperatorSpeedDesk items={safeRows} onDismissAction={handleDismissAction} onResolveAction={handleResolveAction} />
    </div>
  );
}