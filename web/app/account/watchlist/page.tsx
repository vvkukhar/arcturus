'use client';

import useSWR from 'swr';
import { useI18n } from '@/components/providers/i18n-provider';
import { Heart, TrendingUp, TrendingDown, Bell, Search, Loader2 } from 'lucide-react';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney } from '@/lib/format';
import Link from 'next/link';

interface WatchlistRow {
  id: string;
  itemId: string;
  titleSnapshot: string;
  maxBuyPrice: number;
  targetSellPrice?: number;
  priority: number;
  active: boolean;
}

export default function WatchlistPage() {
  const { t } = useI18n();
  const { data, isLoading } = useSWR<WatchlistRow[]>('/api/watchlist', swrFetcher as any);

  const watchlist = Array.isArray(data) ? data.filter((x) => x.active) : [];

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto animate-fade-in-up">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('sidebar.watchlist' as any)}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Monitoring active assets for potential entry points.</p>
        </div>
        <Link href="/store/catalog" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors">
          <Search size={18} /> Find Sets
        </Link>
      </div>

      <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden">
        {watchlist.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">Your watchlist is currently empty.</div>
        ) : (
          watchlist.map((item) => {
            const spread = (item.targetSellPrice ?? item.maxBuyPrice) - item.maxBuyPrice;
            const roi = item.maxBuyPrice > 0 ? (spread / item.maxBuyPrice) * 100 : 0;
            const isUp = roi > 0;

            return (
              <div key={item.id} className="flex items-center justify-between p-6 border-b border-[var(--border)] last:border-none hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-2 text-red-500 transition-colors cursor-pointer">
                    <Heart size={24} fill="currentColor" />
                  </div>
                  <div>
                    <p className="font-black text-lg leading-tight line-clamp-1">{item.titleSnapshot}</p>
                    <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-widest">ID: {item.itemId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="font-black text-lg">{formatMoney(item.maxBuyPrice)} Max</p>
                    <p className={`text-xs font-bold flex items-center justify-end gap-1 ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {isUp ? '+' : ''}{roi.toFixed(1)}% Est. ROI
                    </p>
                  </div>
                  <button className="p-3 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    <Bell size={20} className={item.priority > 70 ? 'text-blue-500 fill-current' : ''} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}