import { SectionCard } from '@/components/admin/section-card';
import { MarketplaceQueueTable } from '@/components/admin/marketplace-queue-table';
import { api } from '@/lib/api';

export const revalidate = 0;

async function getMarketplaceQueue(): Promise<any[]> {
  try {
    return await api.get<any[]>('/marketplace/queue');
  } catch {
    return [];
  }
}

export default async function AdminMarketplacePage() {
  const rows = await getMarketplaceQueue();

  return (
    <div className="animate-fade-in-up space-y-6 hardware-accelerated">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Marketplace Approvals</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Review and approve listings submitted by community sellers.</p>
      </div>

      <SectionCard title="Pending Review" contentClassName="p-0 sm:p-6">
        <MarketplaceQueueTable rows={rows} />
      </SectionCard>
    </div>
  );
}