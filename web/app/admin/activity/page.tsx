import { SectionCard } from '@/components/admin/section-card';
import { DataTable } from '@/components/admin/data-table';
import { api } from '@/lib/api';
import { StatusPill } from '@/components/admin/status-pill';

interface ActivityLog {
  id: string;
  action: string;
  createdAt: string;
}

async function getActivityLogs(): Promise<ActivityLog[]> {
  try {
    return await api.get<ActivityLog[]>('/activity');
  } catch {
    return [];
  }
}

export default async function ActivityPage() {
  const rows = await getActivityLogs();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900">System Activity</h1>
        <p className="mt-1 text-sm text-slate-500">Immutable audit log of all system actions.</p>
      </div>

      <SectionCard title="Recent Activity">
        <DataTable
          rows={rows}
          emptyText="No recent activity found."
          getRowKey={(row) => row.id}
          columns={[
            {
              key: 'action',
              header: 'Action / Event',
              render: (row) => (
                <span className="font-semibold text-slate-800">{row.action}</span>
              ),
            },
            {
              key: 'type',
              header: 'Category',
              render: (row) => {
                const lower = row.action.toLowerCase();
                let cat = 'System';
                if (lower.includes('inventory')) cat = 'Inventory';
                if (lower.includes('sale')) cat = 'Sales';
                if (lower.includes('user')) cat = 'Users';
                return <StatusPill value={cat} />;
              },
            },
            {
              key: 'createdAt',
              header: 'Timestamp',
              render: (row) => (
                <span className="text-sm font-mono text-slate-500">
                  {new Date(row.createdAt).toLocaleString('uk-UA')}
                </span>
              ),
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}