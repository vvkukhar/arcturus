import { DataTable } from '@/components/admin/data-table';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';

type DailyPlanRow = {
  order: number;
  type: string;
  title: string;
  reason: string;
};

async function getRows(): Promise<DailyPlanRow[]> {
  try {
    return await api.get<DailyPlanRow[]>('/planning/daily');
  } catch {
    return [];
  }
}

export default async function AdminPlanningDailyPage() {
  const rows = await getRows();

  return (
    <SectionCard title="Daily Planning">
      <DataTable
        rows={rows}
        emptyText="No daily plan tasks"
        columns={[
          {
            key: 'order',
            header: '#',
            render: (row) => row.order,
          },
          {
            key: 'title',
            header: 'Task',
            render: (row) => (
              <div>
                <div className="font-bold">{row.title}</div>
                <div className="mt-1 text-xs text-slate-500">{row.reason}</div>
              </div>
            ),
          },
          {
            key: 'type',
            header: 'Type',
            render: (row) => <StatusPill value={row.type} />,
          },
        ]}
      />
    </SectionCard>
  );
}