import { DataTable } from '@/components/admin/data-table';
import { RowActions } from '@/components/admin/row-actions';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';
import type { ReviewFlowItem } from '@/lib/types';

async function getReviewFlow(): Promise<ReviewFlowItem[]> {
  try {
    return await api.get<ReviewFlowItem[]>('/flows/review');
  } catch {
    return [];
  }
}

export default async function AdminReviewFlowPage() {
  const rows = await getReviewFlow();

  return (
    <div className="animate-fade-in-up space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Review Flow Pipeline</h1>
        <p className="mt-1 text-sm text-slate-500">Items requiring manual review and verification.</p>
      </div>

      <SectionCard title="Review Queue">
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
                  <span className="font-bold text-slate-900">{row.inventoryItemId}</span>
                  <span className="mt-1 font-mono text-xs font-medium text-slate-400">ID: {row.id}</span>
                </div>
              ),
            },
            {
              key: 'reason',
              header: 'Reason for Review',
              render: (row) => (
                <span className="text-sm text-slate-700">
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
              render: () => <RowActions primaryLabel="Mark Reviewed" secondaryLabel="Remove" />,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}