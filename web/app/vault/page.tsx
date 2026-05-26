'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Vault, TrendingUp, PiggyBank, ArrowRight, Loader2 } from 'lucide-react';
import { formatMoney } from '@/lib/format';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export default function VaultPage() {
  const { data: balance, mutate: mutateBalance } = useSWR('/api/proxy/vault/balance', swrFetcher);
  const { data: portfolio, mutate: mutatePortfolio } = useSWR<any[]>('/api/proxy/vault/portfolio', swrFetcher);
  const { data: deals } = useSWR<any[]>('/api/proxy/pro/deals', swrFetcher, { refreshInterval: 15000 });
  
  const [depositAmount, setDepositAmount] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const safePortfolio = Array.isArray(portfolio) ? portfolio : [];
  const safeDeals = Array.isArray(deals) ? deals : [];

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loadingId) return;
    try {
      setLoadingId('deposit');
      const data = await apiFetch<any>('/api/proxy/vault/deposit', {
        method: 'POST',
        body: JSON.stringify({ amount: Number(depositAmount) }),
      });
      if (data.url) window.location.href = data.url;
    } catch (e: any) {
      toast.error(e.message || 'Deposit failed');
    } finally {
      setLoadingId(null);
    }
  };

  const handleInvest = async (dealId: string) => {
    if (loadingId) return;
    try {
      setLoadingId(dealId);
      await apiFetch('/api/proxy/vault/invest', {
        method: 'POST',
        body: JSON.stringify({ dealId }),
      });
      toast.success('Successfully funded the deal!');
      mutateBalance();
      mutatePortfolio();
    } catch (e: any) {
      toast.error(e.message || 'Investment failed');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in duration-500 min-h-screen">
      <div className="flex items-center gap-4 mb-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 shadow-lg">
          <Vault size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)]">Arcturus Vault</h1>
          <p className="font-medium text-slate-500 mt-1">Автоматичне управління капіталом. Інвестуйте в LEGO пасивно.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-[var(--card)] p-8 rounded-[2rem] border border-[var(--border)] shadow-sm">
          <h2 className="text-2xl font-black mb-6">Ваш Баланс</h2>
          <div className="text-6xl font-black text-emerald-500 mb-8">{formatMoney(Number(balance || 0))}</div>
          
          <form onSubmit={handleDeposit} className="flex gap-4">
            <input 
              type="number" 
              required
              min="1000"
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value)}
              placeholder="Сума поповнення (мін 1000 ₴)"
              className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-xl px-5 py-4 font-bold outline-none focus:border-amber-500"
            />
            <button 
              type="submit"
              disabled={loadingId === 'deposit' || !depositAmount}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              {loadingId === 'deposit' ? <Loader2 className="animate-spin" /> : <PiggyBank />} Поповнити
            </button>
          </form>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl flex flex-col justify-center">
          <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Активні інвестиції</div>
          <div className="text-4xl font-black mb-4">{safePortfolio.length} наборів</div>
          <div className="text-sm font-medium text-slate-300">Ваш капітал працює. Коли ми продамо ці набори, ви отримаєте вкладене тіло + 80% чистого прибутку на баланс Vault.</div>
        </div>
      </div>

      <h2 className="text-2xl font-black mb-6">Відкриті угоди для фондування</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {safeDeals.map(deal => (
          <div key={deal.id} className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="font-bold text-lg leading-tight line-clamp-2 mb-4">{deal.title}</div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <div className="text-[10px] font-black uppercase text-slate-500">Потрібно капіталу</div>
                <div className="text-xl font-black">{formatMoney(deal.buyPrice)}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black uppercase text-emerald-500">Очікуваний Прибуток</div>
                <div className="text-xl font-black text-emerald-600">+{formatMoney(deal.profit)}</div>
              </div>
            </div>
            <button 
              onClick={() => handleInvest(deal.id)}
              disabled={loadingId === deal.id || Number(balance || 0) < deal.buyPrice}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loadingId === deal.id ? <Loader2 className="animate-spin" /> : <TrendingUp size={18} />} 
              Фондувати угоду
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}