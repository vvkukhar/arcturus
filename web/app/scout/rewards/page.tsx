'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Loader2, Gift, Tag, Zap, Crown, ShieldCheck } from 'lucide-react';
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
    { percent: 5, cost: 5000, color: 'bg-blue-500', text: 'text-blue-500' },
    { percent: 10, cost: 12000, color: 'bg-purple-500', text: 'text-purple-500' },
    { percent: 15, cost: 25000, color: 'bg-orange-500', text: 'text-orange-500' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
      <div className="flex flex-col md:flex-row items-center justify-between bg-slate-900 dark:bg-black text-white p-8 rounded-[3rem] shadow-2xl mb-12 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none"><Gift size={150} /></div>
        <div className="relative z-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Rewards Shop</h1>
          <p className="text-slate-400 font-medium">Обмінюйте ваші Arcturus Credits (AC) на знижки та ексклюзиви.</p>
        </div>
        <div className="relative z-10 mt-6 md:mt-0 bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/20 text-center">
          <div className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-1">Ваш Баланс</div>
          <div className="text-4xl font-black">{points} AC</div>
        </div>
      </div>

      <h2 className="text-2xl font-black text-[var(--foreground)] mb-6 flex items-center gap-2">
        <Tag className="text-blue-500" /> Промокоди на знижку
      </h2>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {discountTiers.map(tier => (
          <div key={tier.percent} className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-6 text-center shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-2 ${tier.color}`} />
            <div className={`text-5xl font-black ${tier.text} mb-2 mt-4`}>-{tier.percent}%</div>
            <p className="text-slate-500 font-medium mb-6">Знижка на будь-яке замовлення в магазині Arcturus.</p>
            <div className="bg-[var(--background)] rounded-xl py-3 mb-6 border border-[var(--border)]">
              <span className="text-xl font-black text-[var(--foreground)]">{tier.cost} AC</span>
            </div>
            <button 
              onClick={() => handleBuyDiscount(tier.percent)}
              disabled={points < tier.cost || buyingId !== null}
              className={`w-full py-4 rounded-xl font-black text-white shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 ${tier.color}`}
            >
              {buyingId === tier.percent ? <Loader2 className="animate-spin mx-auto" /> : 'Придбати код'}
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-black text-[var(--foreground)] mb-6 flex items-center gap-2">
        <ShieldCheck className="text-emerald-500" /> Ваші Активні Промокоди
      </h2>

      <div className="bg-[var(--card)] rounded-[2rem] border border-[var(--border)] shadow-sm p-6">
        {codes.length === 0 ? (
          <div className="text-center py-10 text-slate-500 font-bold border-2 border-dashed border-[var(--border)] rounded-2xl">
            У вас ще немає невикористаних промокодів.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {codes.map((c: any) => (
              <div key={c.id} className="flex justify-between items-center p-4 border border-[var(--border)] rounded-2xl bg-[var(--background)] group relative overflow-hidden">
                <div className="relative z-10">
                  <div className="text-xs font-black uppercase text-emerald-500 mb-1">Знижка {c.discountPercent}%</div>
                  <div className="font-mono font-black text-lg text-[var(--foreground)] tracking-wider">{c.code}</div>
                </div>
                <button 
                  onClick={() => { navigator.clipboard.writeText(c.code); toast.success('Копійовано!'); }}
                  className="relative z-10 px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
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