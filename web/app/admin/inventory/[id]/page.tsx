import Image from 'next/image';
import { AddToRepriceFlowButton } from '@/components/admin/add-to-reprice-flowbutton';
import { ImageGalleryManager } from '@/components/admin/image-gallery-manager';
import { ImageUploadForm } from '@/components/admin/image-upload-form';
import { InventoryEditDialog } from '@/components/admin/inventory-edit-dialog';
import { SectionCard } from '@/components/admin/section-card';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';
type Props = {
 params: Promise<{ id: string }>;
};
async function getData(): Promise<any[]> {
 try {
  return await api.get('/inventory');
 } catch {
  return [];
 }
}
export default async function Page({ params }: Props) {
 const { id } = await params;
 const rows = await getData();
 const item = rows.find((x) => x.id === id);
 if (!item) {
  return <SectionCard title="Not found">No data</SectionCard>;
 }
 const primaryImage = item.images?.[0]?.imageUrl ?? item.imageUrl ?? null;
 return (
  <SectionCard title="Inventory Item">
   <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
    <div className="space-y-4">
     <div className="text-2xl font-black">{item.titleSnapshot}</div>
     <div className="overflow-hidden rounded-3xl border border-border bg-slate-100">
      {primaryImage ? (
       <Image
        src={primaryImage}
        alt={item.titleSnapshot}
        width={1200}
        height={900}
        className="h-auto w-full object-cover"
       />
      ) : (
       <div className="aspect-[4/3]" />
      )}
     </div>
     <ImageUploadForm inventoryItemId={item.id} />
     <ImageGalleryManager images={item.images ?? []} />
    </div>
    <div className="space-y-4">
     <div className="grid gap-4 md:grid-cols-2">
      <div>Buy Price: {formatMoney(item.purchasePrice)}</div>
      <div>Total Cost: {formatMoney(item.totalCost)}</div>
      <div>Quantity: {item.quantity}</div>
      <div>Condition: {item.condition}</div>
      <div>Sealed: {String(item.sealed)}</div>
      <div>Theme: {item.item?.theme ?? '—'}</div>
      <div>Set Number: {item.item?.setNumber ?? '—'}</div>
      <div>Manual Sell: {formatMoney(item.expectedSalePriceManual)}</div>
     </div>
     <div className="flex flex-wrap gap-2">
      <InventoryEditDialog item={item} />
      <AddToRepriceFlowButton inventoryItemId={item.id} />
     </div>
    </div>
   </div>
  </SectionCard>
 );
}