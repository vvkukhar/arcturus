import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { api } from '@/lib/api';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { OpportunityStrategyBlock } from '@/components/admin/opportunity-strategy-block';
import { AddToPurchaseFlowButton } from '@/components/admin/add-to-purchase-flow-button';
import { formatMoney, formatPercent } from '@/lib/format';
import { DataTable } from '@/components/admin/data-table';

async function getBuyDetail(itemId: string) {
  try {
    return await api.get<any>(`/opportunities/buy/${itemId}`);
  } catch {
    return null;
  }
}

export default async function AdminBuyOpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getBuyDetail(id);

  if (!data || !data.opportunity) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-2xl font-black text-slate-900">Opportunity Not Found</h2>
        <Link href="/admin/opportunities/buy" className="mt-4 text-blue-600 hover:underline">
          Return to Buy Opportunities
        </Link>
      </div>
    );
  }

  const { opportunity, item, listings, snapshots, decisions, soldComps } = data;

  return (
    <div className="space-y-6 animate-fade-in-up pb-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/opportunities/buy" className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-slate-900">{opportunity.title}</h1>
            <p className="text-sm font-mono text-slate-500 mt-1">Item ID: {opportunity.itemId} | Set: {item?.setNumber ?? 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill value={opportunity.action} />
          {opportunity.watchlistItemId && (
            <AddToPurchaseFlowButton watchlistItemId={opportunity.watchlistItemId} />
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title="Strategy & Economics">
            <OpportunityStrategyBlock item={opportunity} />
          </SectionCard>

          <SectionCard title="Active Market Listings">
            <DataTable
              rows={listings}
              emptyText="No active listings found."
              getRowKey={(row: any) => row.id}
              columns={[
                {
                  key: 'source',
                  header: 'Source',
                  render: (row: any) => <span className="font-mono text-sm">{row.sourceCode}</span>,
                },
                {
                  key: 'price',
                  header: 'Price',
                  render: (row: any) => <span className="font-bold">{formatMoney(row.price)}</span>,
                },
                {
                  key: 'shipping',
                  header: 'Shipping',
                  render: (row: any) => <span className="text-slate-500">{formatMoney(row.shippingPrice)}</span>,
                },
                {
                  key: 'link',
                  header: 'Link',
                  render: (row: any) => (
                    <a href={row.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">
                      View Listing
                    </a>
                  ),
                },
              ]}
            />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Recent Sold Comps">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {soldComps.length === 0 ? (
                <div className="text-sm text-slate-500">No sold comps available</div>
              ) : (
                soldComps.map((comp: any) => (
                  <div key={comp.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <div className="font-bold text-sm text-slate-900 line-clamp-1">{comp.title}</div>
                      <div className="text-xs text-slate-500 mt-1">{new Date(comp.soldAt).toLocaleDateString('uk-UA')} • {comp.sourceCode}</div>
                    </div>
                    <div className="font-black text-emerald-600">{formatMoney(comp.soldPrice)}</div>
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