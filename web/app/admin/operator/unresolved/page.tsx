import { DataTable } from '@/components/admin/data-table';
import { RowActions } from '@/components/admin/row-actions';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';

type UnresolvedRow = {
  id: string;
  sourceCode: string;
  titleRaw: string;
  extractedSetNo?: string | null;
  status: string;
};

async function getRows(): Promise<UnresolvedRow[]> {
  try {
    return await api.get<UnresolvedRow[]>('/operator/unresolved-matches');
  } catch {
    return [];
  }
}

export default async function AdminOperatorUnresolvedPage() {
  const rows = await getRows();

  return (
    <SectionCard title="Operator Unresolved Queue">
      <DataTable
        rows={rows}
        emptyText="No unresolved matches"
        columns={[
          {
            key: 'title',
            header: 'Raw Listing',
            render: (row) => (
              <div>
                <div className="font-bold">{row.titleRaw}</div>
                <div className="mt-1 text-xs text-slate-500">{row.id}</div>
              </div>
            ),
          },
          {
            key: 'source',
            header: 'Source',
            render: (row) => row.sourceCode,
          },
          {
            key: 'set',
            header: 'Set #',
            render: (row) => row.extractedSetNo ?? '—',
          },
          {
            key: 'status',
            header: 'Status',
            render: (row) => <StatusPill value={row.status} />,
          },
          {
            key: 'actions',
            header: 'Actions',
            render: () => <RowActions primaryLabel="Resolve" secondaryLabel="Dismiss" />,
          },
        ]}
      />
    </SectionCard>
  );
}