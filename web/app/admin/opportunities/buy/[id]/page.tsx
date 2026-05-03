import { notFound } from 'next/navigation';
import { SectionCard } from '@/components/admin/section-card';
import { AddToPurchaseFlowButton } from '@/components/admin/add-to-purchase-flow-button';
import { OpportunityStrategyBlock } from '@/components/admin/opportunity-strategy-block';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BuyOpportunityPage({ params }: Props) {
  const { id } = await params;

  let opp: any;
  try {
    opp = await api.get(`/opportunities/buy/${id}`);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-3xl border border-border bg-white p-6 shadow-sm">
        <div>
          <div className="text-sm font-bold uppercase tracking-widest text-slate-500">Buy Opportunity</div>
          <h1 className="mt-1 text-3xl font-black">{opp.title}</h1>
          <div className="mt-2 text-sm font-semibold text-slate-600">Item ID: {opp.itemId} • Source: {opp.sourceCode}</div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-emerald-600">Score {opp.score}</div>
          <div className="mt-2">
            <AddToPurchaseFlowButton watchlistItemId={opp.watchlistItemId} />
          </div>
        </div>
      </div>

      <OpportunityStrategyBlock item={opp} />

      <SectionCard title="Market Metrics">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-slate-50 p-4 text-center">
            <div className="text-xs font-bold uppercase text-slate-500">Buy Price</div>
            <div className="mt-1 text-xl font-black">{formatMoney(opp.totalBuy)}</div>
          </div>
          <div className="rounded-xl border border-border bg-slate-50 p-4 text-center">
            <div className="text-xs font-bold uppercase text-slate-500">Est. Profit</div>
            <div className="mt-1 text-xl font-black text-emerald-600">{formatMoney(opp.profit)}</div>
          </div>
          <div className="rounded-xl border border-border bg-slate-50 p-4 text-center">
            <div className="text-xs font-bold uppercase text-slate-500">Max Buy Limit</div>
            <div className="mt-1 text-xl font-black">{formatMoney(opp.maxBuyPrice)}</div>
          </div>
          <div className="rounded-xl border border-border bg-slate-50 p-4 text-center">
            <div className="text-xs font-bold uppercase text-slate-500">Margin</div>
            <div className="mt-1 text-xl font-black">{opp.marginPercent}%</div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}