'use client';

import { DataTable } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';
import type { ReviewFlowItem } from '@/lib/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { Loader2, Check, Trash2 } from 'lucide-react';

interface ExtendedReviewFlowItem extends ReviewFlowItem {
  inventoryItem?: { titleSnapshot?: string; };
}

export function ReviewFlowTable({ rows }: { rows: ExtendedReviewFlowItem[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleMarkReviewed = async (id: string) => {
    const note = prompt('Add optional review note:');
    if (note === null) return;
    try {
      setLoadingId(`reviewed-${id}`);
      await apiFetch('/api/proxy/flows/review/done', {
        method: 'PATCH',
        body: JSON.stringify({ id, note }),
      });
      router.refresh();
    } catch (err: any) { alert(err.message); } finally { setLoadingId(null); }
  };

  const handleRemove = async (id: string) => {
    if (!confirm('Remove from review flow?')) return;
    try {
      setLoadingId(`remove-${id}`);
      await apiFetch('/api/proxy/flows/review', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      router.refresh();
    } catch (err: any) { alert(err.message); } finally { setLoadingId(null); }
  };

  return (
    <DataTable
      rows={rows}
      emptyText="No items require review at the moment."
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
          key: 'reason',
          header: 'Reason for Review',
          render: (row) => (
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {row.reason ?? 'No specific reason provided'}
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
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => handleMarkReviewed(row.id)} disabled={loadingId !== null}>
                {loadingId === `reviewed-${row.id}` ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Check className="h-4 w-4 mr-1.5" />}
                Mark Reviewed
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