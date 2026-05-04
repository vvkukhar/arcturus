import { DataTable } from '@/components/admin/data-table';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';
import type { DailyPlanTask } from '@/lib/types';

async function getDailyPlan(): Promise<DailyPlanTask[]> {
  try {
    return await api.get<DailyPlanTask[]>('/planning/daily');
  } catch {
    return [];
  }
}

export default async function AdminPlanningDailyPage() {
  const rows = await getDailyPlan();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Daily Plan</h1>
        <p className="mt-1 text-sm text-slate-500">AI-generated task sequence to maximize operational efficiency today.</p>
      </div>

      <SectionCard title="Action Items">
        <DataTable
          rows={rows}
          emptyText="No daily plan tasks currently assigned."
          getRowKey={(row) => `${row.order}-${row.title}`}
          columns={[
            {
              key: 'order',
              header: '#',
              render: (row) => (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-500">
                  {row.order}
                </div>
              ),
            },
            {
              key: 'title',
              header: 'Task & Objective',
              render: (row) => (
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900">{row.title}</span>
                  <span className="mt-1 text-sm text-slate-500">{row.reason}</span>
                </div>
              ),
            },
            {
              key: 'type',
              header: 'Category',
              render: (row) => <StatusPill value={row.type} />,
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}