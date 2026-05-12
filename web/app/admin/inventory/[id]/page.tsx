'use client';

import { use } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Loader2 } from 'lucide-react';
import { InventoryInlineEditor } from '@/components/admin/inventory-inline-editor';
import { ImageGalleryManager } from '@/components/admin/image-gallery-manager';
import { ImageUploadForm } from '@/components/admin/image-upload-form';
import type { InventoryItem } from '@/lib/types';

export default function InventoryItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: item, isLoading, mutate } = useSWR<InventoryItem>(`/api/admin/inventory/${id}`, swrFetcher);

  if (isLoading) return <div className="flex h-[calc(100vh-8rem)] items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>;
  if (!item) return <div className="flex h-[calc(100vh-8rem)] items-center justify-center font-bold text-slate-500">Inventory Item Not Found</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-fade-in-up">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)]">{item.titleSnapshot}</h1>
        <p className="mt-1 text-sm text-slate-500 font-mono">ID: {item.id}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <InventoryInlineEditor item={item} onSuccessAction={() => mutate()} />
        <ImageUploadForm inventoryItemId={item.id} />
      </div>
      <ImageGalleryManager inventoryItemId={item.id} images={item.images ?? []} />
    </div>
  );
}