import { DataTable } from '@/components/admin/data-table';
import { RowActions } from '@/components/admin/row-actions';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';
import type { ReviewFlowItem } from '@/lib/types';

export const revalidate = 0;

interface ExtendedReviewFlowItem extends ReviewFlowItem {
  inventoryItem?: {
    titleSnapshot?: string;
  };
}

async function getReviewFlow(): Promise<ExtendedReviewFlowItem[]> {
  try {
    return await api.get<ExtendedReviewFlowItem[]>('/flows/review');
  } catch {
    return [];
  }
}

export default async function AdminReviewFlowPage() {
  const rows = await getReviewFlow();

  return (
    <div className="animate-fade-in-up space-y-6 hardware-accelerated">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Review Flow Pipeline</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Items requiring manual review and verification by an operator.</p>
      </div>

      <SectionCard title="Review Queue" contentClassName="p-0 sm:p-6">
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
              render: () => <RowActions primaryLabel="Mark Reviewed" secondaryLabel="Remove" />,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}