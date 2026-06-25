import { SectionCard } from '@/components/admin/section-card';
import { DataTable } from '@/components/admin/data-table';
import { api } from '@/lib/api';
import { StatusPill } from '@/components/admin/status-pill';
import { dict } from '@/lib/i18n';

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
  const t = (key: keyof typeof dict.uk) => dict.uk[key] || dict.en[key] || key;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 hardware-accelerated">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">{t('admin.activity.title' as any)}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">{t('admin.activity.subtitle' as any)}</p>
      </div>

      <SectionCard title={t('admin.activity.recent' as any)} contentClassName="p-0 sm:p-6">
        <DataTable
          rows={rows}
          emptyText={t('admin.activity.empty' as any)}
          getRowKey={(row) => row.id}
          columns={[
            {
              key: 'action',
              header: t('admin.activity.col.action' as any),
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
              header: t('common.category' as any),
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
              header: t('admin.activity.col.time' as any),
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