'use client';

import { DataTable } from '@/components/admin/data-table';
import { StatusPill } from '@/components/admin/status-pill';
import { PurchaseFlowActions } from '@/components/admin/purchase-flow-actions';
import { formatMoney } from '@/lib/format';
import type { PurchaseFlowItem } from '@/lib/types';

interface ExtendedPurchaseFlowItem extends PurchaseFlowItem {
  watchlistItem?: {
    titleSnapshot?: string;
  };
}

type Props = {
  rows: ExtendedPurchaseFlowItem[];
};

export function PurchaseFlowTable({ rows }: Props) {
  return (
    <DataTable
      rows={rows}
      emptyText="The purchase flow pipeline is currently empty."
      getRowKey={(row) => row.id}
      columns={[
        {
          key: 'item',
          header: 'Target Item',
          render: (row) => (
            <div className="flex flex-col">
              <span className="font-bold text-[var(--foreground)]">{row.watchlistItem?.titleSnapshot ?? row.watchlistItemId}</span>
              <span className="mt-1 font-mono text-xs font-medium text-slate-400">ID: {row.id}</span>
            </div>
          ),
        },
        {
          key: 'price',
          header: 'Selected Price',
          render: (row) => (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {row.selectedPrice ? formatMoney(row.selectedPrice) : '—'}
            </span>
          ),
        },
        {
          key: 'status',
          header: 'Status',
          render: (row) => <StatusPill value={row.status} />,
        },
        {
          key: 'date',
          header: 'Added',
          render: (row) => (
            <span className="text-sm text-slate-500 font-mono">
              {row.createdAt ? new Date(row.createdAt).toLocaleDateString('uk-UA') : '—'}
            </span>
          ),
        },
        {
          key: 'actions',
          header: 'Actions',
          render: (row) => <PurchaseFlowActions id={row.id} selectedPrice={row.selectedPrice ?? null} />,
        },
      ]}
    />
  );
}