'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Flame, Users, Crosshair, Plus, CheckCircle2 } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { formatMoney } from '@/lib/format';
import { SectionCard } from '@/components/admin/section-card';
import { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

interface DemandItem {
  itemId: string;
  title: string;
  setNumber: string | null;
  theme: string;
  imageUrl: string | null;
  demandCount: number;
  highestOffer: number;
  averageOffer: number;
  potentialRevenue: number;
  inProcurementWatchlist: boolean;
}

export default function DemandHeatmapPage() {
  const { data, isLoading, mutate } = useSWR<DemandItem[]>('/api/admin/demand', swrFetcher, { refreshInterval: 30000 });
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const rows = Array.isArray(data) ? data : [];

  const addToWatchlist = async (item: DemandItem) => {
    try {
      setLoadingId(item.itemId);
      // Розраховуємо цілі закупки базуючись на середньому офері клієнтів
      const targetSell = item.averageOffer || item.highestOffer;
      const maxBuy = targetSell * 0.75; // Хочемо 25% чистої маржі
      const desiredBuy = targetSell * 0.6; // Ідеально 40% маржі

      await apiFetch('/api/admin/watchlist/create', {
        method: 'POST',
        body: JSON.stringify({
          itemId: item.itemId,
          titleSnapshot: item.title,
          desiredBuyPrice: desiredBuy,
          maxBuyPrice: maxBuy,
          targetSellPrice: targetSell,
          priority: 95, // Високий пріоритет, бо вже є покупець!
          active: true,
          notes: `Auto-added from Demand Heatmap. ${item.demandCount} users waiting.`
        }),
      });
      
      toast.success('Added to Procurement Watchlist with High Priority!');
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add to watchlist');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 hardware-accelerated pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg shadow-rose-500/20">
            <Flame className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Community Demand Heatmap</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Discover what customers are actively searching for and willing to buy.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-[var(--card)] p-6 rounded-[2rem] border border-[var(--border)] shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2"><Users size={14}/> Total Demand Pool</div>
          <div className="text-4xl font-black text-rose-600">{rows.reduce((sum, r) => sum + r.demandCount, 0)}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">Active customer requests</div>
        </div>
        <div className="bg-[var(--card)] p-6 rounded-[2rem] border border-[var(--border)] shadow-sm">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2"><Crosshair size={14}/> Potential Pipeline Value</div>
          <div className="text-4xl font-black text-emerald-600">{formatMoney(rows.reduce((sum, r) => sum + r.potentialRevenue, 0))}</div>
          <div className="text-xs font-bold text-slate-400 mt-1">If all demand is fulfilled</div>
        </div>
      </div>

      <SectionCard title="Most Wanted Assets">
        <DataTable
          rows={rows}
          emptyText={isLoading ? "Analyzing community requests..." : "No active demand found. Promote the store!"}
          getRowKey={(row) => row.itemId}
          columns={[
            {
              key: 'asset',
              header: 'Asset',
              render: (row) => (
                <div className="flex items-center gap-3">
                  {row.imageUrl ? (
                    <img src={row.imageUrl} alt="" className="w-10 h-10 object-contain rounded-lg bg-slate-100 p-1 mix-blend-multiply dark:mix-blend-normal" />
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 rounded-lg" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-bold text-[var(--foreground)] truncate max-w-[200px]">{row.title}</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.theme} {row.setNumber ? `• ${row.setNumber}` : ''}</span>
                  </div>
                </div>
              ),
            },
            {
              key: 'demand',
              header: 'Clients Waiting',
              render: (row) => (
                <span className="inline-flex items-center justify-center min-w-[2rem] rounded-md bg-rose-100 dark:bg-rose-900/30 px-2 py-1 font-mono text-sm font-black text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                  {row.demandCount}
                </span>
              ),
            },
            {
              key: 'avgOffer',
              header: 'Avg. Readiness',
              render: (row) => <span className="font-bold text-slate-700 dark:text-slate-300">{row.averageOffer > 0 ? formatMoney(row.averageOffer) : 'Market Price'}</span>,
            },
            {
              key: 'highestOffer',
              header: 'Highest Offer',
              render: (row) => <span className="font-black text-emerald-600 dark:text-emerald-400">{row.highestOffer > 0 ? formatMoney(row.highestOffer) : 'Market Price'}</span>,
            },
            {
              key: 'revenue',
              header: 'Potential Revenue',
              render: (row) => <span className="font-bold text-[var(--foreground)]">{formatMoney(row.potentialRevenue)}</span>,
            },
            {
              key: 'actions',
              header: '',
              render: (row) => (
                <div className="flex justify-end">
                  {row.inProcurementWatchlist ? (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-xl border border-emerald-200">
                      <CheckCircle2 size={14} /> Hunting...
                    </span>
                  ) : (
                    <button 
                      onClick={() => addToWatchlist(row)}
                      disabled={loadingId !== null}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-95 disabled:opacity-50"
                    >
                      <Plus size={14} /> Source It
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}