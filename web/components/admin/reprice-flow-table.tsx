'use client';

import { DataTable } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney } from '@/lib/format';
import type { RepriceFlowItem } from '@/lib/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { Loader2, Check, Trash2 } from 'lucide-react';

interface ExtendedRepriceFlowItem extends RepriceFlowItem {
  inventoryItem?: { titleSnapshot?: string; };
  createdAt?: string;
}

export function RepriceFlowTable({ rows }: { rows: ExtendedRepriceFlowItem[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleMarkListed = async (id: string, suggestedPrice: number | null) => {
    const price = prompt('Confirm final listed price (UAH):', String(suggestedPrice || 0));
    if (price === null) return;
    try {
      setLoadingId(`listed-${id}`);
      await apiFetch('/api/proxy/flows/reprice/listed', {
        method: 'PATCH',
        body: JSON.stringify({ id, price: Number(price) }),
      });
      router.refresh();
    } catch (err: any) { alert(err.message || 'Failed to mark as listed'); } finally { setLoadingId(null); }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Remove from reprice flow?')) return;
    try {
      setLoadingId(`remove-${id}`);
      await apiFetch('/api/proxy/flows/reprice', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      router.refresh();
    } catch (err: any) { alert(err.message || 'Failed to remove'); } finally { setLoadingId(null); }
  };

  return (
    <DataTable
      rows={rows}
      emptyText="The reprice flow pipeline is currently empty."
      getRowKey={(row) => row.id}
      columns={[
        {
          key: 'id',
          header: 'Flow Item',
          render: (row) => (
            <div className="flex flex-col">
              <span className="font-bold text-[var(--foreground)]">{row.inventoryItem?.titleSnapshot ?? row.inventoryItemId}</span>
              <span className="mt-1 font-mono text-xs font-medium text-slate-400">ID: {row.id}</span>
            </div>
          ),
        },
        {
          key: 'current',
          header: 'Current Price',
          render: (row) => (
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {row.currentPrice ? formatMoney(row.currentPrice) : '—'}
            </span>
          ),
        },
        {
          key: 'suggested',
          header: 'Suggested Price',
          render: (row) => (
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {row.suggestedPrice ? formatMoney(row.suggestedPrice) : '—'}
            </span>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          render: (row) => <StatusPill value={row.status} />,
        },
        {
          key: 'actions',
          header: 'Actions',
          render: (row) => (
            <div className="flex items-center justify-end gap-2">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleMarkListed(row.id, row.suggestedPrice ?? null)} disabled={loadingId !== null}>
                {loadingId === `listed-${row.id}` ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Check className="h-4 w-4 mr-1.5" />}
                Mark Listed
              </Button>
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300" onClick={() => handleRemove(row.id)} disabled={loadingId !== null}>
                {loadingId === `remove-${row.id}` ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Trash2 className="h-4 w-4 mr-1.5" />}
                Remove
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
}