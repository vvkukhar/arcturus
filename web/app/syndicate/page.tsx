'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Network, Users, DollarSign, Loader2, Copy, Check, Zap } from 'lucide-react';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export default function SyndicatePage() {
  const { data: dash, isLoading, mutate } = useSWR<any>('/api/proxy/syndicate/dashboard', swrFetcher);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      await apiFetch('/api/proxy/syndicate/code/generate', { method: 'POST' });
      toast.success('Промокод згенеровано!');
      mutate();
    } catch (e: any) {
      toast.error(e.message || 'Помилка генерації');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (dash?.referralCode) {
      navigator.clipboard.writeText(`https://arcturus.store/register?ref=${dash.referralCode}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;

  if (!dash) return <div className="flex h-screen items-center justify-center font-bold text-slate-500">Авторизуйтесь для доступу до The Syndicate.</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in duration-500 min-h-screen">
      <div className="flex items-center gap-4 mb-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/20 border border-slate-800">
          <Network size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)]">The Syndicate</h1>
          <p className="font-medium text-slate-500 mt-1">Будуй мережу партнерів та заробляй Arcturus Credits пасивно.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-[var(--card)] p-8 rounded-[2rem] border border-[var(--border)] shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 flex items-center gap-2"><Zap size={14}/> Всього Зароблено з Мережі</div>
            <div className="text-4xl font-black text-emerald-500">{dash.totalEarnedAC} <span className="text-lg">AC</span></div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-2 flex items-center gap-2 justify-end"><Users size={14}/> Реферали</div>
            <div className="text-4xl font-black text-blue-600">{dash.referralsCount}</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden mb-10 border border-slate-800">
        <div className="absolute top-0 right-0 p-10 opacity-5"><Network size={150} /></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-black mb-4">Ваш Реферальний Лінк</h2>
          
          {dash.referralCode ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-black border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                <span className="font-mono text-emerald-400 font-bold truncate">https://arcturus.store/register?ref={dash.referralCode}</span>
              </div>
              <button onClick={copyToClipboard} className="bg-emerald-500 hover:bg-emerald-600 text-slate-900 px-8 rounded-xl font-black flex items-center justify-center gap-2 transition-transform active:scale-95 py-4 sm:py-0">
                {copied ? <Check size={20} /> : <Copy size={20} />} {copied ? 'Скопійовано' : 'Копіювати'}
              </button>
            </div>
          ) : (
            <button onClick={handleGenerate} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-blue-500/20">
              {loading ? <Loader2 className="animate-spin" /> : <Network />} Згенерувати Лінк
            </button>
          )}

          <p className="mt-6 text-sm font-medium text-slate-400 max-w-xl">
            Поширюйте цей лінк. Коли людина зареєструється за ним і почне продавати товари через наш маркетплейс або інвестувати у Vault — ви автоматично отримуватимете AC на свій баланс назавжди.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-black mb-6">Історія Нарахувань Мережі</h3>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] overflow-hidden shadow-sm">
          {dash.rewards.length === 0 ? (
            <div className="p-10 text-center text-slate-500 font-medium border-2 border-dashed border-[var(--border)] m-4 rounded-2xl">
              Нарахувань ще не було. Запросіть першого партнера!
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {dash.rewards.map((r: any) => (
                <div key={r.id} className="p-4 flex items-center justify-between hover:bg-[var(--background)]/50 transition-colors">
                  <div>
                    <div className="font-black text-emerald-500">+{r.amount} AC</div>
                    <div className="text-xs text-slate-500 mt-1">{r.sourceType === 'marketplace_fee' ? 'З продажу реферала' : 'З прибутку інвестора Vault'}</div>
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}