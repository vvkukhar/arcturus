import { AddToRepriceFlowButton } from '@/components/admin/add-to-reprice-flow-button';
import { OpportunityStrategyBlock } from '@/components/admin/opportunity-strategy-block';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';
import { formatMoney, formatPercent } from '@/lib/format';

type Props = {
  params: Promise<{ id: string }>;
};

async function getData(): Promise<any[]> {
  try {
    return await api.get('/opportunities/sell?limit=100');
  } catch {
    return [];
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const rows = await getData();
  const item = rows.find((x) => x.itemId === id);

  if (!item) {
    return <SectionCard title="Not found">No data</SectionCard>;
  }

  return (
    <SectionCard title="Sell Opportunity Detail">
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-2xl font-black">{item.title}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusPill value={item.action} />
              <StatusPill value={item.flipStrategy ?? '—'} />
            </div>
          </div>
          <AddToRepriceFlowButton inventoryItemId={item.inventoryItemId} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div>Score: {item.score}</div>
          <div>Action: {item.action}</div>
          <div>Profit: {formatMoney(item.profit)}</div>
          <div>ROI: {formatPercent(item.roi)}</div>
          <div>Target Sell: {formatMoney(item.targetSellPrice)}</div>
          <div>Cost Basis: {formatMoney(item.totalCostBasis)}</div>
          <div>Margin: {formatPercent(item.marginPercent)}</div>
          <div>Confidence: {item.confidenceScore ?? '—'}</div>
        </div>
        <OpportunityStrategyBlock item={item} />
      </div>
    </SectionCard>
  );
}