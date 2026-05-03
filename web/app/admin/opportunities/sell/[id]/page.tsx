import { api } from '@/lib/api';
import { SectionCard } from '@/components/admin/section-card';
import { OpportunityStrategyBlock } from '@/components/admin/opportunity-strategy-block';
import { AddToRepriceFlowButton } from '@/components/admin/add-to-reprice-flow-button';

export default async function SellOpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await api.get<any>(`/opportunities/sell/${id}`);
  
  if (!item) return <div className="p-6 text-red-500 font-bold">Opportunity not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">{item.title}</h1>
        <AddToRepriceFlowButton inventoryItemId={item.inventoryItemId} />
      </div>
      <SectionCard title="Analytics & Strategy">
        <OpportunityStrategyBlock item={item} />
      </SectionCard>
    </div>
  );
}