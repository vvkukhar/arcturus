'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Crown, Zap, BarChart2, ShieldCheck, ArrowRight, Loader2, Lock, Terminal, Vault } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ArcturusProPage() {
  const { data: user, isLoading } = useSWR('/api/auth/me', swrFetcher as any);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const data = await apiFetch<any>('/api/proxy/pro/subscribe', { method: 'POST' });
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (e: any) {
      toast.error(e.message || 'Помилка генерації платежу');
      setLoading(false);
    }
  };

  const handleGenApiKey = async () => {
    toast.info('Генерація ключів доступна тільки в налаштуваннях профілю.');
  };

  return (
    <main className="min-h-screen py-16 md:py-24 px-4 bg-[var(--background)] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 rounded-[100%] blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center justify-center p-3 px-5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full mb-8 font-black uppercase tracking-widest text-sm border border-indigo-200 dark:border-indigo-800">
          <Crown size={16} className="mr-2" /> Доступ для Інвесторів
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-[var(--foreground)] mb-6 tracking-tight leading-tight">
          Arcturus <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">Ecosystem</span>
        </h1>
        
        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mb-16">
          Від інституційної аналітики до алгоритмічного управління капіталом. Оберіть свій рівень доступу.
        </p>

        <div className="grid lg:grid-cols-3 gap-8 text-left mb-16">
          
          {/* TIER 1: PRO APP */}
          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-xl relative flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-black mb-2">Arcturus PRO</h3>
              <p className="text-slate-500 font-medium h-12">Доступ до дашборду, скрінера та графіків ліквідності.</p>
            </div>
            <div className="text-4xl font-black mb-6">500 <span className="text-lg text-slate-400">грн/міс</span></div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 font-medium"><Zap size={16} className="text-emerald-500"/> Live Screener</li>
              <li className="flex items-center gap-2 font-medium"><BarChart2 size={16} className="text-emerald-500"/> Orderbook Data</li>
              <li className="flex items-center gap-2 font-medium"><ShieldCheck size={16} className="text-emerald-500"/> Valuation Models</li>
            </ul>
            <button onClick={handleSubscribe} disabled={loading} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:scale-[1.02] transition-transform">
              Оформити підписку
            </button>
          </div>

          {/* TIER 2: VAULT (INVEST) */}
          <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-2xl relative flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 right-0 p-6 opacity-10"><Vault size={100} /></div>
            <div className="mb-6 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-xs font-black uppercase tracking-widest mb-4">Passive Income</div>
              <h3 className="text-2xl font-black mb-2">Arcturus Vault</h3>
              <p className="text-slate-400 font-medium h-12">Автоматичне управління вашим капіталом нашими ботами.</p>
            </div>
            <div className="text-4xl font-black mb-6">20% <span className="text-lg text-slate-400">Success Fee</span></div>
            <ul className="space-y-3 mb-8 flex-1 relative z-10">
              <li className="flex items-center gap-2 font-medium"><Zap size={16} className="text-amber-400"/> Авто-викуп угод ботами</li>
              <li className="flex items-center gap-2 font-medium"><BarChart2 size={16} className="text-amber-400"/> Фізичне зберігання на складі</li>
              <li className="flex items-center gap-2 font-medium"><ShieldCheck size={16} className="text-amber-400"/> 80% чистого прибутку вам</li>
            </ul>
            <Link href="/vault" className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black rounded-xl text-center hover:scale-[1.02] transition-transform shadow-lg shadow-amber-500/20">
              Відкрити Vault
            </Link>
          </div>

          {/* TIER 3: B2B API */}
          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-xl relative flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-black mb-2">B2B API Access</h3>
              <p className="text-slate-500 font-medium h-12">Сирі дані (JSON) для підключення власних ботів.</p>
            </div>
            <div className="text-4xl font-black mb-6">$150 <span className="text-lg text-slate-400">/mo</span></div>
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 font-medium"><Terminal size={16} className="text-blue-500"/> REST API endpoints</li>
              <li className="flex items-center gap-2 font-medium"><Zap size={16} className="text-blue-500"/> 15m Delayed Deal Feed</li>
              <li className="flex items-center gap-2 font-medium"><ShieldCheck size={16} className="text-blue-500"/> Comps & Valuation API</li>
            </ul>
            <button onClick={handleGenApiKey} className="w-full py-4 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              Згенерувати API Key
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}