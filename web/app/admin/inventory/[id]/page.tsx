import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import type { InventoryItem } from '@/lib/types';
import { InventoryInlineEditor } from '@/components/admin/inventory-inline-editor';
import { ImageGalleryManager } from '@/components/admin/image-gallery-manager';
import { ImageUploadForm } from '@/components/admin/image-upload-form';
import { SectionCard } from '@/components/admin/section-card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>;
};

async function getInventoryItem(id: string): Promise<InventoryItem | null> {
  try {
    return await api.get<InventoryItem>(`/inventory/${id}`);
  } catch {
    return null;
  }
}

export default async function InventoryDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getInventoryItem(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/inventory" 
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-black text-slate-900">{item.titleSnapshot || item.itemId}</h1>
          <p className="mt-1 font-mono text-sm font-medium text-slate-500">ID: {item.id}</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title="Item Details">
            <InventoryInlineEditor item={item} />
          </SectionCard>

          <SectionCard title="Media Gallery">
            <div className="space-y-6">
              <ImageUploadForm inventoryItemId={item.id} />
              <ImageGalleryManager inventoryItemId={item.id} images={item.images || []} />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="System Info">
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Created At</div>
                <div className="mt-1 text-sm font-medium text-slate-900">
                  {item.createdAt ? new Date(item.createdAt).toLocaleString('uk-UA') : '—'}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Assigned To</div>
                <div className="mt-1 text-sm font-medium text-slate-900">
                  {item.assignedUser?.name || 'Unassigned'}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Base Item ID</div>
                <div className="mt-1 font-mono text-sm font-medium text-slate-900">{item.itemId}</div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}