import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { SectionCard } from '@/components/admin/section-card';
import { InventoryInlineEditor } from '@/components/admin/inventory-inline-editor';
import { ImageGalleryManager } from '@/components/admin/image-gallery-manager';
import { ImageUploadForm } from '@/components/admin/image-upload-form';
import { DataTable } from '@/components/admin/data-table';
import { formatMoney } from '@/lib/format';
import type { InventoryItem } from '@/lib/types';

type Props = { params: Promise<{ id: string }> };

export default async function AdminInventoryDetailPage({ params }: Props) {
  const { id } = await params;
  let item: InventoryItem;

  try {
    item = await api.get<InventoryItem>(`/inventory/${id}`);
  } catch {
    notFound();
  }

  if (!item) notFound();

  const images = item.images || [];
  const sales = (item as any).sales || [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900">{item.titleSnapshot}</h1>
        <p className="mt-1 text-sm text-slate-500 font-mono">ID: {item.id} | Base Item ID: {item.itemId}</p>
      </div>

      <InventoryInlineEditor item={item} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ImageGalleryManager inventoryItemId={item.id} images={images} />
        </div>
        <div>
          <ImageUploadForm inventoryItemId={item.id} />
        </div>
      </div>

      <SectionCard title="Sales History">
        <DataTable
          rows={sales}
          emptyText="No sales recorded for this specific inventory lot."
          getRowKey={(row) => row.id}
          columns={[
            { key: 'date', header: 'Date', render: (row: any) => <span className="text-sm font-medium">{new Date(row.createdAt).toLocaleDateString('uk-UA')}</span> },
            { key: 'buyer', header: 'Buyer', render: (row: any) => <span className="font-semibold">{row.buyerName || 'Unknown'}</span> },
            { key: 'price', header: 'Sale Price', render: (row: any) => <span className="font-bold text-slate-900">{formatMoney(row.sellPrice)}</span> },
            { key: 'profit', header: 'Profit', render: (row: any) => <span className="text-emerald-600 font-bold">{formatMoney(row.profit)}</span> },
          ]}
        />
      </SectionCard>
    </div>
  );
}