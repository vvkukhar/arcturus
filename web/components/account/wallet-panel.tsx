'use client';

import { TrendingUp, Loader2 } from 'lucide-react';
import { formatMoney } from '@/lib/format';

interface WalletPanelProps {
  finance: any;
  mutateFinance: () => void;
  isLoading?: boolean;
}

export function WalletPanel({ finance, isLoading }: WalletPanelProps) {
  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500 w-8 h-8" /></div>;
  }

  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-2xl font-black mb-6">Мій Баланс (Маркетплейс)</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
          <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Зароблено з продажів</div>
          <div className="text-4xl font-black text-emerald-400">{formatMoney(finance?.availableBalance || 0)}</div>
          <div className="mt-4 text-xs font-medium text-slate-400">В процесі обробки: {formatMoney(finance?.processingAmount || 0)}</div>
        </div>
        <div className="p-6 rounded-3xl bg-[var(--background)] border border-[var(--border)]">
          <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Всього (За весь час)</div>
          <div className="text-4xl font-black text-[var(--foreground)]">{formatMoney(finance?.totalEarned || 0)}</div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-500">
            <TrendingUp size={14} /> Тільки успішні угоди
          </div>
        </div>
      </div>

      {finance?.payoutRequests?.length > 0 && (
        <div>
          <h3 className="font-black text-lg mb-4">Історія транзакцій</h3>
          <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {finance.payoutRequests.map((req: any) => (
              <div key={req.id} className="flex items-center justify-between p-4 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
                <div>
                  <div className="font-black text-[var(--foreground)]">{formatMoney(req.amount)}</div>
                  <div className="text-xs font-mono text-slate-500 mt-1">{new Date(req.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider">
                    {req.adminNote || 'Оброблено системою'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}