import { DataTable } from '@/components/admin/data-table';
import { RowActions } from '@/components/admin/row-actions';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';

interface UnresolvedRow {
  id: string;
  sourceCode: string;
  titleRaw: string;
  extractedSetNo?: string | null;
  status: string;
}

async function getUnresolvedRows(): Promise<UnresolvedRow[]> {
  try {
    return await api.get<UnresolvedRow[]>('/operator/unresolved-matches');
  } catch {
    return [];
  }
}

export default async function AdminOperatorUnresolvedPage() {
  const rows = await getUnresolvedRows();

  return (
    <div className="animate-fade-in-up space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Operator Queue</h1>
        <p className="mt-1 text-sm text-slate-500">Resolve scanner matches that could not be automatically identified.</p>
      </div>

      <SectionCard title="Unresolved Matches">
        <DataTable
          rows={rows}
          emptyText="No unresolved matches at the moment. Automation is doing great!"
          getRowKey={(row) => row.id}
          columns={[
            {
              key: 'title',
              header: 'Raw Listing Title',
              render: (row) => (
                <div className="flex flex-col max-w-md">
                  <span className="font-bold text-slate-900 truncate" title={row.titleRaw}>
                    {row.titleRaw}
                  </span>
                  <span className="mt-1 font-mono text-xs font-medium text-slate-400">ID: {row.id}</span>
                </div>
              ),
            },
            {
              key: 'source',
              header: 'Source',
              render: (row) => (
                <span className="font-mono text-sm text-slate-600">{row.sourceCode}</span>
              ),
            },
            {
              key: 'set',
              header: 'Extracted Set #',
              render: (row) => (
                <span className="font-semibold text-blue-600">
                  {row.extractedSetNo ?? '—'}
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
              render: () => <RowActions primaryLabel="Resolve" secondaryLabel="Dismiss" />,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}