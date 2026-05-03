import { api } from '@/lib/api';
import { SectionCard } from '@/components/admin/section-card';
import { ReserveRequestActions } from '@/components/admin/reserve-request-actions';
import { StatusPill } from '@/components/admin/status-pill';

export default async function AdminReserveDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await api.get<any>(`/public/reserve-requests/${id}`);
  
  if (!item) return <div className="p-6 text-red-500 font-bold">Reserve request not found</div>;

  return (
    <SectionCard title={`Reserve Request: ${item.id}`}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-5">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Product</div>
            <div className="font-semibold text-lg">{item.productTitle}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Status</div>
            <div className="mt-1"><StatusPill value={item.status} /></div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Customer Name</div>
            <div className="font-semibold">{item.name}</div>
          </div>
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contact Info</div>
            <div className="font-semibold">{item.contact}</div>
          </div>
        </div>
        {item.message && (
          <div className="rounded-xl border border-border p-5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Message</div>
            <div className="text-slate-800">{item.message}</div>
          </div>
        )}
        <div className="pt-4">
          <ReserveRequestActions id={item.id} />
        </div>
      </div>
    </SectionCard>
  );
}