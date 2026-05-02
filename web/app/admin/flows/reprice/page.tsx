import { DataTable } from '@/components/admin/data-table';
import { RowActions } from '@/components/admin/row-actions';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';

type RepriceFlowRow = {
  id: string;
  inventoryItemId: string;
  currentPrice?: number | null;
  suggestedPrice?: number | null;
  status: string;
};

async function getRows(): Promise<RepriceFlowRow[]> {
  try {
    return await api.get<RepriceFlowRow[]>('/flows/reprice');
  } catch {
    return [];
  }
}

export default async function AdminRepriceFlowPage() {
  const rows = await getRows();

  return (
    <SectionCard title="Reprice Flow">
      <DataTable
        rows={rows}
        emptyText="Reprice flow is empty"
        columns={[
          {
            key: 'id',
            header: 'Flow Item',
            render: (row) => (
              <div>
                <div className="font-bold">{row.inventoryItemId}</div>
                <div className="mt-1 text-xs text-slate-500">{row.id}</div>
              </div>
            ),
          },
          {
            key: 'current',
            header: 'Current',
            render: (row) => row.currentPrice ?? '—',
          },
          {
            key: 'suggested',
            header: 'Suggested',
            render: (row) => row.suggestedPrice ?? '—',
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
  );
}