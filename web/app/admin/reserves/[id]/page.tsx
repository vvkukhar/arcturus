import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { SectionCard } from '@/components/admin/section-card';
import { ReserveRequestActions } from '@/components/admin/reserve-request-actions';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney } from '@/lib/format';
import type { ReserveRequest } from '@/lib/types';

type Props = { params: Promise<{ id: string }> };

export default async function AdminReserveDetailPage({ params }: Props) {
  const { id } = await params;
  let reserve: ReserveRequest & { inventoryItem?: any, orders?: any[] };

  try {
    reserve = await api.get<any>(`/public/reserve-requests/${id}`);
  } catch {
    notFound();
  }

  if (!reserve) notFound();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between bg-white p-6 rounded-[2rem] border border-border shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Request #{reserve.id.slice(-6).toUpperCase()}</h1>
          <p className="mt-1 text-sm text-slate-500 font-mono">Full ID: {reserve.id}</p>
        </div>
        <StatusPill value={reserve.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard title="Customer Details">
          <div className="space-y-5">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Name</div>
              <div className="text-lg font-bold text-slate-900">{reserve.name}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contact</div>
              <div className="text-lg font-mono font-medium text-blue-600 bg-blue-50 p-3 rounded-xl inline-block border border-blue-100">{reserve.contact}</div>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Message</div>
              <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-border leading-relaxed min-h-[100px]">
                {reserve.message || 'No additional message provided by customer.'}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Item & Financials">
          <div className="space-y-5">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Requested Product</div>
              <div className="text-lg font-bold text-slate-900">{reserve.productTitle}</div>
            </div>
            {reserve.inventoryItem ? (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cost Basis</div>
                  <div className="text-lg font-bold text-slate-700">{formatMoney(reserve.inventoryItem.totalCost)}</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Target Price</div>
                  <div className="text-lg font-black text-emerald-600">
                    {formatMoney(reserve.inventoryItem.expectedSalePriceManual ?? reserve.inventoryItem.totalCost)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-sm font-semibold">
                No specific inventory item linked. This might be a general request.
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Workflow Actions">
        <ReserveRequestActions id={reserve.id} currentStatus={reserve.status} />
      </SectionCard>
    </div>
  );
}