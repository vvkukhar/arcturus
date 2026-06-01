'use client';

import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Target, Link as LinkIcon, Loader2, DollarSign, Crosshair, Trophy, Flame } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney } from '@/lib/format';

export default function ScoutPage() {
  const { data: user, isLoading: uLoading } = useSWR<any>('/api/auth/me', swrFetcher);
  const { data: leads, mutate } = useSWR<any[]>('/api/proxy/marketplace/scout/my-leads', swrFetcher);
  const { data: surges } = useSWR<any[]>('/api/proxy/marketplace/scout/active-surges', swrFetcher);

  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const safeSurges = Array.isArray(surges) ? surges : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Авторизуйтесь, щоб відправляти знахідки.');
      return;
    }
    setLoading(true);
    try {
      await apiFetch('/api/proxy/marketplace/scout/submit', {
        method: 'POST',
        body: JSON.stringify({ url, notes }),
      });
      toast.success('Ціль захоплено! Дякуємо.');
      setUrl('');
      setNotes('');
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'Помилка');
    } finally {
      setLoading(false);
    }
  };

  const totalEarned = (leads || []).filter(l => l.status === 'bought' || l.status === 'paid').reduce((acc, curr) => acc + (curr.reward || 0), 0);

  return (
    <main className="min-h-screen py-16 px-4 bg-[var(--background)]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
          <div className="absolute right-0 top-0 hidden md:block">
            <Link href="/scout/leaderboard" className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-xl font-black text-sm hover:scale-105 transition-transform border border-amber-200 dark:border-amber-800">
              <Trophy size={16} /> Зал Слави
            </Link>
          </div>

          <div className="inline-flex items-center justify-center p-4 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-2xl mb-6">
            <Target size={40} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[var(--foreground)] mb-4 tracking-tight">Arcturus Bounty</h1>
          <p className="text-lg text-slate-500 font-medium">Знаходьте недооцінені набори LEGO на маркетплейсах. Ми викупуємо їх — ви отримуєте % на свій баланс.</p>
          
          <div className="mt-6 md:hidden flex justify-center">
            <Link href="/scout/leaderboard" className="flex items-center gap-2 px-6 py-3 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-xl font-black text-sm hover:scale-105 transition-transform">
              <Trophy size={18} /> Відкрити Зал Слави
            </Link>
          </div>
        </div>

        {safeSurges.length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 p-6 rounded-[2rem] animate-in fade-in slide-in-from-bottom-4 shadow-sm">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-black uppercase tracking-widest mb-4">
              <Flame size={20} className="animate-pulse" /> Гарячий попит (Surge Multiplier)
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {safeSurges.map(surge => (
                <div key={surge.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-red-100 dark:border-red-900 flex justify-between items-center">
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{surge.reason}</div>
                  <div className="text-lg font-black text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-3 py-1 rounded-lg">x{surge.multiplier.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="md:col-span-2 bg-[var(--card)] p-8 rounded-[2.5rem] border border-[var(--border)] shadow-xl">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><Crosshair className="text-orange-500"/> Додати Ціль</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1 mb-2 block">Посилання на товар (OLX, Шафа, тощо)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required type="url" value={url} onChange={e => setUrl(e.target.value)}
                    placeholder="https://www.olx.ua/d/uk/obyavlenie/..."
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-4 pl-12 font-bold text-[var(--foreground)] focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-500 tracking-widest ml-1 mb-2 block">Коментар (Необов'язково)</label>
                <textarea 
                  value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Наприклад: Продавець готовий віддати за 1500 грн якщо забрати сьогодні."
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 font-medium text-[var(--foreground)] focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                  rows={2}
                />
              </div>
              <button disabled={loading} type="submit" className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin" /> : <Target size={20} />} Відправити аналітикам
              </button>
            </form>
          </div>

          <div className="bg-slate-900 dark:bg-black text-white p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-center text-center border border-slate-800">
            <DollarSign size={48} className="text-emerald-400 mx-auto mb-4" />
            <div className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Ваш заробіток</div>
            <div className="text-5xl font-black text-emerald-400">{formatMoney(totalEarned)}</div>
            <p className="mt-4 text-sm text-slate-400 font-medium">Кошти доступні до виводу у вашому Гаманці.</p>
          </div>
        </div>

      </div>
    </main>
  );
}