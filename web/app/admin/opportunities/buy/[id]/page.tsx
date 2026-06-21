'use client';

import { use } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Loader2, ExternalLink, TrendingUp, AlertTriangle, Package, DollarSign, ShieldAlert, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { formatMoney, formatPercent } from '@/lib/format';
import Link from 'next/link';

export default function BuyOpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading } = useSWR<any>(`/api/admin/opportunities/buy/${id}`, swrFetcher);

  if (isLoading) return <div className="h-[calc(100vh-8rem)] flex items-center justify-center"><Loader2 className="animate-spin w-12 h-12 text-blue-500" /></div>;
  if (!data || !data.item) return <div className="p-10 text-center font-bold text-slate-500">Opportunity not found</div>;

  const { item, opportunity, listings, snapshots } = data;
  const snapshot = snapshots?.[0];
  const marketMedian = snapshot?.medianPrice ?? opportunity?.targetSellPrice ?? 0;

  // Сортуємо лістинги від найдешевшого до найдорожчого
  const sortedListings = Array.isArray(listings) 
    ? [...listings].sort((a, b) => (a.price + (a.shippingPrice || 0)) - (b.price + (b.shippingPrice || 0))) 
    : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500 hardware-accelerated">
      <Link href="/admin/opportunities/buy" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors mb-4 shadow-sm text-[var(--foreground)]">
        <ArrowLeft className="h-4 w-4" /> Назад до Можливостей
      </Link>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2.5rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 shrink-0">
            <Package size={32} />
          </div>
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-blue-500 mb-1">{item.theme || 'LEGO'} • {item.setNumber}</div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight leading-tight">{item.title}</h1>
          </div>
        </div>

        {opportunity && (
          <div className="relative z-10 flex gap-4 text-right shrink-0 bg-[var(--background)] p-4 rounded-2xl border border-[var(--border)]">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Max ROI</div>
              <div className="text-2xl font-black text-emerald-500">{formatPercent(opportunity.roi)}</div>
            </div>
            <div className="w-px bg-[var(--border)]" />
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Est. Profit</div>
              <div className="text-2xl font-black text-emerald-500">+{formatMoney(opportunity.profit)}</div>
            </div>
          </div>
        )}
      </div>

      <h2 className="text-2xl font-black text-[var(--foreground)] mt-8 mb-4 px-2">Знайдені лоти на ринку ({sortedListings.length})</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedListings.map((listing, idx) => {
          const totalCost = listing.price + (listing.shippingPrice || 0);
          const profit = marketMedian - totalCost;
          const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
          
          // Простенька логіка виявлення "палі" по ціні. Якщо ціна менше 45% від медіани ринку — це 99% аналог або скам.
          const isSuspiciouslyCheap = marketMedian > 0 && totalCost < (marketMedian * 0.45);

          return (
            <div key={listing.id} className={`flex flex-col rounded-[2rem] border bg-[var(--card)] p-6 transition-all duration-300 hover:shadow-xl relative overflow-hidden group ${isSuspiciouslyCheap ? 'border-red-200 dark:border-red-900/50' : 'border-[var(--border)] hover:border-blue-500/30'}`}>
              
              {isSuspiciouslyCheap && (
                <div className="absolute top-0 left-0 w-full bg-red-500 text-white text-[10px] font-black uppercase tracking-widest py-1 text-center flex justify-center items-center gap-1 shadow-md">
                  <ShieldAlert size={12} /> Підозріло низька ціна (Можливо Аналог)
                </div>
              )}

              <div className={`flex justify-between items-start gap-4 mb-6 ${isSuspiciouslyCheap ? 'mt-4' : ''}`}>
                <h3 className="font-bold text-[var(--foreground)] leading-tight line-clamp-2">{listing.title}</h3>
                <span className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 border border-[var(--border)]">
                  {listing.sourceCode}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-[var(--background)] rounded-xl border border-[var(--border)]">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1 flex items-center gap-1"><DollarSign size={12}/> Ціна</div>
                  <div className="text-xl font-black text-[var(--foreground)]">{formatMoney(totalCost)}</div>
                </div>
                <div className={`p-3 rounded-xl border ${roi > 0 ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50' : 'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-900/50'}`}>
                  <div className={`text-[10px] font-black uppercase tracking-widest mb-1 flex items-center gap-1 ${roi > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <TrendingUp size={12}/> {roi > 0 ? 'Профіт' : 'Збиток'}
                  </div>
                  <div className={`text-xl font-black ${roi > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {roi > 0 ? '+' : ''}{formatMoney(profit)}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-[var(--border)] flex gap-3">
                <a 
                  href={listing.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md"
                >
                  Відкрити лот <ExternalLink size={16} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}