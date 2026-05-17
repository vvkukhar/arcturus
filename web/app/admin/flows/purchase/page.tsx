import { SectionCard } from '@/components/admin/section-card';
import { PurchaseFlowTable } from '@/components/admin/purchase-flow-table';
import { api } from '@/lib/api';
import type { PurchaseFlowItem } from '@/lib/types';

export const revalidate = 0;

interface ExtendedPurchaseFlowItem extends PurchaseFlowItem {
  watchlistItem?: {
    titleSnapshot?: string;
  };
}

async function getPurchaseFlow(): Promise<ExtendedPurchaseFlowItem[]> {
  try {
    return await api.get<ExtendedPurchaseFlowItem[]>('/flows/purchase');
  } catch {
    return [];
  }
}

export default async function AdminPurchaseFlowPage() {
  const rows = await getPurchaseFlow();

  return (
    <div className="animate-fade-in-up space-y-6 hardware-accelerated">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Purchase Flow Pipeline</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Monitor and execute approved purchase opportunities.</p>
      </div>

      <SectionCard title="Pending Execution" contentClassName="p-0 sm:p-6">
        <PurchaseFlowTable rows={rows} />
      </SectionCard>
    </div>
  );
}