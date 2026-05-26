'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { AlertCircle, CheckCircle2, Clock, RotateCcw, XCircle, Loader2 } from 'lucide-react';
import { formatMoney } from '@/lib/format';
import { apiFetch } from '@/lib/api';
import { useState } from 'react';
import Image from 'next/image';

interface ReturnRequest {
  id: string;
  status: string;
  reason: string;
  refundAmount: number;
  quantity: number;
  inventoryItem?: {
    titleSnapshot: string;
    images?: { imageUrl: string }[];
  };
  sale?: {
    buyerName: string;
  };
}

interface ReturnsBoardData {
  requested: ReturnRequest[];
  approved: ReturnRequest[];
  rejected: ReturnRequest[];
  resolved: ReturnRequest[];
}

export function ReturnsBoard() {
  const { data, isLoading, mutate } = useSWR<ReturnsBoardData>('/api/admin/returns/board', swrFetcher, {
    refreshInterval: 15000
  });

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'resolve') => {
    let adminNote;
    if (action === 'reject') {
      adminNote = prompt('Enter reason for rejection:');
      if (adminNote === null) return;
    }

    if (action === 'resolve') {
      if (!confirm('Are you sure you want to finalize this return? This will restock the item if applicable and complete the refund.')) return;
    }

    try {
      setLoadingId(`${action}-${id}`);
      await apiFetch('/api/admin/returns/action', {
        method: 'PATCH',
        body: JSON.stringify({ id, action, adminNote }),
      });
      await mutate();
    } catch (err: any) {
      alert(err.message || `Failed to ${action} return request`);
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading && !data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  const board = data || { requested: [], approved: [], rejected: [], resolved: [] };

  const renderColumn = (title: string, items: ReturnRequest[], colorClass: string, headerClass: string, Icon: any, showActions: boolean) => (
    <div className="flex flex-col h-full rounded-[2rem] border border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-sm p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-500/20">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${headerClass}`}>
            <Icon size={18} />
          </div>
          <h3 className="text-lg font-black text-[var(--foreground)] tracking-tight">{title}</h3>
        </div>
        <span className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-black shadow-sm ${colorClass}`}>
          {items.length}
        </span>
      </div>
      
      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] text-sm font-bold text-slate-500 bg-[var(--background)]/50">
            Empty
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-all hover:border-blue-500/50 hover:shadow-md">
              <div className="flex items-start gap-3">
                <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-[var(--border)]">
                  {item.inventoryItem?.images?.[0]?.imageUrl ? (
                    <Image src={item.inventoryItem.images[0].imageUrl} alt="" fill className="object-contain p-1 mix-blend-multiply dark:mix-blend-normal" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300"><RotateCcw size={16}/></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[var(--foreground)] truncate leading-tight">{item.inventoryItem?.titleSnapshot}</div>
                  <div className="text-[10px] font-black uppercase text-slate-400 mt-1">Buyer: {item.sale?.buyerName || 'Unknown'}</div>
                </div>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                <div className="text-[10px] font-black uppercase tracking-widest text-red-500 mb-1">Reason for return</div>
                <div className="text-xs font-medium text-slate-700 dark:text-slate-300 line-clamp-2" title={item.reason}>{item.reason || 'No reason provided'}</div>
              </div>

              <div className="mt-3 flex items-end justify-between border-t border-[var(--border)] pt-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-slate-400">Refund</span>
                  <span className="font-black text-rose-600 dark:text-rose-400">{formatMoney(item.refundAmount)}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Qty: {item.quantity}</span>
              </div>

              {showActions && (
                <div className="mt-4 flex items-center gap-2">
                  {item.status === 'requested' && (
                    <>
                      <button disabled={loadingId !== null} onClick={() => handleAction(item.id, 'approve')} className="flex-1 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400 text-xs font-black uppercase tracking-wider rounded-xl transition-colors flex justify-center disabled:opacity-50">
                        {loadingId === `approve-${item.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Approve'}
                      </button>
                      <button disabled={loadingId !== null} onClick={() => handleAction(item.id, 'reject')} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xs font-black uppercase tracking-wider rounded-xl transition-colors flex justify-center disabled:opacity-50">
                        {loadingId === `reject-${item.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reject'}
                      </button>
                    </>
                  )}
                  {item.status === 'approved' && (
                    <button disabled={loadingId !== null} onClick={() => handleAction(item.id, 'resolve')} className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors flex justify-center shadow-lg shadow-blue-600/20 disabled:opacity-50">
                      {loadingId === `resolve-${item.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Resolve & Restock'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 overflow-hidden pb-4">
      {renderColumn('Requested', board.requested, 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-500', Clock, true)}
      {renderColumn('Approved', board.approved, 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-500', AlertCircle, true)}
      {renderColumn('Resolved', board.resolved, 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-500', CheckCircle2, false)}
      {renderColumn('Rejected', board.rejected, 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-500', XCircle, false)}
    </div>
  );
}