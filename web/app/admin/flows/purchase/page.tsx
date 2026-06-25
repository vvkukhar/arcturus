import { SectionCard } from '@/components/admin/section-card';
import { PurchaseFlowTable } from '@/components/admin/purchase-flow-table';
import { api } from '@/lib/api';
import type { PurchaseFlowItem } from '@/lib/types';
import { dict } from '@/lib/i18n';

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
  const t = (key: keyof typeof dict.uk) => dict.uk[key] || dict.en[key] || key;

  return (
    <div className="animate-fade-in-up space-y-6 hardware-accelerated">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">{t('admin.flows.purchase.title' as any)}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">{t('admin.flows.purchase.subtitle' as any)}</p>
      </div>

      <SectionCard title={t('admin.flows.purchase.pending' as any)} contentClassName="p-0 sm:p-6">
        <PurchaseFlowTable rows={rows} />
      </SectionCard>
    </div>
  );
}