import { ReserveRequestActions } from '@/components/admin/reserve-request-actions';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';
type Props = {
 params: Promise<{ id: string }>;
};
async function getRows(): Promise<any[]> {
 try {
  return await api.get('/public/reserve-requests');
 } catch {
  return [];
 }
}
export default async function Page({ params }: Props) {
 const { id } = await params;
 const rows = await getRows();
 const item = rows.find((x) => x.id === id);
 if (!item) {
  return <SectionCard title="Not found">No data</SectionCard>;
 }
 return (
  <SectionCard title="Reserve Request Detail">
   <div className="space-y-4">
    <div className="text-2xl font-black">{item.productTitle || 'Reserve Request'}</div>
    <div className="grid gap-4 md:grid-cols-2">
     <div>Name: {item.name}</div>
     <div>Contact: {item.contact}</div>
     <div>Inventory Item: {item.inventoryItemId ?? '—'}</div>
     <div>
      Status: <StatusPill value={item.status} />
     </div>
     <div>Created: {item.createdAt ?? '—'}</div>
     <div>Admin Note: {item.adminNote ?? '—'}</div>
    </div>
    <div>
     <div className="mb-2 text-sm font-bold text-slate-500">Message</div>
     <div className="rounded-2xl border border-border bg-slate-50 p-4 text-sm">
      {item.message ?? '—'}
     </div>
    </div>
    <ReserveRequestActions id={item.id} />
   </div>
  </SectionCard>
 );
}