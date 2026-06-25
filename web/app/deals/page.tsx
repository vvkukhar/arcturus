'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney, formatPercent } from '@/lib/format';
import { Loader2, Target, ExternalLink, ShieldAlert } from 'lucide-react';
import { ProGate } from '@/components/store/pro-gate';
import Image from 'next/image';
import { useI18n } from '@/components/providers/i18n-provider';

interface ProDeal {
  id: string;
  title: string;
  buyPrice: number;
  targetSellPrice: number;
  profit: number;
  roiPercent: number;
  url: string;
  sourceCode: string;
  score: number;
  imageUrl?: string;
}

export default function ProDealsPage() {
  const { t } = useI18n();
  const { data, isLoading } = useSWR<ProDeal[]>('/api/proxy/pro/deals', swrFetcher, { refreshInterval: 15000 });
  const deals = Array.isArray(data) ? data : [];

  return (
    <ProGate>
      <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{t('pro.success.btn1' as any)}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
              {t('pro.signalsDesc' as any)}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl font-bold text-sm">
            <Target size={16} className="animate-pulse" /> {t('market.active' as any)}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-indigo-500" /></div>
        ) : deals.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 rounded-[2.5rem] border-2 border-dashed border-[var(--border)] bg-[var(--card)]/50">
            <ShieldAlert size={48} className="text-slate-300 mb-6" />
            <h3 className="text-2xl font-black text-[var(--foreground)]">{t('common.empty' as any)}</h3>
            <p className="mt-2 font-medium text-slate-500">{t('ticker.awaiting' as any)}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map(deal => (
              <div key={deal.id} className="group rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all">
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative h-16 w-16 bg-slate-100 dark:bg-slate-900 rounded-xl border border-[var(--border)] overflow-hidden shrink-0">
                    {deal.imageUrl ? (
                      <Image src={deal.imageUrl} alt="" fill className="object-contain p-1 mix-blend-multiply dark:mix-blend-normal" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300"><Target size={24}/></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{deal.sourceCode}</div>
                    <h3 className="font-bold text-[var(--foreground)] leading-tight line-clamp-2">{deal.title}</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-[var(--border)]">
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t('orderbook.price' as any)}</div>
                    <div className="text-xl font-black text-[var(--foreground)]">{formatMoney(deal.buyPrice)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1">{t('screener.col.target' as any)}</div>
                    <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">{formatMoney(deal.targetSellPrice)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">{t('admin.profit.avgProfit' as any)}</div>
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">+{formatMoney(deal.profit)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">ROI</div>
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatPercent(deal.roiPercent)}</div>
                  </div>
                </div>

                <a 
                  href={deal.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white font-black rounded-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                  {t('scout.buy' as any)} <ExternalLink size={16} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProGate>
  );
}