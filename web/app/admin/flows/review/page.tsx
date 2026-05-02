import { DataTable } from '@/components/admin/data-table';
import { RowActions } from '@/components/admin/row-actions';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';

type ReviewFlowRow = {
  id: string;
  inventoryItemId: string;
  status: string;
  reason?: string | null;
};

async function getRows(): Promise<ReviewFlowRow[]> {
  try {
    return await api.get<ReviewFlowRow[]>('/flows/review');
  } catch {
    return [];
  }
}

export default async function AdminReviewFlowPage() {
  const rows = await getRows();

  return (
    <SectionCard title="Review Flow">
      <DataTable
        rows={rows}
        emptyText="Review flow is empty"
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
            key: 'reason',
            header: 'Reason',
            render: (row) => row.reason ?? '—',
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusPill value={row.status} />,
          },
          {
            key: 'actions',
            header: 'Actions',
            render: () => <RowActions primaryLabel="Mark Reviewed" secondaryLabel="Remove" />,
          },
        ]}
      />
    </SectionCard>
  );
}