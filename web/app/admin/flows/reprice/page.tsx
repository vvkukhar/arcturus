import { DataTable } from '@/components/admin/data-table';
import { RowActions } from '@/components/admin/row-actions';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';
import type { RepriceFlowItem } from '@/lib/types';

async function getRepriceFlow(): Promise<RepriceFlowItem[]> {
  try {
    return await api.get<RepriceFlowItem[]>('/flows/reprice');
  } catch {
    return [];
  }
}

export default async function AdminRepriceFlowPage() {
  const rows = await getRepriceFlow();

  return (
    <div className="animate-fade-in-up space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Reprice Flow Pipeline</h1>
        <p className="mt-1 text-sm text-slate-500">Manage items waiting to be repriced and listed.</p>
      </div>

      <SectionCard title="Reprice Queue">
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
                  <span className="font-bold text-slate-900">{row.inventoryItemId}</span>
                  <span className="mt-1 font-mono text-xs font-medium text-slate-400">ID: {row.id}</span>
                </div>
              ),
            },
            {
              key: 'current',
              header: 'Current Price',
              render: (row) => (
                <span className="font-medium text-slate-700">
                  {row.currentPrice ? formatMoney(row.currentPrice) : '—'}
                </span>
              ),
            },
            {
              key: 'suggested',
              header: 'Suggested Price',
              render: (row) => (
                <span className="font-bold text-blue-600">
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
              render: () => <RowActions primaryLabel="Mark Listed" secondaryLabel="Remove" />,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}