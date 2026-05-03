import Link from 'next/link';
import { ReserveRequestActions } from '@/components/admin/reserve-request-actions';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getReserve(id: string): Promise<any | null> {
  try {
    return await api.get(`/public/reserve-requests/${id}`);
  } catch {
    return null;
  }
}

export default async function ReserveDetailsPage({ params }: Props) {
  const { id } = await params;
  const reserve = await getReserve(id);

  if (!reserve) {
    return (
      <SectionCard title="Reserve Request">
        <div className="text-sm text-slate-500">Reserve request not found.</div>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard title={reserve.productTitle || 'Reserve Request'}>
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm text-slate-500">{reserve.id}</div>
              <div className="mt-2">
                <StatusPill value={reserve.status ?? 'unknown'} />
              </div>
            </div>

            <ReserveRequestActions id={reserve.id} />
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase text-slate-500">Customer</div>
              <div className="mt-1 font-bold">{reserve.name ?? '—'}</div>
              <div className="mt-1 text-sm text-slate-500">{reserve.contact ?? '—'}</div>
            </div>

            <div className="rounded-2xl border border-border bg-slate-50 p-4">
              <div className="text-xs font-bold uppercase text-slate-500">Inventory</div>
              <div className="mt-1 font-bold">{reserve.inventoryItemId ?? '—'}</div>
              <div className="mt-1 text-sm text-slate-500">{reserve.createdAt ?? '—'}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4">
            <div className="text-sm font-bold text-slate-500">Message</div>
            <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
              {reserve.message ?? '—'}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-4">
            <div className="text-sm font-bold text-slate-500">Admin Note</div>
            <div className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
              {reserve.adminNote ?? '—'}
            </div>
          </div>

          <Link
            href="/admin/reserves"
            className="inline-flex rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
          >
            Back to Reserves
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}