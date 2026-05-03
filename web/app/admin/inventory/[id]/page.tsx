import { api } from '@/lib/api';
import { SectionCard } from '@/components/admin/section-card';
import { InventoryInlineEditor } from '@/components/admin/inventory-inline-editor';
import { ImageGalleryManager } from '@/components/admin/image-gallery-manager';
import { ImageUploadForm } from '@/components/admin/image-upload-form';

export default async function AdminInventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await api.get<any>(`/inventory/${id}`);
  
  if (!item) return <div className="p-6 text-red-500 font-bold">Inventory item not found</div>;

  return (
    <div className="space-y-6">
      <SectionCard title={`Inventory: ${item.titleSnapshot || item.itemId}`}>
        <InventoryInlineEditor item={item} />
      </SectionCard>
      <SectionCard title="Media Management">
        <div className="grid gap-6 md:grid-cols-2">
          <ImageUploadForm inventoryItemId={item.id} />
          <ImageGalleryManager inventoryItemId={item.id} images={item.images || []} />
        </div>
      </SectionCard>
    </div>
  );
}