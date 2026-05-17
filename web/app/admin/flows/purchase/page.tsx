import { DataTable } from '@/components/admin/data-table';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { PurchaseFlowActions } from '@/components/admin/purchase-flow-actions';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import type { PurchaseFlowItem } from '@/lib/types';

export const revalidate = 0;

interface ExtendedPurchaseFlowItem extends PurchaseFlowItem {
  watchlistItem?: {
    titleSnapshot?: string;
  };
}

async function getPurchaseFlow(): Promise<ExtendedPurchaseFlowItem[]> {
  try {
    return await api.get<ExtendedPurchaseFlowItem[]>('/flows/purchase');
  } catch {
    return [];
  }
}

export default async function AdminPurchaseFlowPage() {
  const rows = await getPurchaseFlow();

  return (
    <div className="animate-fade-in-up space-y-6 hardware-accelerated">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Purchase Flow Pipeline</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Monitor and execute approved purchase opportunities.</p>
      </div>

      <SectionCard title="Pending Execution" contentClassName="p-0 sm:p-6">
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
      </SectionCard>
    </div>
  );
}