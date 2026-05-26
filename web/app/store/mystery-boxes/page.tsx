'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney } from '@/lib/format';
import { Gift, Sparkles, Loader2, LockKeyhole, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function MysteryBoxesPage() {
  const router = useRouter();
  const { data: boxes, isLoading } = useSWR<any[]>('/api/proxy/monetization/mystery-boxes', swrFetcher, { refreshInterval: 15000 });
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const safeBoxes = Array.isArray(boxes) ? boxes : [];

  const handleBuy = async (boxId: string, price: number) => {
    try {
      setBuyingId(boxId);
      
      const res = await apiFetch<any>(`/api/proxy/monetization/mystery-boxes/${boxId}/buy`, {
        method: 'POST'
      });

      if (res.order) {
        const checkoutResponse = await apiFetch<any>('/api/store/checkout', {
          method: 'POST',
          body: JSON.stringify({ orderId: res.order.id }),
        });
        
        if (checkoutResponse?.url) {
          window.location.href = checkoutResponse.url;
        } else {
          router.push(`/success?orderId=${res.order.id}`);
        }
      }
    } catch (e: any) {
      alert(e.message || 'Не вдалося придбати бокс. Можливо ви не авторизовані або бокс вже забрали.');
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in duration-500 min-h-screen">
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="inline-flex items-center justify-center p-4 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-2xl mb-6 shadow-xl shadow-purple-500/20 relative z-10">
          <Gift size={48} className="animate-pulse" />
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-[var(--foreground)] mb-6 tracking-tight relative z-10">
          Collector's <span className="bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">Mystery Box</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto relative z-10">
          Гарантована цінність наборів всередині завжди перевищує вартість боксу. Раритетні та зняті з виробництва набори в кожній коробці. Кількість жорстко обмежена.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-purple-500 w-12 h-12" />
        </div>
      ) : safeBoxes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-[var(--border)] bg-[var(--card)] py-32 text-center shadow-sm">
          <LockKeyhole className="w-16 h-16 text-slate-300 mb-6" />
          <h3 className="text-3xl font-black text-[var(--foreground)] mb-2">Всі бокси розпродано</h3>
          <p className="text-lg font-medium text-slate-500">Алгоритми формують нові пули. Повертайтесь згодом.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {safeBoxes.map((box) => (
            <div key={box.id} className="relative group rounded-[3rem] border border-[var(--border)] bg-[var(--card)] p-8 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/50 transition-all duration-500 transform-gpu hover:-translate-y-2">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Gift size={150} />
              </div>

              <div className="relative z-10">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest mb-6 border ${box.tier === 'diamond' ? 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  <Sparkles size={14} /> {box.tier} TIER
                </div>
                
                <h3 className="text-2xl font-black leading-tight text-[var(--foreground)] mb-4">{box.title}</h3>
                <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed line-clamp-3">
                  {box.description}
                </p>

                <div className="bg-[var(--background)] rounded-2xl p-5 border border-[var(--border)] mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">Вартість</span>
                    <span className="text-3xl font-black text-[var(--foreground)]">{formatMoney(box.price)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[var(--border)]">
                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><ShieldCheck size={14}/> Гарантована цінність ринку:</span>
                    <span className="text-sm font-black text-emerald-500">> {formatMoney(box.price * 1.3)}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBuy(box.id, box.price)}
                  disabled={buyingId !== null}
                  className="w-full py-4 bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-black rounded-2xl transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-xl"
                >
                  {buyingId === box.id ? <Loader2 className="animate-spin" /> : <Gift size={20} />}
                  Забрати Бокс
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}