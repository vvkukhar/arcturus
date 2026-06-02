'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Loader2, Gift, Tag, Zap, ShieldCheck, Check } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export default function RewardsShopPage() {
  const { data: rewards, isLoading, mutate } = useSWR<any>('/api/proxy/gamification/my-rewards', swrFetcher);
  const [buyingId, setBuyingId] = useState<number | null>(null);

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-purple-500" /></div>;
  if (!rewards) return <div className="flex h-screen items-center justify-center font-bold text-slate-500">Log in to view your rewards.</div>;

  const points = rewards.points || 0;
  const codes = rewards.promoCodes || [];

  const handleBuyDiscount = async (discountPercent: number) => {
    try {
      setBuyingId(discountPercent);
      await apiFetch('/api/proxy/gamification/buy-promo', {
        method: 'POST',
        body: JSON.stringify({ discountPercent })
      });
      toast.success('Промокод успішно придбано! Ви знайдете його внизу.');
      mutate();
    } catch (e: any) {
      toast.error(e.message || 'Не вдалося придбати знижку. Можливо не вистачає AC.');
    } finally {
      setBuyingId(null);
    }
  };

  const discountTiers = [
    { percent: 5, cost: 5000, color: 'from-blue-400 to-blue-600', shadow: 'shadow-blue-500/20' },
    { percent: 10, cost: 12000, color: 'from-purple-400 to-purple-600', shadow: 'shadow-purple-500/20' },
    { percent: 15, cost: 25000, color: 'from-orange-400 to-rose-600', shadow: 'shadow-orange-500/20' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 min-h-screen animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between bg-slate-900 dark:bg-black text-white p-8 md:p-12 rounded-[3rem] shadow-2xl mb-12 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Gift size={200} className="transform rotate-12" /></div>
        <div className="relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-white/20">
            <Zap size={14} className="text-amber-400" /> Exchange
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Rewards Shop</h1>
          <p className="text-slate-400 font-medium max-w-md">Обмінюйте Arcturus Credits (AC) на реальні знижки для ваших майбутніх покупок.</p>
        </div>
        <div className="relative z-10 mt-8 md:mt-0 bg-white/5 backdrop-blur-xl px-10 py-8 rounded-[2rem] border border-white/10 text-center shadow-2xl">
          <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-2">Ваш Баланс</div>
          <div className="text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-cyan-400">{points} <span className="text-xl text-slate-500">AC</span></div>
        </div>
      </div>

      <h2 className="text-2xl font-black text-[var(--foreground)] mb-8 flex items-center gap-3">
        <Tag className="text-blue-500" /> Доступні знижки
      </h2>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {discountTiers.map(tier => (
          <div key={tier.percent} className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] p-8 text-center shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
            <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${tier.color}`} />
            <div className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b ${tier.color} mb-4 mt-6 transform transition-transform group-hover:scale-110`}>
              -{tier.percent}%
            </div>
            <p className="text-slate-500 font-medium mb-8 text-sm px-4">Знижка на будь-яке замовлення в магазині Arcturus.</p>
            <div className="bg-[var(--background)] rounded-2xl py-4 mb-6 border border-[var(--border)]">
              <span className="text-2xl font-black font-mono text-[var(--foreground)]">{tier.cost} <span className="text-sm text-slate-400">AC</span></span>
            </div>
            <button 
              onClick={() => handleBuyDiscount(tier.percent)}
              disabled={points < tier.cost || buyingId !== null}
              className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 bg-gradient-to-r ${tier.color} ${tier.shadow}`}
            >
              {buyingId === tier.percent ? <Loader2 className="animate-spin mx-auto" /> : 'Придбати'}
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-black text-[var(--foreground)] mb-6 flex items-center gap-3">
        <ShieldCheck className="text-emerald-500" /> Ваші Активні Промокоди
      </h2>

      <div className="bg-[var(--card)] rounded-[2.5rem] border border-[var(--border)] shadow-sm p-8">
        {codes.length === 0 ? (
          <div className="text-center py-16 text-slate-400 font-bold border-2 border-dashed border-[var(--border)] rounded-3xl">
            <Gift className="mx-auto mb-4 opacity-50 w-12 h-12" />
            У вас ще немає невикористаних промокодів.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {codes.map((c: any) => (
              <div key={c.id} className="p-6 border border-emerald-200 dark:border-emerald-900/50 rounded-3xl bg-emerald-50 dark:bg-emerald-900/10 group relative overflow-hidden">
                <div className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 mb-2">Знижка {c.discountPercent}%</div>
                <div className="font-mono font-black text-2xl text-[var(--foreground)] tracking-widest mb-6">{c.code}</div>
                <button 
                  onClick={() => { navigator.clipboard.writeText(c.code); toast.success('Копійовано!'); }}
                  className="w-full py-3 bg-white dark:bg-black rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:scale-105 transition-transform shadow-sm border border-[var(--border)]"
                >
                  Копіювати
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}