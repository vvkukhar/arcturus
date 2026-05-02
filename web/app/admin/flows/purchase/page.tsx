import { DataTable } from '@/components/admin/data-table';
import { RowActions } from '@/components/admin/row-actions';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';

type PurchaseFlowRow = {
  id: string;
  watchlistItemId: string;
  selectedPrice: number;
  status: string;
  createdAt?: string;
};

async function getRows(): Promise<PurchaseFlowRow[]> {
  try {
    return await api.get<PurchaseFlowRow[]>('/flows/purchase');
  } catch {
    return [];
  }
}

export default async function AdminPurchaseFlowPage() {
  const rows = await getRows();

  return (
    <SectionCard title="Purchase Flow">
      <DataTable
        rows={rows}
        emptyText="Purchase flow is empty"
        columns={[
          {
            key: 'id',
            header: 'Flow Item',
            render: (row) => (
              <div>
                <div className="font-bold">{row.watchlistItemId}</div>
                <div className="mt-1 text-xs text-slate-500">{row.id}</div>
              </div>
            ),
          },
          {
            key: 'price',
            header: 'Selected Price',
            render: (row) => (row.selectedPrice ? row.selectedPrice : '—'),
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusPill value={row.status} />,
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