import { SectionCard } from '@/components/admin/section-card';
import { ReviewFlowTable } from '@/components/admin/review-flow-table';
import { api } from '@/lib/api';
import type { ReviewFlowItem } from '@/lib/types';

export const revalidate = 0;

interface ExtendedReviewFlowItem extends ReviewFlowItem {
  inventoryItem?: {
    titleSnapshot?: string;
  };
}

async function getReviewFlow(): Promise<ExtendedReviewFlowItem[]> {
  try {
    return await api.get<ExtendedReviewFlowItem[]>('/flows/review');
  } catch {
    return [];
  }
}

export default async function AdminReviewFlowPage() {
  const rows = await getReviewFlow();

  return (
    <div className="animate-fade-in-up space-y-6 hardware-accelerated">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Review Flow Pipeline</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Items requiring manual review and verification by an operator.</p>
      </div>

      <SectionCard title="Review Queue" contentClassName="p-0 sm:p-6">
        <ReviewFlowTable rows={rows} />
      </SectionCard>
    </div>
  );
}