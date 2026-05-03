import { notFound } from 'next/navigation';
import { SectionCard } from '@/components/admin/section-card';
import { AddToRepriceFlowButton } from '@/components/admin/add-to-reprice-flow-button';
import { OpportunityStrategyBlock } from '@/components/admin/opportunity-strategy-block';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SellOpportunityPage({ params }: Props) {
  const { id } = await params;

  let opp: any;
  try {
    opp = await api.get(`/opportunities/sell/${id}`);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-3xl border border-border bg-white p-6 shadow-sm">
        <div>
          <div className="text-sm font-bold uppercase tracking-widest text-slate-500">Sell Opportunity</div>
          <h1 className="mt-1 text-3xl font-black">{opp.title}</h1>
          <div className="mt-2 text-sm font-semibold text-slate-600">Item ID: {opp.itemId} • Inventory ID: {opp.inventoryItemId}</div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-blue-600">Score {opp.score}</div>
          <div className="mt-2">
            <AddToRepriceFlowButton inventoryItemId={opp.inventoryItemId} />
          </div>
        </div>
      </div>

      <OpportunityStrategyBlock item={opp} />

      <SectionCard title="Financial Breakdown">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-slate-50 p-4 text-center">
            <div className="text-xs font-bold uppercase text-slate-500">Cost Basis</div>
            <div className="mt-1 text-xl font-black">{formatMoney(opp.totalCostBasis)}</div>
          </div>
          <div className="rounded-xl border border-border bg-slate-50 p-4 text-center">
            <div className="text-xs font-bold uppercase text-slate-500">Est. Profit</div>
            <div className="mt-1 text-xl font-black text-emerald-600">{formatMoney(opp.profit)}</div>
          </div>
          <div className="rounded-xl border border-border bg-slate-50 p-4 text-center">
            <div className="text-xs font-bold uppercase text-slate-500">Target Sell</div>
            <div className="mt-1 text-xl font-black">{formatMoney(opp.targetSellPrice)}</div>
          </div>
          <div className="rounded-xl border border-border bg-slate-50 p-4 text-center">
            <div className="text-xs font-bold uppercase text-slate-500">Current Market</div>
            <div className="mt-1 text-xl font-black">{formatMoney(opp.marketAverage)}</div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}