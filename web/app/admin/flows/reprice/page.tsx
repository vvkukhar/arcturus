import { SectionCard } from '@/components/admin/section-card';
import { RepriceFlowTable } from '@/components/admin/reprice-flow-table';
import { api } from '@/lib/api';
import type { RepriceFlowItem } from '@/lib/types';
import { dict } from '@/lib/i18n';

export const revalidate = 0;

interface ExtendedRepriceFlowItem extends RepriceFlowItem {
  inventoryItem?: {
    titleSnapshot?: string;
  };
  createdAt?: string;
}

async function getRepriceFlow(): Promise<ExtendedRepriceFlowItem[]> {
  try {
    return await api.get<ExtendedRepriceFlowItem[]>('/flows/reprice');
  } catch {
    return [];
  }
}

export default async function AdminRepriceFlowPage() {
  const rows = await getRepriceFlow();
  const t = (key: keyof typeof dict.uk) => dict.uk[key] || dict.en[key] || key;

  return (
    <div className="animate-fade-in-up space-y-6 hardware-accelerated">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">{t('admin.flows.reprice.title' as any)}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">{t('admin.flows.reprice.subtitle' as any)}</p>
      </div>

      <SectionCard title={t('admin.dashboard.repriceQueue' as any)} contentClassName="p-0 sm:p-6">
        <RepriceFlowTable rows={rows} />
      </SectionCard>
    </div>
  );
}