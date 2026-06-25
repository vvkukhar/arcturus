'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Target, Loader2, ExternalLink, Check, XCircle, DollarSign } from 'lucide-react';
import { swrFetcher } from '@/lib/swr-fetcher';
import { apiFetch } from '@/lib/api';
import { DataTable } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney } from '@/lib/format';
import { useI18n } from '@/components/providers/i18n-provider';

export default function AdminScoutLeadsPage() {
  const { t } = useI18n();
  const { data: rawLeads, isLoading, mutate } = useSWR<any[]>('/api/proxy/scout/leads', swrFetcher);
  const leads = Array.isArray(rawLeads) ? rawLeads : [];
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleReward = async (id: string) => {
    const amountStr = prompt('Введіть суму нагороди для скаута (в гривнях):', '100');
    if (!amountStr) return;
    
    const amount = Number(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Невалідна сума.');
      return;
    }

    try {
      setLoadingId(`reward-${id}`);
      await apiFetch(`/api/proxy/scout/reward/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ rewardAmount: amount }),
      });
      mutate();
    } catch (err: any) {
      alert(err.message || 'Не вдалося нарахувати нагороду');
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Введіть причину відмови (оцпіонально):');
    if (reason === null) return;

    try {
      setLoadingId(`reject-${id}`);
      await apiFetch(`/api/proxy/scout/reject/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ adminNote: reason }),
      });
      mutate();
    } catch (err: any) {
      alert(err.message || 'Не вдалося відхилити лід');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 hardware-accelerated pb-10">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
          <Target size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Ліди від Скаутів</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Перевірка знахідок користувачів та нарахування AC нагород.</p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden p-6">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500 w-8 h-8" /></div>
        ) : (
          <DataTable
            rows={leads}
            emptyText={t('scout.empty' as any)}
            getRowKey={(row) => row.id}
            columns={[
              {
                key: 'date',
                header: 'Дата',
                render: (row) => (
                  <span className="text-xs font-mono text-slate-500">
                    {new Date(row.createdAt).toLocaleDateString('uk-UA')}
                  </span>
                ),
              },
              {
                key: 'scout',
                header: 'Скаут',
                render: (row) => (
                  <div className="flex flex-col">
                    <span className="font-bold text-[var(--foreground)]">{row.scout?.name || 'Unknown'}</span>
                    <span className="text-xs text-slate-500">{row.scout?.email || 'No email'}</span>
                  </div>
                ),
              },
              {
                key: 'link',
                header: 'Знахідка (URL)',
                render: (row) => (
                  <div className="flex flex-col gap-1 max-w-[250px]">
                    <a href={row.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline truncate">
                      Перейти <ExternalLink size={12} />
                    </a>
                    <span className="text-xs text-slate-500 truncate" title={row.notes}>{row.notes || 'Без коментарів'}</span>
                  </div>
                ),
              },
              {
                key: 'status',
                header: 'Статус',
                render: (row) => <StatusPill value={row.status} />,
              },
              {
                key: 'reward',
                header: 'Нагорода',
                render: (row) => (
                  <span className={`font-black ${row.reward > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                    {row.reward > 0 ? formatMoney(row.reward) : '—'}
                  </span>
                ),
              },
              {
                key: 'actions',
                header: 'Дії',
                render: (row) => (
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleReward(row.id)}
                      disabled={loadingId !== null || row.status === 'bought' || row.status === 'rejected'}
                      className="flex items-center gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50 px-3 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {loadingId === `reward-${row.id}` ? <Loader2 size={14} className="animate-spin" /> : <DollarSign size={14} />}
                      Reward
                    </button>
                    <button
                      onClick={() => handleReject(row.id)}
                      disabled={loadingId !== null || row.status === 'bought' || row.status === 'rejected'}
                      className="flex items-center gap-1 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 px-3 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      {loadingId === `reject-${row.id}` ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                      Reject
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>
    </div>
  );
}