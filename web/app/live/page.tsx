'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { getSocket } from '@/lib/socket';
import { formatMoney } from '@/lib/format';
import { Flame, Clock, Gavel, Loader2, ArrowUpCircle } from 'lucide-react';
import Image from 'next/image';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export default function ArcturusLivePage() {
  const { data: streamData, mutate: mutateStream } = useSWR<any>('/api/proxy/live/active', swrFetcher);
  
  const [timeLeft, setTimeLeft] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [isBidding, setIsBidding] = useState(false);

  const stream = streamData;
  const activeAuction = stream?.auctions?.[0];

  useEffect(() => {
    const socket = getSocket();
    
    socket.on('live.auction_started', () => mutateStream());
    socket.on('live.bid_placed', () => mutateStream());
    socket.on('live.auction_ended', () => mutateStream());
    socket.on('live.stream_started', () => mutateStream());
    socket.on('live.stream_ended', () => mutateStream());

    return () => {
      socket.off('live.auction_started');
      socket.off('live.bid_placed');
      socket.off('live.auction_ended');
      socket.off('live.stream_started');
      socket.off('live.stream_ended');
    };
  }, [mutateStream]);

  useEffect(() => {
    if (!activeAuction?.endsAt) {
      setTimeLeft('');
      return;
    }

    const interval = setInterval(() => {
      const diff = new Date(activeAuction.endsAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('ENDED');
        clearInterval(interval);
      } else {
        const s = Math.ceil(diff / 1000);
        setTimeLeft(`${s}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeAuction?.endsAt]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAuction || isBidding) return;

    try {
      setIsBidding(true);
      await apiFetch(`/api/proxy/live/auction/${activeAuction.id}/bid`, {
        method: 'POST',
        body: JSON.stringify({ amount: Number(bidAmount) })
      });
      setBidAmount('');
      toast.success('Bid placed!');
    } catch (e: any) {
      toast.error(e.message || 'Bid failed');
    } finally {
      setIsBidding(false);
    }
  };

  if (!stream) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6 text-center">
        <Flame size={64} className="text-slate-800 mb-6" />
        <h1 className="text-3xl font-black mb-2">ARCTURUS LIVE</h1>
        <p className="text-slate-500 font-medium">Трансляція наразі офлайн. Слідкуйте за анонсами в Telegram.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      <div className="absolute top-6 left-6 z-50 flex items-center gap-3 px-4 py-2 bg-red-600 rounded-full font-black uppercase text-sm tracking-widest shadow-lg shadow-red-600/50">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> LIVE
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 bg-slate-900 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            {stream.videoUrl ? (
              <iframe 
                src={stream.videoUrl} 
                className="w-full h-full border-none"
                allowFullScreen
              />
            ) : (
              <div className="text-slate-600 font-black text-2xl tracking-widest">VIDEO STREAM PLACEHOLDER</div>
            )}
          </div>
        </div>

        <div className="w-full md:w-[450px] bg-slate-950 border-l border-slate-800 flex flex-col p-6 z-10">
          <h2 className="text-2xl font-black mb-8 border-b border-slate-800 pb-4">{stream.title}</h2>

          {activeAuction ? (
            <div className="flex-1 flex flex-col">
              <div className="relative aspect-video rounded-3xl bg-white border border-slate-800 mb-6 overflow-hidden">
                {activeAuction.inventoryItem?.images?.[0]?.imageUrl ? (
                  <Image src={activeAuction.inventoryItem.images[0].imageUrl} fill alt="" className="object-contain p-4 mix-blend-multiply" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><Gavel size={48}/></div>
                )}
                <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md px-4 py-2 rounded-full font-mono font-black text-red-500 flex items-center gap-2 text-xl shadow-2xl">
                  <Clock size={18}/> {timeLeft}
                </div>
              </div>

              <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">{activeAuction.inventoryItem?.item?.theme || 'LEGO'}</div>
              <h3 className="text-xl font-bold leading-tight mb-8 line-clamp-2">{activeAuction.inventoryItem?.titleSnapshot}</h3>

              <div className="mt-auto">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Current Bid</div>
                <div className="text-5xl font-black text-emerald-400 mb-6 font-mono">{formatMoney(activeAuction.currentPrice)}</div>

                <form onSubmit={handleBid} className="flex gap-3">
                  <input 
                    type="number" 
                    required 
                    min={activeAuction.currentPrice + 50}
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    placeholder={`Min ${activeAuction.currentPrice + 50}`}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-4 text-xl font-bold outline-none focus:border-blue-500"
                  />
                  <button 
                    type="submit"
                    disabled={isBidding || timeLeft === 'ENDED'}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isBidding ? <Loader2 className="animate-spin" /> : <ArrowUpCircle size={28} />}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <Gavel size={48} className="text-slate-800 mb-4" />
              <div className="text-xl font-black text-slate-500">Wait for the next drop</div>
              <div className="text-sm font-medium text-slate-600 mt-2">The host will start an auction soon.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}