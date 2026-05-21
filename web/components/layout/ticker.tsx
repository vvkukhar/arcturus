'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import useSWR from 'swr';
import { getSocket } from '@/lib/socket';
import { useI18n } from '@/components/providers/i18n-provider';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney } from '@/lib/format';

interface TickerItem {
  id: string;
  itemId: string;
  totalCost?: number;
  expectedSalePriceManual?: number;
  titleSnapshot: string;
  item?: { setNumber: string };
}

export function Ticker() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const { data: rawData, mutate } = useSWR<TickerItem[]>('/api/proxy/public/catalog?limit=15', swrFetcher);

  useEffect(() => {
    setMounted(true);
    
    const socket = getSocket();
    const handleUpdate = () => mutate();
    
    socket.on('inventory_updated', handleUpdate);
    socket.on('sale_registered', handleUpdate);
    
    return () => {
      socket.off('inventory_updated', handleUpdate);
      socket.off('sale_registered', handleUpdate);
    };
  }, [mutate]);

  const data = useMemo(() => {
    const items = Array.isArray(rawData) ? rawData : [];
    return items.map((item) => {
      const cost = item.totalCost || 1;
      const price = item.expectedSalePriceManual ?? cost;
      const change = (((price - cost) / cost) * 100);
      return {
        id: item.item?.setNumber || item.itemId.slice(0, 6),
        name: item.titleSnapshot,
        price: price,
        change: Math.abs(change).toFixed(2), 
        isUp: change >= 0
      };
    });
  }, [rawData]);

  if (!mounted) {
    return <div className="h-8 sm:h-10 bg-slate-950 dark:bg-black border-b border-slate-800" />;
  }

  if (data.length === 0) {
    return (
      <div className="bg-slate-950 dark:bg-black text-slate-500 border-b border-slate-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center h-8 sm:h-10 relative z-50">
        {(t('ticker.awaiting' as any) as string)}
      </div>
    );
  }

  return (
    <div className="bg-slate-950 dark:bg-black text-slate-300 border-b border-slate-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider overflow-hidden flex items-center h-8 sm:h-10 relative z-50">
      <div className="flex animate-[ticker_40s_linear_infinite] whitespace-nowrap hover:[animation-play-state:paused]">
        {[...data, ...data, ...data].map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center gap-2 mx-6">
            <span className="text-slate-500">#{item.id}</span>
            <span className="text-white">{item.name}</span>
            <span className="text-slate-400 font-mono">{formatMoney(item.price)}</span>
            <span className={`flex items-center gap-0.5 font-mono ${item.isUp ? 'text-green-500' : 'text-red-500'}`}>
              {item.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {item.isUp ? '+' : '-'}{item.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}