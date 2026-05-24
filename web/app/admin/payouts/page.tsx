import { SectionCard } from '@/components/admin/section-card';
import { PayoutsTable } from '@/components/admin/payouts-table';
import { api } from '@/lib/api';

export const revalidate = 0;

async function getPendingPayouts(): Promise<any[]> {
  try {
    return await api.get<any[]>('/sales/payouts/pending');
  } catch {
    return [];
  }
}

export default async function AdminPayoutsPage() {
  const rows = await getPendingPayouts();

  return (
    <div className="animate-fade-in-up space-y-6 hardware-accelerated">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Marketplace Payouts</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Manage pending payouts to community sellers.</p>
      </div>

      <SectionCard title="Pending Settlements" contentClassName="p-0 sm:p-6">
        <PayoutsTable rows={rows} />
      </SectionCard>
    </div>
  );
}