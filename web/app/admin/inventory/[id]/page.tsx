import { notFound } from 'next/navigation';
import { ImageGalleryManager } from '@/components/admin/image-gallery-manager';
import { ImageUploadForm } from '@/components/admin/image-upload-form';
import { InventoryInlineEditor } from '@/components/admin/inventory-inline-editor';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/format';

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getInventoryItem(id: string): Promise<any | null> {
  try {
    return await api.get(`/inventory/${id}`);
  } catch {
    return null;
  }
}

export default async function InventoryDetailsPage({ params }: Props) {
  const { id } = await params;
  const item = await getInventoryItem(id);

  if (!item) {
    notFound();
  }

  const images = Array.isArray(item.images) ? item.images : [];

  return (
    <div className="space-y-6">
      <SectionCard title={item.titleSnapshot || item.item?.title || 'Inventory Item'}>
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-3 xl:col-span-2">
            <div className="text-sm text-slate-500">{item.id}</div>

            <div className="flex flex-wrap gap-2">
              <StatusPill value={item.condition ?? 'unknown'} />
              <StatusPill value={item.sealed ? 'sealed' : 'used'} />
              <StatusPill value={(item.quantity ?? 0) > 0 ? 'available' : 'sold'} />
            </div>

            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-2xl border border-border bg-slate-50 p-4">
                <div className="text-xs font-bold uppercase text-slate-500">Purchase</div>
                <div className="mt-1 text-lg font-black">{formatMoney(item.purchasePrice)}</div>
              </div>

              <div className="rounded-2xl border border-border bg-slate-50 p-4">
                <div className="text-xs font-bold uppercase text-slate-500">Cost Basis</div>
                <div className="mt-1 text-lg font-black">{formatMoney(item.totalCost)}</div>
              </div>

              <div className="rounded-2xl border border-border bg-slate-50 p-4">
                <div className="text-xs font-bold uppercase text-slate-500">Manual Sell</div>
                <div className="mt-1 text-lg font-black">
                  {formatMoney(item.expectedSalePriceManual)}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-slate-50 p-4">
                <div className="text-xs font-bold uppercase text-slate-500">Quantity</div>
                <div className="mt-1 text-lg font-black">{item.quantity ?? 0}</div>
              </div>
            </div>

            <InventoryInlineEditor item={item} />
          </div>

          <ImageUploadForm inventoryItemId={item.id} />
        </div>
      </SectionCard>

      <ImageGalleryManager inventoryItemId={item.id} images={images} />
    </div>
  );
}