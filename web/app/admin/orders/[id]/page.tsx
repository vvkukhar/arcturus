'use client';

import { use } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Loader2, Package, User, MapPin, Truck, CheckCircle2 } from 'lucide-react';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney } from '@/lib/format';
import { apiFetch } from '@/lib/api';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

export default function OrderFulfillmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: order, isLoading, mutate } = useSWR<any>(`/api/admin/orders/${id}`, swrFetcher);
  const [isCompleting, setIsCompleting] = useState(false);

  if (isLoading) return <div className="flex h-[calc(100vh-8rem)] items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>;
  if (!order) return <div className="flex h-[calc(100vh-8rem)] items-center justify-center font-bold text-slate-500">Order not found</div>;

  const imageUrl = order.inventoryItem?.images?.[0]?.imageUrl;

  const handleComplete = async () => {
    if (!confirm('Mark this order as sold and generate Nova Poshta TTN?')) return;
    try {
      setIsCompleting(true);
      await apiFetch('/api/admin/orders/complete', {
        method: 'PATCH',
        body: JSON.stringify({ id: order.id }),
      });
      toast.success('Order completed successfully! Sale recorded.');
      mutate();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete order');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-fade-in-up hardware-accelerated">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Order Fulfillment</h1>
          <p className="mt-1 text-sm font-mono text-slate-500">ID: {order.id}</p>
        </div>
        <div className="flex flex-col sm:items-end gap-3">
          <StatusPill value={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="font-black text-xl flex items-center gap-2"><User size={20} className="text-blue-500"/> Buyer & Logistics</h3>
          
          <div className="space-y-4">
            <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border)]">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Customer</div>
              <div className="font-bold text-lg text-[var(--foreground)]">{order.buyerName}</div>
              <div className="font-medium text-blue-600 dark:text-blue-400">{order.contact}</div>
            </div>

            <div className="bg-[var(--background)] p-4 rounded-xl border border-[var(--border)]">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 flex items-center gap-1"><MapPin size={12}/> Delivery Info</div>
              <div className="font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{order.adminNote || 'No delivery details provided'}</div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6 flex flex-col">
          <h3 className="font-black text-xl flex items-center gap-2"><Package size={20} className="text-emerald-500"/> Order Items</h3>
          
          <div className="flex items-start gap-4">
            <div className="relative h-20 w-20 rounded-2xl border border-[var(--border)] bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0">
              {imageUrl ? (
                <Image src={imageUrl} alt="" fill className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300"><Package size={32}/></div>
              )}
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <div className="font-black text-lg leading-tight text-[var(--foreground)] line-clamp-2">{order.productTitle}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Qty: {order.quantity}</div>
              <div className="mt-2 font-black text-emerald-600 dark:text-emerald-400 text-2xl">
                {order.sellPrice ? formatMoney(order.sellPrice) : 'Unpriced'}
              </div>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-[var(--border)]">
            {order.status === 'sold' || order.status === 'paid' ? (
              <div className="w-full py-4 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/50 flex items-center justify-center gap-2 font-black">
                <CheckCircle2 size={20} /> Order Fulfilled & Recorded
              </div>
            ) : order.status === 'cancelled' ? (
              <div className="w-full py-4 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center gap-2 font-black">
                Order Cancelled
              </div>
            ) : (
              <button 
                onClick={handleComplete}
                disabled={isCompleting || !order.sellPrice}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                {isCompleting ? <Loader2 className="animate-spin" size={20} /> : <Truck size={20} />}
                {isCompleting ? 'Processing & Fetching TTN...' : 'Complete Sale & Generate TTN'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}