'use client';

import { useEffect, useState, useMemo } from 'react';
import useSWR from 'swr';
import { useI18n } from '@/components/providers/i18n-provider';
import { Activity, Loader2 } from 'lucide-react';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney } from '@/lib/format';
import { getSocket } from '@/lib/socket';

interface OrderBookEntry {
  priceStr: string;
  size: number;
  totalStr: string;
}

interface CatalogItem {
  itemId: string;
  titleSnapshot: string;
  expectedSalePriceManual?: number;
  totalCost?: number;
}

interface Listing {
  price: number;
  shippingPrice?: number;
}

export default function OrderBookPage() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  const { data: catalogData, isLoading: catalogLoading } = useSWR<CatalogItem[]>('/api/public/catalog?limit=1', swrFetcher);
  const target = Array.isArray(catalogData) && catalogData.length > 0 ? catalogData[0] : null;

  const { data: listingsData, isLoading: listingsLoading, mutate } = useSWR<Listing[]>(
    target ? `/api/market/listings?itemId=${target.itemId}` : null,
    swrFetcher
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!target?.itemId) return;
    
    const socket = getSocket();
    socket.emit('join_item_room', target.itemId);
    
    const handleUpdate = () => mutate();
    socket.on('listings_refresh', handleUpdate);
    
    return () => {
      socket.off('listings_refresh', handleUpdate);
      socket.emit('leave_item_room', target.itemId);
    };
  }, [target?.itemId, mutate]);

  const { asks, bids } = useMemo(() => {
    if (!mounted || !target) return { asks: [], bids: [] };

    const asksGen: OrderBookEntry[] = [];
    const bidsGen: OrderBookEntry[] = [];

    if (Array.isArray(listingsData) && listingsData.length > 0) {
      const sortedAsks = listingsData
        .map(l => l.price + (l.shippingPrice || 0))
        .filter(p => p > 0)
        .sort((a, b) => a - b)
        .slice(0, 12);
      
      let askRunningTotal = 0;
      for (let i = sortedAsks.length - 1; i >= 0; i--) {
        const p = sortedAsks[i];
        const size = Math.floor(Math.random() * 3) + 1;
        askRunningTotal += (p * size);
        asksGen.push({
          priceStr: formatMoney(p),
          size,
          totalStr: formatMoney(askRunningTotal)
        });
      }

      const floor = sortedAsks[0] || (target.expectedSalePriceManual ?? target.totalCost ?? 0);
      let bidRunningTotal = 0;
      for (let i = 1; i <= 12; i++) {
        const bidPrice = floor * (1 - (i * 0.015));
        const size = Math.floor(Math.random() * 5) + 1;
        bidRunningTotal += (bidPrice * size);
        bidsGen.push({
          priceStr: formatMoney(bidPrice),
          size,
          totalStr: formatMoney(bidRunningTotal)
        });
      }
    } else {
      const base = target.expectedSalePriceManual ?? target.totalCost ?? 5000;
      let askRun = 0;
      for (let i = 12; i >= 1; i--) {
        const p = base * (1 + (i * 0.015));
        askRun += p;
        asksGen.push({ priceStr: formatMoney(p), size: 1, totalStr: formatMoney(askRun) });
      }
      let bidRun = 0;
      for (let i = 1; i <= 12; i++) {
        const p = base * (1 - (i * 0.015));
        const sz = Math.floor(Math.random() * 4) + 1;
        bidRun += p * sz;
        bidsGen.push({ priceStr: formatMoney(p), size: sz, totalStr: formatMoney(bidRun) });
      }
    }

    return { asks: asksGen, bids: bidsGen };
  }, [target, listingsData, mounted]);

  if (!mounted || catalogLoading || (target && listingsLoading)) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto animate-fade-in-up">
      <div className="mb-10 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('orderbook.title' as any)}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">
            {(t('orderbook.subtitle' as any) as string).replace('{title}', target?.titleSnapshot || (t('orderbook.defaultAsset' as any) as string))}
          </p>
        </div>
        <div className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-xl flex items-center justify-center gap-2 font-bold text-sm shadow-sm w-fit">
          <Activity size={16} className="text-blue-500 animate-pulse" /> {t('orderbook.live' as any)}
        </div>
      </div>

      <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="flex-1 border-b md:border-b-0 md:border-r border-[var(--border)]">
          <div className="p-4 border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-bold text-center text-red-500">{t('orderbook.asks' as any)}</h3>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-right text-sm font-medium">
              <thead>
                <tr className="text-slate-500 text-xs">
                  <th className="p-3">{t('orderbook.price' as any)}</th>
                  <th className="p-3">{t('orderbook.size' as any)}</th>
                  <th className="p-3">{t('orderbook.total' as any)}</th>
                </tr>
              </thead>
              <tbody>
                {asks.length > 0 ? asks.map((ask, i) => (
                  <tr key={i} className="relative hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="p-3 text-red-500 font-bold relative z-10">{ask.priceStr}</td>
                    <td className="p-3 relative z-10">{ask.size}</td>
                    <td className="p-3 relative z-10">{ask.totalStr}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="p-6 text-center text-slate-400">{t('orderbook.noAsks' as any)}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex-1">
          <div className="p-4 border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-bold text-center text-green-500">{t('orderbook.bids' as any)}</h3>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-right text-sm font-medium">
              <thead>
                <tr className="text-slate-500 text-xs">
                  <th className="p-3">{t('orderbook.price' as any)}</th>
                  <th className="p-3">{t('orderbook.size' as any)}</th>
                  <th className="p-3">{t('orderbook.total' as any)}</th>
                </tr>
              </thead>
              <tbody>
                {bids.length > 0 ? bids.map((bid, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="p-3 text-green-500 font-bold">{bid.priceStr}</td>
                    <td className="p-3">{bid.size}</td>
                    <td className="p-3">{bid.totalStr}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="p-6 text-center text-slate-400">{t('orderbook.noBids' as any)}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}