'use client';

import { use } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Loader2, Package, User, Box } from 'lucide-react';
import { ReserveRequestActions } from '@/components/admin/reserve-request-actions';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney } from '@/lib/format';
import Image from 'next/image';

export default function ReserveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // ФІКС: Правильний роут до нашого API
  const { data, isLoading } = useSWR<any>(`/api/admin/reserves/${id}`, swrFetcher);

  if (isLoading) return <div className="flex h-[calc(100vh-8rem)] items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>;
  if (!data) return <div className="flex h-[calc(100vh-8rem)] items-center justify-center font-bold text-slate-500">Reserve request not found</div>;

  const imageUrl = data.inventoryItem?.images?.[0]?.imageUrl;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Reserve Details</h1>
          <p className="mt-1 text-sm font-mono text-slate-500">ID: {data.id}</p>
        </div>
        <div className="flex flex-col sm:items-end gap-3">
          <StatusPill value={data.status} />
          {/* Кнопки зміни статусу тепер прямо тут! */}
          <ReserveRequestActions id={data.id} currentStatus={data.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6">
          <h3 className="font-black text-xl flex items-center gap-2"><User size={20} className="text-blue-500"/> Customer Info</h3>
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Name</div>
              <div className="font-bold text-lg text-[var(--foreground)]">{data.name}</div>
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contact</div>
              <div className="font-bold text-lg text-blue-600 dark:text-blue-400">{data.contact}</div>
            </div>
            {data.message && (
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message / Delivery</div>
                <div className="font-medium text-slate-700 dark:text-slate-300 bg-[var(--background)] p-4 rounded-xl mt-1 border border-[var(--border)]">{data.message}</div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2rem] p-6 md:p-8 shadow-sm space-y-6 flex flex-col">
          <h3 className="font-black text-xl flex items-center gap-2"><Package size={20} className="text-emerald-500"/> Target Asset</h3>
          
          {data.inventoryItem ? (
            <div className="flex items-start gap-4">
              <div className="relative h-24 w-24 rounded-2xl border border-[var(--border)] bg-slate-100 dark:bg-slate-900 overflow-hidden shrink-0">
                {imageUrl ? (
                   <Image src={imageUrl} alt="" fill className="object-contain p-2 mix-blend-multiply dark:mix-blend-normal" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-300"><Box size={32}/></div>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <div className="font-black text-lg leading-tight text-[var(--foreground)] line-clamp-2">{data.productTitle}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{data.inventoryItem.item?.theme || 'LEGO'}</div>
                <div className="mt-2 font-black text-emerald-600 dark:text-emerald-400 text-2xl">
                  {formatMoney(data.inventoryItem.expectedSalePriceManual ?? data.inventoryItem.totalCost)}
                </div>
              </div>
            </div>
          ) : (
            <div className="font-bold text-lg text-[var(--foreground)]">{data.productTitle}</div>
          )}
          
          <div className="pt-6 mt-auto border-t border-[var(--border)]">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Created At</div>
            <div className="font-bold text-sm text-[var(--foreground)]">{new Date(data.createdAt).toLocaleString('uk-UA')}</div>
          </div>
        </div>
      </div>
    </div>
  );
}