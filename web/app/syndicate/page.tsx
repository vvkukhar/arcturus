'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Network, Users, Loader2, Copy, Check, Zap, Target } from 'lucide-react';
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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in duration-700 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 border-b border-[var(--border)] pb-8">
        <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-xl shadow-emerald-500/20">
          <Network size={36} />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--foreground)] mb-2">The Syndicate</h1>
          <p className="text-lg font-medium text-slate-500 max-w-2xl">Будуйте власну мережу партнерів. Залучайте інвесторів та скаутів, щоб отримувати пасивний дохід у вигляді Arcturus Credits (AC).</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-[var(--card)] p-8 md:p-10 rounded-[3rem] border border-[var(--border)] shadow-xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Zap size={100}/></div>
          <div className="relative z-10">
            <div className="text-xs font-black uppercase text-emerald-500 tracking-widest mb-3 flex items-center gap-2"><Zap size={16}/> Мережевий Дохід</div>
            <div className="text-5xl md:text-6xl font-black text-[var(--foreground)] font-mono tracking-tighter">
              {dash.totalEarnedAC} <span className="text-2xl text-slate-400">AC</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--card)] p-8 md:p-10 rounded-[3rem] border border-[var(--border)] shadow-xl flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Users size={100}/></div>
          <div className="relative z-10">
            <div className="text-xs font-black uppercase text-blue-500 tracking-widest mb-3 flex items-center gap-2"><Users size={16}/> Розмір Мережі</div>
            <div className="text-5xl md:text-6xl font-black text-[var(--foreground)] font-mono tracking-tighter">
              {dash.referralsCount} <span className="text-2xl text-slate-400">партнерів</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 dark:bg-black text-white rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden mb-16 border border-slate-800">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/20 rounded-full text-xs font-black text-emerald-400 uppercase tracking-widest mb-6 border border-emerald-500/30">
            <Target size={14} /> Referral Link
          </div>
          <h2 className="text-3xl font-black mb-8">Ваш інструмент рекрутингу</h2>
          
          {dash.referralCode ? (
            <div className="flex flex-col sm:flex-row gap-4 max-w-3xl">
              <div className="flex-1 bg-black/50 border border-slate-700 rounded-2xl p-5 flex items-center justify-between shadow-inner">
                <span className="font-mono text-emerald-400 font-bold truncate text-lg">arcturus.store/register?ref={dash.referralCode}</span>
              </div>
              <button 
                onClick={copyToClipboard} 
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-transform active:scale-95 text-lg"
              >
                {copied ? <Check size={24} /> : <Copy size={24} />} {copied ? 'Скопійовано' : 'Копіювати'}
              </button>
            </div>
          ) : (
            <button 
              onClick={handleGenerate} 
              disabled={loading} 
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-xl shadow-blue-600/30 text-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Network />} Згенерувати Лінк
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-black mb-8 px-2">Історія Транзакцій Мережі</h3>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[3rem] overflow-hidden shadow-sm p-4">
          {dash.rewards.length === 0 ? (
            <div className="py-24 text-center text-slate-400 font-bold border-2 border-dashed border-[var(--border)] m-4 rounded-[2rem]">
              <Network className="mx-auto w-12 h-12 mb-4 opacity-30" />
              Нарахувань ще не було. Запросіть першого партнера!
            </div>
          ) : (
            <div className="divide-y divide-[var(--border)]">
              {dash.rewards.map((r: any) => (
                <div key={r.id} className="p-6 flex items-center justify-between hover:bg-[var(--background)]/50 transition-colors rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <Zap size={20} />
                    </div>
                    <div>
                      <div className="font-black text-[var(--foreground)] text-lg">+{r.amount} AC</div>
                      <div className="text-sm font-medium text-slate-500 mt-1">{r.sourceType === 'marketplace_fee' ? 'Комісія з продажу реферала' : 'Дивіденди інвестора Vault'}</div>
                    </div>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
                    {new Date(r.createdAt).toLocaleDateString('uk-UA')}
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