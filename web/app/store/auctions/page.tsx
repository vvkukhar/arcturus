'use client';

import useSWR from 'swr';
import Link from 'next/link';
import Image from 'next/image';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney } from '@/lib/format';
import { Gavel, Clock, Flame, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

function Countdown({ endsAt }: { endsAt: string }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = new Date(endsAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('Finished');
        clearInterval(interval);
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  return <span>{timeLeft}</span>;
}

export default function AuctionsCatalogPage() {
  const { data: auctions, isLoading } = useSWR<any[]>('/api/auctions', swrFetcher, { refreshInterval: 5000 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-widest mb-4 border border-red-200 dark:border-red-800">
            <Flame size={14} className="animate-pulse" /> Live Bidding
          </div>
          <h1 className="text-4xl font-black tracking-tight text-[var(--foreground)]">Exclusive Auctions</h1>
          <p className="mt-2 font-medium text-slate-500">Bid on rare and retired sets in real-time.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>
      ) : auctions && auctions.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {auctions.map((auction) => {
            const item = auction.inventoryItem;
            const primaryImage = item.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80';
            
            return (
              <Link 
                key={auction.id} 
                href={`/store/auctions/${auction.id}`}
                className="group flex flex-col overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-sm hover:shadow-xl hover:border-red-200 transition-all duration-300 transform-gpu hover:-translate-y-1"
              >
                <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900">
                  <Image src={primaryImage} alt="" fill className="object-cover mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="bg-black/80 backdrop-blur-md text-white font-mono font-bold text-sm px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                      <Clock size={14} className="text-red-400" />
                      <Countdown endsAt={auction.endsAt} />
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{item.item?.theme || 'LEGO'}</div>
                  <h3 className="font-black text-lg leading-tight line-clamp-2 mb-4 group-hover:text-red-600 transition-colors">{item.titleSnapshot}</h3>
                  <div className="mt-auto flex items-end justify-between">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Current Bid</div>
                      <div className="text-2xl font-black text-red-600 dark:text-red-400">{formatMoney(auction.currentPrice)}</div>
                    </div>
                    <div className="h-10 w-10 bg-[var(--background)] rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--foreground)] group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-colors">
                      <Gavel size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[var(--border)] bg-[var(--card)] py-20 text-center">
          <Gavel className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-black text-[var(--foreground)]">No Active Auctions</h3>
          <p className="mt-2 font-medium text-slate-500">Check back later for exclusive drops.</p>
        </div>
      )}
    </div>
  );
}