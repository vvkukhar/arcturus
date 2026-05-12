import { SectionCard } from '@/components/admin/section-card';
import { DataTable } from '@/components/admin/data-table';
import { api } from '@/lib/api';
import { StatusPill } from '@/components/admin/status-pill';

export const revalidate = 0;

interface ActivityLog {
  id: string;
  action: string;
  createdAt: string;
  payloadJson?: Record<string, unknown>;
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 hardware-accelerated">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">System Activity</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Immutable audit log of all system actions.</p>
      </div>

      <SectionCard title="Recent Activity" contentClassName="p-0 sm:p-6">
        <DataTable
          rows={rows}
          emptyText="No recent activity found."
          getRowKey={(row) => row.id}
          columns={[
            {
              key: 'action',
              header: 'Action / Event',
              render: (row) => (
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-[var(--foreground)]">{row.action}</span>
                  {row.payloadJson && (
                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-md">
                      {JSON.stringify(row.payloadJson)}
                    </span>
                  )}
                </div>
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