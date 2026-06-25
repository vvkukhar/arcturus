'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Crown, Zap, BarChart2, ShieldCheck, ArrowRight, Loader2, Lock, Terminal, Vault, Send } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/components/providers/i18n-provider';

export default function ArcturusProPage() {
  const { t } = useI18n();
  const { data: user, isLoading, mutate } = useSWR<any>('/api/auth/me', swrFetcher);
  const [loading, setLoading] = useState(false);
  const [signalQuery, setSignalQuery] = useState('');
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
      toast.error(e.message || 'Error');
      setLoading(false);
    }
  };

  const handleBuySignal = async () => {
    if (!signalQuery) return;
    setLoading(true);
    try {
      await apiFetch('/api/proxy/monetization/signals/subscribe', { 
        method: 'POST',
        body: JSON.stringify({ query: signalQuery, type: 'telegram' })
      });
      toast.success('Subscribed successfully!');
      setSignalQuery('');
      mutate();
    } catch (e: any) {
      toast.error(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-16 md:py-24 px-4 bg-[var(--background)] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 rounded-[100%] blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10 text-center">
        
        <h1 className="text-5xl md:text-7xl font-black text-[var(--foreground)] mb-6 tracking-tight leading-tight">
          {t('pro.title' as any)}
        </h1>
        
        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mb-16">
          {t('pro.subtitle' as any)}
        </p>

        {/* Секція Платних Сигналів */}
        <div className="mb-16 bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-xl flex flex-col md:flex-row items-center gap-8 text-left">
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl shrink-0">
            <Send size={48} className="text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-black mb-2">{t('pro.signals' as any)}</h3>
            <p className="text-slate-500 font-medium mb-4">{t('pro.signalsDesc' as any)}</p>
            <div className="flex gap-4">
              <input 
                value={signalQuery}
                onChange={e => setSignalQuery(e.target.value)}
                placeholder="ID / Name..." 
                className="flex-1 bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 font-bold outline-none focus:border-blue-500"
              />
              <button 
                onClick={handleBuySignal}
                disabled={loading || !signalQuery}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Zap size={18} />} {t('pro.subscribeSignal' as any)}
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 text-left mb-16">
          
          {/* TIER 1: PRO APP */}
          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-xl relative flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-black mb-2">{t('pro.tier1.title' as any)}</h3>
              <p className="text-slate-500 font-medium h-12">{t('pro.tier1.desc' as any)}</p>
            </div>
            <div className="text-4xl font-black mb-6">{t('pro.tier1.price' as any)}</div>
            <button onClick={handleSubscribe} disabled={loading} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:scale-[1.02] transition-transform mt-auto">
              {t('pro.tier1.btn' as any)}
            </button>
          </div>

          {/* TIER 2: VAULT (INVEST) */}
          <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-2xl relative flex flex-col transform md:-translate-y-4">
            <div className="absolute top-0 right-0 p-6 opacity-10"><Vault size={100} /></div>
            <div className="mb-6 relative z-10">
              <h3 className="text-2xl font-black mb-2">{t('pro.tier2.title' as any)}</h3>
              <p className="text-slate-400 font-medium h-12">{t('pro.tier2.desc' as any)}</p>
            </div>
            <div className="text-4xl font-black mb-6">{t('pro.tier2.price' as any)}</div>
            <Link href="/vault" className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black rounded-xl text-center hover:scale-[1.02] transition-transform shadow-lg shadow-amber-500/20 mt-auto relative z-10">
              {t('pro.tier2.btn' as any)}
            </Link>
          </div>

          {/* TIER 3: B2B API */}
          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-xl relative flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl font-black mb-2">{t('pro.tier3.title' as any)}</h3>
              <p className="text-slate-500 font-medium h-12">{t('pro.tier3.desc' as any)}</p>
            </div>
            <div className="text-4xl font-black mb-6">{t('pro.tier3.price' as any)}</div>
            <Link href="/account" className="w-full text-center py-4 bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors mt-auto">
              {t('pro.tier3.btn' as any)}
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}