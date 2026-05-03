import { notFound } from 'next/navigation';
import { SectionCard } from '@/components/admin/section-card';
import { InventoryInlineEditor } from '@/components/admin/inventory-inline-editor';
import { ImageGalleryManager } from '@/components/admin/image-gallery-manager';
import { ImageUploadForm } from '@/components/admin/image-upload-form';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function InventoryItemPage({ params }: Props) {
  const { id } = await params;

  let item: any;
  try {
    item = await api.get(`/inventory/${id}`);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">{item.titleSnapshot || item.itemId}</h1>
          <div className="text-sm text-slate-500">ID: {item.id} • Item ID: {item.itemId}</div>
        </div>
      </div>

      <SectionCard title="Quick Edit">
        <InventoryInlineEditor item={item} />
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Financials & Status">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-slate-500">Purchase Price</span>
              <span className="font-black">{formatMoney(item.purchasePrice)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-slate-500">Total Cost</span>
              <span className="font-black">{formatMoney(item.totalCost)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-slate-500">Target Sell Price</span>
              <span className="font-black">{formatMoney(item.expectedSalePriceManual)}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-slate-500">Quantity</span>
              <span className="font-black">{item.quantity}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold text-slate-500">Condition</span>
              <span className="font-black uppercase">{item.condition}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Sealed</span>
              <span className="font-black">{item.sealed ? 'YES' : 'NO'}</span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Media Management">
          <div className="space-y-6">
            <ImageUploadForm inventoryItemId={item.id} />
            <ImageGalleryManager inventoryItemId={item.id} images={item.images || []} />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}