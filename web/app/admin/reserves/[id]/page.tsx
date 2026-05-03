import { notFound } from 'next/navigation';
import { SectionCard } from '@/components/admin/section-card';
import { ReserveRequestActions } from '@/components/admin/reserve-request-actions';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ReserveDetailsPage({ params }: Props) {
  const { id } = await params;

  let reserve: any;
  try {
    reserve = await api.get(`/public/reserve-requests/${id}`);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">Reserve #{id}</h1>
        <StatusPill value={reserve.status} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Customer Information">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold uppercase text-slate-500">Name</div>
              <div className="mt-1 font-semibold">{reserve.name}</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-slate-500">Contact</div>
              <div className="mt-1 font-semibold">{reserve.contact}</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-slate-500">Message</div>
              <div className="mt-1 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                {reserve.message || 'No message provided.'}
              </div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-slate-500">Created At</div>
              <div className="mt-1 text-sm">{reserve.createdAt}</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Product Details">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-bold uppercase text-slate-500">Requested Title</div>
              <div className="mt-1 font-semibold">{reserve.productTitle}</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase text-slate-500">Inventory ID Bind</div>
              <div className="mt-1 font-mono text-sm">{reserve.inventoryItemId ?? 'Unbound'}</div>
            </div>
            <div className="pt-4">
              <div className="text-xs font-bold uppercase text-slate-500 mb-2">Actions</div>
              <ReserveRequestActions id={reserve.id} />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}