'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Crown, Zap, BarChart2, ShieldCheck, ArrowRight, Loader2, Lock } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
      // Тут логіка генерації лінку на LiqPay / Mono (так само як у Checkout)
      toast.success('Генерація платіжного посилання...');
      // Імітація:
      setTimeout(() => {
        toast.info('Тут буде редірект на еквайринг');
        setLoading(false);
      }, 1500);
    } catch (e) {
      toast.error('Помилка генерації платежу');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-16 md:py-24 px-4 bg-[var(--background)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 rounded-[100%] blur-[120px] pointer-events-none" />
      
      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center justify-center p-3 px-5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-full mb-8 font-black uppercase tracking-widest text-sm border border-indigo-200 dark:border-indigo-800">
          <Crown size={16} className="mr-2" /> Доступ для Інвесторів
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-[var(--foreground)] mb-6 tracking-tight leading-tight">
          Arcturus <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">PRO</span>
        </h1>
        
        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto mb-16">
          Отримайте доступ до інституційної аналітики. Знаходьте недооцінені набори до того, як їх скуплять інші.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left mb-16">
          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm hover:border-indigo-500/30 transition-colors">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 rounded-xl flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">Live Screener</h3>
            <p className="text-slate-500 font-medium">Фільтруйте весь ринок України в реальному часі. Сортування за ROI, маржею та ліквідністю.</p>
          </div>
          
          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm hover:border-purple-500/30 transition-colors">
            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 text-purple-500 rounded-xl flex items-center justify-center mb-6">
              <BarChart2 size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">Orderbook & Indices</h3>
            <p className="text-slate-500 font-medium">Глибина ринку (Asks/Bids) для кожного набору. Графіки зростання цін історично.</p>
          </div>

          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm hover:border-blue-500/30 transition-colors">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-black mb-3">Valuation Models</h3>
            <p className="text-slate-500 font-medium">Штучний інтелект для точної оцінки будь-якого набору за секунду.</p>
          </div>
        </div>

        <div className="max-w-md mx-auto bg-slate-900 dark:bg-black text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Crown size={120} />
          </div>
          <div className="relative z-10 text-left">
            <h3 className="text-2xl font-black mb-2">PRO Підписка</h3>
            <p className="text-slate-400 font-medium mb-8">Щомісячний білінг. Відмінити можна будь-коли.</p>
            
            <div className="flex items-baseline gap-2 mb-8">
              <span className="text-6xl font-black">500</span>
              <span className="text-slate-400 font-bold uppercase tracking-widest">грн / міс</span>
            </div>

            <button 
              onClick={handleSubscribe}
              disabled={loading || isLoading}
              className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Lock size={20} />}
              {user ? 'Оформити підписку' : 'Авторизуйтесь для оплати'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}