import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import type { ReserveRequest } from '@/lib/types';
import { SectionCard } from '@/components/admin/section-card';
import { ReserveRequestActions } from '@/components/admin/reserve-request-actions';
import { StatusPill } from '@/components/admin/status-pill';
import { ArrowLeft, User, Phone, MessageSquare, Box } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>;
};

async function getReserve(id: string): Promise<ReserveRequest | null> {
  try {
    return await api.get<ReserveRequest>(`/public/reserve-requests/${id}`);
  } catch {
    return null;
  }
}

export default async function ReserveDetailPage({ params }: Props) {
  const { id } = await params;
  const reserve = await getReserve(id);

  if (!reserve) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/reserves" 
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900">Order #{reserve.id.slice(-6)}</h1>
            <StatusPill value={reserve.status} />
          </div>
          <p className="mt-1 font-mono text-sm font-medium text-slate-500">Full ID: {reserve.id}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SectionCard title="Customer Information">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Name</div>
                <div className="text-lg font-bold text-slate-900">{reserve.name}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact</div>
                <div className="text-lg font-bold text-slate-900">{reserve.contact}</div>
              </div>
            </div>

            {reserve.message && (
              <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer Note</div>
                  <p className="mt-1 text-sm font-medium text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {reserve.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        <div className="space-y-6">
          <SectionCard title="Product Details">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Box className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Target Product</div>
                <div className="text-xl font-black text-slate-900">{reserve.productTitle}</div>
                {reserve.inventoryItemId && (
                  <Link 
                    href={`/admin/inventory/${reserve.inventoryItemId}`}
                    className="inline-block mt-2 font-mono text-sm text-blue-600 hover:underline"
                  >
                    Inv ID: {reserve.inventoryItemId}
                  </Link>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Order Management">
            <div className="space-y-4">
              <div className="text-sm font-medium text-slate-600 mb-4">
                Update the workflow status for this order. This will notify operators tracking the board.
              </div>
              <ReserveRequestActions id={reserve.id} currentStatus={reserve.status} />
              
              {reserve.adminNote && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Latest Admin Note</div>
                  <div className="text-sm font-mono text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {reserve.adminNote}
                  </div>
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}