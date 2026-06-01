'use client';

import { use } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Loader2, Package, User, Box, Plane, Store } from 'lucide-react';
import { ReserveRequestActions } from '@/components/admin/reserve-request-actions';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney } from '@/lib/format';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function ReserveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  
  const { data, isLoading } = useSWR<any>(`/api/admin/reserves/${id}`, swrFetcher);
  const { data: dropshipOptions, isLoading: dropshipLoading } = useSWR<any[]>(
    data && !data.inventoryItem && data.status === 'pending' ? `/api/admin/reserves/${id}/dropship` : null, 
    swrFetcher
  );

  if (isLoading) return <div className="flex h-[calc(100vh-8rem)] items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>;
  if (!data) return <div className="flex h-[calc(100vh-8rem)] items-center justify-center font-bold text-slate-500">Reserve request not found</div>;

  const imageUrl = data.inventoryItem?.images?.[0]?.imageUrl;
  const isZeroTouchAvailable = !data.inventoryItem && data.status === 'pending' && Array.isArray(dropshipOptions) && dropshipOptions.length > 0;

  const handleApproveDropship = async (listingId: string, supplierCost: number) => {
    if (!confirm('Ви дійсно хочете підтвердити дропшиппінг з цього лістингу? Буде створено замовлення на закупівлю (Purchase Order) та схвалено замовлення клієнта.')) return;
    try {
      await apiFetch('/api/admin/orders/approve-dropship', {
        method: 'POST',
        body: JSON.stringify({ reserveRequestId: id, listingId, supplierCost })
      });
      toast.success('Zero-Touch Fulfillment успішно активовано!');
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || 'Помилка підтвердження дропшипу');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Reserve Details</h1>
          <p className="mt-1 text-sm font-mono text-slate-500">ID: {data.id}</p>
        </div>
        <div className="flex flex-col sm:items-end gap-3">
          <StatusPill value={data.status} />
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
            <div className="flex flex-col h-full">
              <div className="font-bold text-lg text-[var(--foreground)] bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-[var(--border)]">{data.productTitle}</div>
              <div className="mt-4 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-bold flex items-center gap-2">
                <Plane size={16} /> Набору немає в інвентарі (Out of Stock Request)
              </div>
            </div>
          )}
          
          <div className="pt-6 mt-auto border-t border-[var(--border)]">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Created At</div>
            <div className="font-bold text-sm text-[var(--foreground)]">{new Date(data.createdAt).toLocaleString('uk-UA')}</div>
          </div>
        </div>
      </div>

      {isZeroTouchAvailable && (
        <div className="bg-[var(--card)] border border-indigo-200 dark:border-indigo-900/50 rounded-[2rem] p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-xl flex items-center justify-center">
              <Store size={20} />
            </div>
            <div>
              <h3 className="font-black text-xl text-[var(--foreground)]">Zero-Touch Fulfillment Options</h3>
              <p className="text-sm font-medium text-slate-500">Система знайшла цей набір у інших продавців з достатньою маржею для дропшипу.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dropshipOptions.map((opt: any) => {
              const p = opt.payloadJson;
              return (
                <div key={opt.id} className="p-5 bg-[var(--background)] border border-[var(--border)] rounded-2xl flex flex-col justify-between group hover:border-indigo-500/30 transition-colors">
                  <div className="mb-4">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 flex justify-between">
                      <span>Source Listing</span>
                      <a href={p.listingUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Link</a>
                    </div>
                    <div className="font-bold text-[var(--foreground)] line-clamp-1">{data.productTitle}</div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-500">Ціна постачальника</span>
                      <span className="font-bold text-rose-500">{formatMoney(p.cost)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-500">Клієнт заплатить</span>
                      <span className="font-bold text-blue-500">{formatMoney(p.clientPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-[var(--border)]">
                      <span className="font-black text-[10px] uppercase text-slate-400 tracking-widest">Наш чистий профіт</span>
                      <span className="font-black text-emerald-500">{formatMoney(p.profit)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleApproveDropship(p.listingId, p.cost)}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                  >
                    Підтвердити Дропшип
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}