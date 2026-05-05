'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSocket } from '@/lib/socket';

interface TickerItem {
  id: string;
  name: string;
  price: number;
  change: string;
  isUp: boolean;
}

export function Ticker() {
  const [data, setData] = useState<TickerItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadTicker = async () => {
    try {
      const res = await fetch('/api/public/catalog?limit=15', { cache: 'no-store' });
      const items = await res.json();
      if (Array.isArray(items) && items.length > 0) {
        const formatted = items.map((item: any) => ({
          id: item.item?.setNumber || item.id.slice(0, 6),
          name: item.titleSnapshot,
          price: item.expectedSalePriceManual ?? item.totalCost ?? 0,
          change: (Math.random() * 5).toFixed(2), 
          isUp: Math.random() > 0.3
        }));
        setData(formatted);
      }
    } catch (e) {}
  };

  useEffect(() => {
    setMounted(true);
    loadTicker();
    
    const socket = getSocket();
    const handleUpdate = () => loadTicker();
    
    socket.on('inventory_updated', handleUpdate);
    socket.on('sale_registered', handleUpdate);
    
    return () => {
      socket.off('inventory_updated', handleUpdate);
      socket.off('sale_registered', handleUpdate);
    };
  }, []);

  if (!mounted || data.length === 0) {
    return <div className="h-8 sm:h-10 bg-slate-950 dark:bg-black border-b border-slate-800" />;
  }

  return (
    <div className="bg-slate-950 dark:bg-black text-slate-300 border-b border-slate-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider overflow-hidden flex items-center h-8 sm:h-10 relative z-50">
      <div className="flex animate-[ticker_40s_linear_infinite] whitespace-nowrap hover:[animation-play-state:paused]">
        {[...data, ...data, ...data].map((item, index) => (
          <div key={index} className="flex items-center gap-2 mx-6">
            <span className="text-slate-500">#{item.id}</span>
            <span className="text-white">{item.name}</span>
            <span className="text-slate-400 font-mono">{new Intl.NumberFormat('uk-UA').format(item.price)} ₴</span>
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