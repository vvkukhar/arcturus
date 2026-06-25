import { DataTable } from '@/components/admin/data-table';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';
import type { DailyPlanTask } from '@/lib/types';
import { dict } from '@/lib/i18n';

export const revalidate = 0;

async function getDailyPlan(): Promise<DailyPlanTask[]> {
  try {
    return await api.get<DailyPlanTask[]>('/planning/daily');
  } catch {
    return [];
  }
}

export default async function AdminPlanningDailyPage() {
  const rows = await getDailyPlan();
  const t = (key: keyof typeof dict.uk) => dict.uk[key] || dict.en[key] || key;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">{t('admin.planning.title' as any) || 'Daily Plan'}</h1>
        <p className="mt-1 text-sm text-slate-500">{t('admin.planning.subtitle' as any) || 'AI-generated task sequence to maximize operational efficiency today.'}</p>
      </div>

      <SectionCard title={t('admin.planning.actionItems' as any) || 'Action Items'} contentClassName="p-0 sm:p-6">
        <DataTable
          rows={rows}
          emptyText={t('admin.planning.empty' as any) || 'No daily plan tasks currently assigned. System is fully optimized.'}
          getRowKey={(row) => `${row.order}-${row.title}`}
          columns={[
            {
              key: 'order',
              header: '#',
              render: (row) => (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--background)] border border-[var(--border)] font-bold text-[var(--foreground)]">
                  {row.order}
                </div>
              ),
            },
            {
              key: 'title',
              header: t('admin.planning.col.task' as any) || 'Task & Objective',
              render: (row) => (
                <div className="flex flex-col">
                  <span className="font-bold text-[var(--foreground)]">{row.title}</span>
                  <span className="mt-1 text-sm text-slate-500">{row.reason}</span>
                </div>
              ),
            },
            {
              key: 'type',
              header: t('common.category' as any),
              render: (row) => <StatusPill value={row.type} />,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}