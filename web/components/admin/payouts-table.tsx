'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/admin/data-table';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import { Loader2, CheckCircle2, CreditCard, User } from 'lucide-react';

export function PayoutsTable({ rows }: { rows: any[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleMarkPaid = async (id: string) => {
    if (!confirm('Ви підтверджуєте, що переказали кошти на вказану картку користувача?')) return;
    try {
      setLoadingId(id);
      await apiFetch(`/api/proxy/sales/payouts/${id}/pay`, { method: 'PATCH' });
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Не вдалося закрити платіжний ордер');
    } finally {
      setLoadingId(null);
    }
  };

  const formatCardNumber = (card: string) => {
    if (!card) return '—';
    const clean = card.replace(/\s/g, '');
    return clean.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
  };

  return (
    <DataTable
      rows={rows}
      emptyText="Немає активних запитів на виплату коштів від селерів."
      getRowKey={(row) => row.id}
      columns={[
        {
          key: 'id',
          header: 'ID Ордера',
          render: (row) => (
            <div className="flex flex-col">
              <span className="font-mono text-xs font-black text-slate-500 uppercase tracking-wider">#{row.id.slice(-8)}</span>
              <span className="text-[10px] font-bold text-slate-400 mt-0.5">Створено: {new Date(row.createdAt).toLocaleDateString('uk-UA')}</span>
            </div>
          ),
        },
        {
          key: 'seller',
          header: 'Користувач / Селер',
          render: (row) => (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                <User size={16} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-[var(--foreground)]">{row.seller?.name || 'Анонімний Користувач'}</span>
                <span className="text-xs font-medium text-slate-400">{row.seller?.email || 'Не вказано email'}</span>
              </div>
            </div>
          ),
        },
        {
          key: 'cardData',
          header: 'Реквізити для виплати',
          render: (row) => (
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono font-bold text-sm bg-[var(--background)] px-3 py-1.5 rounded-xl border border-[var(--border)] w-fit">
              <CreditCard size={14} className="text-blue-500" />
              {formatCardNumber(row.cardData)}
            </div>
          ),
        },
        {
          key: 'amount',
          header: 'Сума до виплати',
          render: (row) => (
            <span className="font-black text-rose-600 dark:text-rose-400 text-base">
              {formatMoney(row.amount)}
            </span>
          ),
        },
        {
          key: 'actions',
          header: '',
          render: (row) => (
            <div className="flex justify-end">
              <Button 
                onClick={() => handleMarkPaid(row.id)} 
                disabled={loadingId !== null}
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 h-10 px-4 rounded-xl shadow-md shadow-emerald-600/10"
              >
                {loadingId === row.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                Підтвердити Переказ
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
}