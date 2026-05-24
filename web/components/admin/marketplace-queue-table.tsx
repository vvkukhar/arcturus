'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import { Loader2, Check, XCircle, Store } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type MarketplaceRow = {
  id: string;
  itemId: string;
  titleSnapshot: string;
  expectedSalePriceManual: number;
  sellerPayout: number;
  commissionRate: number;
  status: string;
  seller?: { email?: string; name?: string };
  images?: { imageUrl: string }[];
  notes?: string;
  createdAt: string;
};

export function MarketplaceQueueTable({ rows }: { rows: MarketplaceRow[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    try {
      setLoadingId(`approve-${id}`);
      await apiFetch(`/api/proxy/marketplace/approve/${id}`, { method: 'PATCH' });
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to approve listing');
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return;

    try {
      setLoadingId(`reject-${id}`);
      await apiFetch(`/api/proxy/marketplace/reject/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ reason }),
      });
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Failed to reject listing');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <DataTable
      rows={rows}
      emptyText="No pending marketplace submissions."
      getRowKey={(row) => row.id}
      columns={[
        {
          key: 'item',
          header: 'Asset & Seller',
          render: (row) => (
            <div className="flex items-center gap-4 max-w-[300px]">
              <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-[var(--border)]">
                {row.images?.[0]?.imageUrl ? (
                  <Image src={row.images[0].imageUrl} alt="" fill className="object-contain p-1 mix-blend-multiply dark:mix-blend-normal" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><Store size={20}/></div>
                )}
              </div>
              <div className="flex flex-col">
                <Link href={`/admin/inventory/${row.id}`} className="font-bold text-[var(--foreground)] hover:text-blue-600 line-clamp-1">
                  {row.titleSnapshot}
                </Link>
                <span className="mt-0.5 text-xs text-slate-500 font-medium">Seller: {row.seller?.email || row.seller?.name || 'Unknown'}</span>
              </div>
            </div>
          ),
        },
        {
          key: 'price',
          header: 'Target Price',
          render: (row) => (
            <div className="flex flex-col">
              <span className="font-bold text-blue-600 dark:text-blue-400">{formatMoney(row.expectedSalePriceManual)}</span>
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Client expects {formatMoney(row.sellerPayout)}</span>
            </div>
          ),
        },
        {
          key: 'commission',
          header: 'Commission',
          render: (row) => (
            <div className="flex flex-col">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {formatMoney(row.expectedSalePriceManual - row.sellerPayout)}
              </span>
              <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">{row.commissionRate}% rate</span>
            </div>
          ),
        },
        {
          key: 'notes',
          header: 'Seller Notes',
          render: (row) => (
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 line-clamp-2 max-w-[200px]" title={row.notes}>
              {row.notes || '—'}
            </span>
          ),
        },
        {
          key: 'actions',
          header: 'Actions',
          render: (row) => (
            <div className="flex items-center justify-end gap-2">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleApprove(row.id)} disabled={loadingId !== null}>
                {loadingId === `approve-${row.id}` ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Check className="h-4 w-4 mr-1.5" />}
                Approve
              </Button>
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300" onClick={() => handleReject(row.id)} disabled={loadingId !== null}>
                {loadingId === `reject-${row.id}` ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <XCircle className="h-4 w-4 mr-1.5" />}
                Reject
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
}