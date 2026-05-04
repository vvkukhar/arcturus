import { DataTable } from '@/components/admin/data-table';
import { RowActions } from '@/components/admin/row-actions';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import type { PurchaseFlowItem } from '@/lib/types';

async function getPurchaseFlow(): Promise<PurchaseFlowItem[]> {
  try {
    return await api.get<PurchaseFlowItem[]>('/flows/purchase');
  } catch {
    return [];
  }
}

export default async function AdminPurchaseFlowPage() {
  const rows = await getPurchaseFlow();

  return (
    <SectionCard title="Purchase Flow Pipeline">
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
                <span className="font-bold text-slate-900">{row.watchlistItemId}</span>
                <span className="mt-1 font-mono text-xs font-medium text-slate-400">ID: {row.id}</span>
              </div>
            ),
          },
          {
            key: 'price',
            header: 'Selected Price',
            render: (row) => (
              <span className="font-semibold text-slate-700">
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
              <span className="text-sm text-slate-500">
                {row.createdAt ? new Date(row.createdAt).toLocaleDateString('uk-UA') : '—'}
              </span>
            ),
          },
          {
            key: 'actions',
            header: 'Actions',
            render: () => <RowActions primaryLabel="Mark Bought" secondaryLabel="Remove" />,
          },
        ]}
      />
    </SectionCard>
  );
}