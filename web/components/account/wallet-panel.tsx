'use client';

import { useState } from 'react';
import { TrendingUp, CreditCard, ArrowRight, Loader2 } from 'lucide-react';
import { formatMoney } from '@/lib/format';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

interface WalletPanelProps {
  finance: any;
  mutateFinance: () => void;
}

export function WalletPanel({ finance, mutateFinance }: WalletPanelProps) {
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutCard, setPayoutCard] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const handlePayoutRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRequesting) return;

    const amount = Number(payoutAmount);
    if (amount < 100) {
      toast.error('Мінімальна сума для виводу - 100 UAH');
      return;
    }

    try {
      setIsRequesting(true);
      await apiFetch('/api/proxy/marketplace/payout', {
        method: 'POST',
        body: JSON.stringify({ amount, cardData: payoutCard }),
      });
      toast.success('Запит на виплату успішно створено!');
      setPayoutAmount('');
      setPayoutCard('');
      mutateFinance();
    } catch (err: any) {
      toast.error(err.message || 'Помилка створення запиту');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <h2 className="text-2xl font-black mb-6">Фінанси та Виплати</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
          <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Доступно до виводу</div>
          <div className="text-4xl font-black text-emerald-400">{formatMoney(finance?.availableBalance || 0)}</div>
          <div className="mt-4 text-xs font-medium text-slate-400">В процесі виплати: {formatMoney(finance?.processingAmount || 0)}</div>
        </div>
        <div className="p-6 rounded-3xl bg-[var(--background)] border border-[var(--border)]">
          <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Всього зароблено</div>
          <div className="text-4xl font-black text-[var(--foreground)]">{formatMoney(finance?.totalEarned || 0)}</div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-500">
            <TrendingUp size={14} /> Тільки успішні угоди
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handlePayoutRequest} className="bg-[var(--background)] p-6 rounded-3xl border border-[var(--border)] space-y-5 h-fit">
          <h3 className="font-black text-lg">Замовити виплату</h3>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-2">Сума (UAH)</label>
            <input 
              required 
              type="number" 
              min="100" 
              max={finance?.availableBalance || 0}
              value={payoutAmount} 
              onChange={e => setPayoutAmount(e.target.value)}
              className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 block mb-2">Номер картки</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                required 
                type="text"
                value={payoutCard} 
                onChange={e => setPayoutCard(e.target.value)}
                className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 pl-12 font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                placeholder="0000 0000 0000 0000"
              />
            </div>
          </div>
          <button 
            type="submit" 
            disabled={isRequesting || !payoutAmount || Number(payoutAmount) > (finance?.availableBalance || 0)}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black rounded-xl transition-all flex justify-center items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-[0.98]"
          >
            {isRequesting ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            Вивести кошти
          </button>
        </form>

        <div>
          <h3 className="font-black text-lg mb-4">Історія виплат</h3>
          <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
            {finance?.payoutRequests?.length === 0 ? (
              <div className="text-sm font-medium text-slate-400 p-4 border-2 border-dashed border-[var(--border)] rounded-2xl text-center">
                Немає історії виплат.
              </div>
            ) : (
              finance?.payoutRequests?.map((req: any) => (
                <div key={req.id} className="flex items-center justify-between p-4 bg-[var(--background)] rounded-2xl border border-[var(--border)]">
                  <div>
                    <div className="font-black text-[var(--foreground)]">{formatMoney(req.amount)}</div>
                    <div className="text-xs font-mono text-slate-500 mt-1">{new Date(req.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div>
                    {req.status === 'pending' && <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-black uppercase">В обробці</span>}
                    {req.status === 'paid' && <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-black uppercase">Виплачено</span>}
                    {req.status === 'rejected' && <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-black uppercase">Відхилено</span>}
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