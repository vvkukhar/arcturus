import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { OpportunityStrategyBlock } from '@/components/admin/opportunity-strategy-block';
import { AddToRepriceFlowButton } from '@/components/admin/add-to-reprice-flow-button';
import { formatMoney } from '@/lib/format';
import { DataTable } from '@/components/admin/data-table';

async function getSellDetail(itemId: string) {
  try {
    return await api.get<any>(`/opportunities/sell/${itemId}`);
  } catch {
    return null;
  }
}

export default async function AdminSellOpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getSellDetail(id);

  if (!data || !data.opportunity) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-black text-slate-900">Opportunity Not Found</h2>
        <Link href="/admin/opportunities/sell" className="mt-4 text-blue-600 hover:underline">
          Return to Sell Opportunities
        </Link>
      </div>
    );
  }

  const { opportunity, item, inventory, listings, soldComps } = data;

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/opportunities/sell" className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900">{opportunity.title}</h1>
            <p className="text-sm font-mono text-slate-500 mt-1">Item ID: {opportunity.itemId} | Set: {item?.setNumber ?? 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill value={opportunity.action} />
          {opportunity.inventoryItemId && (
            <AddToRepriceFlowButton inventoryItemId={opportunity.inventoryItemId} />
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title="Strategy & Economics">
            <OpportunityStrategyBlock item={opportunity} />
          </SectionCard>

          <SectionCard title="Your Inventory Positions">
             <DataTable
              rows={inventory}
              emptyText="No active inventory found."
              getRowKey={(row: any) => row.id}
              columns={[
                {
                  key: 'id',
                  header: 'Inventory ID',
                  render: (row: any) => <span className="font-mono text-sm">{row.id}</span>,
                },
                {
                  key: 'qty',
                  header: 'Qty',
                  render: (row: any) => <span className="font-bold">{row.quantity}</span>,
                },
                {
                  key: 'cost',
                  header: 'Cost Basis',
                  render: (row: any) => <span className="text-slate-700">{formatMoney(row.totalCost)}</span>,
                },
                {
                  key: 'manual',
                  header: 'Current Price',
                  render: (row: any) => <span className="font-bold text-blue-600">{formatMoney(row.expectedSalePriceManual)}</span>,
                },
              ]}
            />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Market Competition">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {listings.length === 0 ? (
                <div className="text-sm text-slate-500">No active listings</div>
              ) : (
                listings.slice(0, 15).map((listing: any) => (
                  <div key={listing.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <div className="font-bold text-sm text-slate-900 line-clamp-1">{listing.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{listing.sourceCode} • {listing.condition}</div>
                    </div>
                    <div className="font-black text-slate-900">{formatMoney(listing.price)}</div>
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}