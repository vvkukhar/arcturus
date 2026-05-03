import Link from 'next/link';
import { AddToPurchaseFlowButton } from '@/components/admin/add-to-purchase-flow-button';
import { OpportunityStrategyBlock } from '@/components/admin/opportunity-strategy-block';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';
import { formatMoney, formatPercent } from '@/lib/format';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getOpportunity(id: string): Promise<any | null> {
  try {
    return await api.get(`/opportunities/buy/${id}`);
  } catch {
    return null;
  }
}

export default async function BuyOpportunityDetailsPage({ params }: Props) {
  const { id } = await params;
  const item = await getOpportunity(id);

  if (!item) {
    return (
      <SectionCard title="Buy Opportunity">
        <div className="text-sm text-slate-500">Opportunity not found.</div>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard title={item.title ?? 'Buy Opportunity'}>
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="text-sm text-slate-500">{item.itemId ?? id}</div>
              <StatusPill value={item.action ?? 'unknown'} />
            </div>

            {item.watchlistItemId ? (
              <AddToPurchaseFlowButton watchlistItemId={item.watchlistItemId} />
            ) : null}
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            <div className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase text-slate-500">Score</div>
              <div className="mt-1 text-lg font-black">{item.score ?? '—'}</div>
            </div>

            <div className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase text-slate-500">Buy</div>
              <div className="mt-1 text-lg font-black">{formatMoney(item.totalBuy)}</div>
            </div>

            <div className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase text-slate-500">Target Sell</div>
              <div className="mt-1 text-lg font-black">{formatMoney(item.targetSellPrice)}</div>
            </div>

            <div className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase text-slate-500">Profit</div>
              <div className="mt-1 text-lg font-black">{formatMoney(item.profit)}</div>
            </div>

            <div className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase text-slate-500">ROI</div>
              <div className="mt-1 text-lg font-black">{formatPercent(item.roi)}</div>
            </div>
          </div>

          <OpportunityStrategyBlock item={item} />

          <div className="rounded-2xl border border-border bg-white p-4">
            <div className="text-sm font-bold text-slate-500">Reason</div>
            <div className="mt-2 text-sm text-slate-700">
              {item.actionReasonPrimary ?? '—'}
            </div>
            {item.actionReasonSecondary ? (
              <div className="mt-1 text-sm text-slate-500">
                {item.actionReasonSecondary}
              </div>
            ) : null}
          </div>

          <Link
            href="/admin/opportunities/buy"
            className="inline-flex rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Back to Buy Opportunities
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}