'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { SalesRegistrationPanel } from '@/components/admin/sales-registration-panel';
import { DataTable } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney, formatPercent } from '@/lib/format';
import { Loader2, Trash2, ReceiptText } from 'lucide-react';
import { getSocket } from '@/lib/socket';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export default function SalesPage() {
  const { data, isLoading, mutate } = useSWR<any[]>('/api/proxy/sales', swrFetcher);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const socket = getSocket();
    const handler = () => mutate();
    
    // Слухаємо глобальне оновлення дашборду (включає POS, Orders, Manual Sales)
    socket.on('dashboard_refresh', handler);
    
    return () => {
      socket.off('dashboard_refresh', handler);
    };
  }, [mutate]);

  const rows = Array.isArray(data) ? data : [];

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити цей продаж? Це скасує прибуток і поверне товар на склад.')) return;
    setLoadingId(id);
    try {
      await apiFetch('/api/proxy/sales', {
        method: 'DELETE',
        body: JSON.stringify({ id })
      });
      toast.success('Продаж успішно скасовано. Товар повернено в інвентар.');
      mutate();
    } catch (e: any) {
      toast.error(e.message || 'Помилка скасування продажу');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 hardware-accelerated">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20 text-white">
          <ReceiptText size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Sales Record</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">Реєстр всіх транзакцій, доходів та прибутків фонду.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <SalesRegistrationPanel />
        </div>
        
        <div className="xl:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-6 md:p-8 shadow-sm overflow-hidden flex flex-col">
          <h2 className="text-xl font-black mb-6 text-[var(--foreground)]">Історія транзакцій</h2>
          
          <div className="flex-1 overflow-x-auto custom-scrollbar">
            {isLoading ? (
               <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-emerald-500 w-10 h-10" /></div>
            ) : (
              <DataTable
                rows={rows}
                emptyText="Ще немає жодного продажу."
                getRowKey={(row) => row.id}
                columns={[
                  {
                    key: 'item',
                    header: 'Актив',
                    render: (row) => (
                      <div className="flex flex-col max-w-[200px]">
                        <span className="font-bold text-[var(--foreground)] truncate">{row.inventoryItem?.titleSnapshot || row.itemId}</span>
                        <span className="text-[10px] font-mono font-black text-slate-400 mt-1 uppercase tracking-widest">ID: {row.id.slice(-8)}</span>
                      </div>
                    )
                  },
                  {
                    key: 'channel',
                    header: 'Канал',
                    render: (row) => <StatusPill value={row.channel} />
                  },
                  {
                    key: 'price',
                    header: 'Ціна / Собівартість',
                    render: (row) => (
                      <div className="flex flex-col">
                        <span className="font-black text-[var(--foreground)] text-base">{formatMoney(row.sellPrice)}</span>
                        <span className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest">Соб: {formatMoney(row.costBasis)}</span>
                      </div>
                    )
                  },
                  {
                    key: 'profit',
                    header: 'Чистий Прибуток',
                    render: (row) => (
                      <div className="flex flex-col items-start">
                        <span className="font-black text-emerald-500 text-base">+{formatMoney(row.profit)}</span>
                        <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md mt-1 tracking-widest">
                          {formatPercent(row.roiPercent)}
                        </span>
                      </div>
                    )
                  },
                  {
                    key: 'date',
                    header: 'Дата',
                    render: (row) => <span className="text-xs font-bold text-slate-500">{new Date(row.createdAt).toLocaleDateString('uk-UA')}</span>
                  },
                  {
                    key: 'actions',
                    header: '',
                    render: (row) => (
                      <button 
                        onClick={() => handleDelete(row.id)}
                        disabled={loadingId === row.id}
                        className="p-2.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors disabled:opacity-50"
                        title="Скасувати продаж"
                      >
                        {loadingId === row.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    )
                  }
                ]}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}