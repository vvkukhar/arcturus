'use client';

import { use, useEffect, useState } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { getSocket } from '@/lib/socket';
import { apiFetch } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import { useI18n } from '@/components/providers/i18n-provider';
import Image from 'next/image';
import { Loader2, Gavel, Clock, ArrowLeft, ArrowUpCircle, Lock } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AuctionRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t } = useI18n();
  const [bidAmount, setBidAmount] = useState('');
  const [isBidding, setIsBidding] = useState(false);
  const [isPayingDeposit, setIsPayingDeposit] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  const { data: user } = useSWR<any>('/api/auth/me', swrFetcher);
  const { data: auction, isLoading, mutate } = useSWR<any>(`/api/auctions/${id}`, swrFetcher);

  const hasTicket = auction?.tickets?.some((ticket: any) => ticket.userId === user?.id && ticket.status === 'locked');

  useEffect(() => {
    if (!auction) return;
    const socket = getSocket();
    
    const handleNewBid = () => {
      toast.info('New bid placed!');
      mutate();
    };

    socket.on(`auction.${id}.bid_placed`, handleNewBid);
    return () => {
      socket.off(`auction.${id}.bid_placed`, handleNewBid);
    };
  }, [id, auction, mutate]);

  useEffect(() => {
    if (!auction?.endsAt) return;
    const interval = setInterval(() => {
      const diff = new Date(auction.endsAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft(t('auctions.time.finished' as any));
        clearInterval(interval);
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [auction?.endsAt, t]);

  const handlePayDeposit = async () => {
    if (isPayingDeposit) return;
    try {
      setIsPayingDeposit(true);
      await apiFetch(`/api/proxy/live/auction/${id}/ticket`, { method: 'POST' });
      toast.success(t('live.depositSuccess' as any));
      mutate();
    } catch (e: any) {
      toast.error(e.message || 'Error');
    } finally {
      setIsPayingDeposit(false);
    }
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(bidAmount);
    if (amount <= (auction?.currentPrice || 0)) {
      toast.error(t('offer.errorHigher' as any));
      return;
    }

    try {
      setIsBidding(true);
      await apiFetch(`/api/proxy/live/auction/${id}/bid`, {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
      setBidAmount('');
      toast.success(t('live.bidSuccess' as any));
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'Failed to place bid.');
    } finally {
      setIsBidding(false);
    }
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-red-500" /></div>;
  if (!auction) return <div className="flex h-screen items-center justify-center font-bold">Auction not found</div>;

  const item = auction.inventoryItem;
  const displayImage = item.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80';
  const isEnded = new Date(auction.endsAt).getTime() <= Date.now();

  const minNextBid = auction.currentPrice + 50;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500 pb-24">
      <Link href="/store/auctions" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)] text-sm font-bold hover:bg-slate-50 transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" /> {t('auctions.back' as any)}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative aspect-square w-full rounded-[3rem] bg-[var(--card)] border border-[var(--border)] overflow-hidden shadow-sm">
          <Image src={displayImage} alt={item.titleSnapshot} fill className="object-cover mix-blend-multiply dark:mix-blend-normal" />
          <div className="absolute top-6 left-6 flex gap-2">
            <span className="px-4 py-2 rounded-xl bg-red-600 text-white font-black uppercase tracking-widest text-xs flex items-center gap-2 shadow-lg">
              <Clock size={14} /> {timeLeft}
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <div className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{item.item?.theme || 'LEGO'}</div>
            <h1 className="text-3xl md:text-5xl font-black text-[var(--foreground)] tracking-tight leading-tight">{item.titleSnapshot}</h1>
          </div>

          <div className="bg-[var(--card)] p-8 rounded-[2rem] border border-[var(--border)] shadow-xl mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Gavel size={120} /></div>
            
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">{t('auctions.current' as any)}</div>
            <div className="text-5xl md:text-6xl font-black text-red-600 dark:text-red-400 mb-8 font-mono">
              {formatMoney(auction.currentPrice)}
            </div>

            {!hasTicket && !isEnded ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 p-6 rounded-2xl relative z-10">
                <div className="flex items-center gap-3 mb-4 text-red-600 dark:text-red-400">
                  <Lock size={24} />
                  <span className="font-black text-lg">{t('live.depositReq' as any)}</span>
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-6">{t('live.depositDesc' as any)}</p>
                <button 
                  onClick={handlePayDeposit}
                  disabled={isPayingDeposit}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition-transform active:scale-95 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isPayingDeposit ? <Loader2 className="animate-spin" /> : <Gavel />} {t('live.payDeposit' as any)}
                </button>
              </div>
            ) : (
              <form onSubmit={handlePlaceBid} className="space-y-4 relative z-10">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₴</span>
                    <input 
                      type="number"
                      min={minNextBid}
                      required
                      disabled={isEnded || isBidding}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={`Min: ${minNextBid}`}
                      className="w-full h-16 pl-10 pr-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--background)] font-black text-xl text-[var(--foreground)] outline-none focus:border-red-500 transition-colors disabled:opacity-50"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isEnded || isBidding || !bidAmount || Number(bidAmount) <= auction.currentPrice}
                    className="h-16 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-lg flex items-center justify-center gap-2 transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 disabled:scale-100 active:scale-95"
                  >
                    {isBidding ? <Loader2 className="animate-spin" /> : <ArrowUpCircle />} {t('auctions.placeBid' as any)}
                  </button>
                </div>
                <p className="text-xs font-semibold text-slate-500">
                  {t('auctions.antiSniping' as any)}
                </p>
              </form>
            )}
          </div>

          <div className="flex-1">
            <h3 className="font-black text-lg mb-4">{t('auctions.bidHistory' as any)} ({auction.bids?.length || 0})</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {auction.bids?.map((bid: any, idx: number) => (
                <div key={bid.id} className="flex justify-between items-center p-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500">#{idx + 1}</div>
                    <div>
                      <div className="font-bold text-sm">{bid.bidder?.name || 'Anonymous'}</div>
                      <div className="text-xs text-slate-400 font-mono">{new Date(bid.createdAt).toLocaleTimeString()}</div>
                    </div>
                  </div>
                  <div className="font-black text-lg">{formatMoney(bid.amount)}</div>
                </div>
              ))}
              {(!auction.bids || auction.bids.length === 0) && (
                <div className="text-center p-8 text-slate-400 font-bold border-2 border-dashed border-[var(--border)] rounded-2xl">
                  {t('auctions.noBids' as any)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}