import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { AddToPurchaseFlowButton } from '@/components/admin/add-to-purchase-flow-button';
import { formatMoney, formatPercent } from '@/lib/format';

type Props = { params: Promise<{ id: string }> };

export default async function BuyOpportunityDetail({ params }: Props) {
  const { id } = await params;
  let data: any;

  try {
    data = await api.get<any>(`/opportunities/buy/${id}`);
  } catch {
    notFound();
  }

  if (!data || !data.opportunity) notFound();

  const opp = data.opportunity;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">{opp.title}</h1>
          <p className="mt-1 text-sm text-slate-500 font-mono">Item ID: {opp.itemId}</p>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill value={opp.action} />
          {opp.watchlistItemId && <AddToPurchaseFlowButton watchlistItemId={opp.watchlistItemId} />}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <SectionCard title="Financials">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Buy Price</div>
              <div className="text-xl font-bold text-slate-900">{formatMoney(opp.totalBuy)}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Target Sell</div>
              <div className="text-xl font-bold text-blue-600">{formatMoney(opp.targetSellPrice)}</div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-500 uppercase">Est. Profit</div>
              <div className="text-2xl font-black text-emerald-600">{formatMoney(opp.profit)}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">ROI</div>
              <div className="text-xl font-black text-emerald-600">{formatPercent(opp.roi)}</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Strategy" className="md:col-span-2">
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="text-sm font-bold text-slate-900 mb-1">{opp.actionReasonPrimary}</div>
              <div className="text-sm text-slate-500">{opp.actionReasonSecondary}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Flip Strategy</div>
                <StatusPill value={opp.flipStrategy || 'Unknown'} />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-500 uppercase mb-1">Source</div>
                <div className="text-sm font-mono font-bold text-slate-700">{opp.sourceCode}</div>
              </div>
            </div>

            {opp.listingUrl && (
              <div className="pt-4">
                <a href={opp.listingUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 hover:underline">
                  View Listing on Marketplace &rarr;
                </a>
              </div>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}