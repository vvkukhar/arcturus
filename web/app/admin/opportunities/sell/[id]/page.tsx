import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import type { OpportunityItem } from '@/lib/types';
import { SectionCard } from '@/components/admin/section-card';
import { AddToRepriceFlowButton } from '@/components/admin/add-to-reprice-flow-button';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney, formatPercent } from '@/lib/format';

type Props = {
  params: Promise<{ id: string }>;
};

async function getSellOpportunity(id: string): Promise<OpportunityItem | null> {
  try {
    return await api.get<OpportunityItem>(`/opportunities/sell/${id}`);
  } catch {
    return null;
  }
}

export default async function SellOpportunityDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getSellOpportunity(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/opportunities/sell" 
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900">{item.title}</h1>
          <p className="mt-1 font-mono text-sm font-medium text-slate-500">ID: {item.itemId}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title="Opportunity Analysis">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Cost Basis</div>
                <div className="mt-1 text-2xl font-black text-slate-900">{formatMoney(item.totalCostBasis)}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Sell</div>
                <div className="mt-1 text-2xl font-black text-blue-600">{formatMoney(item.targetSellPrice)}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Est. Profit</div>
                <div className="mt-1 text-2xl font-black text-emerald-600">{formatMoney(item.profit)}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Est. ROI</div>
                <div className="mt-1 text-2xl font-black text-emerald-600">{formatPercent(item.roi)}</div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">AI Verdict</div>
              <div className="flex flex-wrap gap-2 mb-4">
                <StatusPill value={item.action} />
                <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold tracking-wide text-slate-700">
                  SCORE: {item.score.toFixed(0)}
                </span>
                {item.flipStrategy && (
                  <span className="inline-flex items-center rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-bold tracking-wide text-indigo-700">
                    STRATEGY: {item.flipStrategy}
                  </span>
                )}
              </div>
              <div className="space-y-2 text-sm font-medium text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p><strong>Primary Reason:</strong> {item.actionReasonPrimary}</p>
                {item.actionReasonSecondary && <p><strong>Secondary Reason:</strong> {item.actionReasonSecondary}</p>}
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Actions">
            <div className="space-y-4">
              <div className="text-sm font-medium text-slate-600">
                Market conditions indicate it's a good time to sell. Send this item to the Reprice Flow to prepare the listing.
              </div>
              {item.inventoryItemId ? (
                <AddToRepriceFlowButton inventoryItemId={item.inventoryItemId} />
              ) : (
                <div className="text-sm text-amber-600 font-semibold bg-amber-50 p-3 rounded-xl border border-amber-200">
                  Not linked to an Inventory Item.
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}