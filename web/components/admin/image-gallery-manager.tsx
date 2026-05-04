'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/client-api';
import { Loader2, ArrowUp, ArrowDown, Trash2, Star } from 'lucide-react';
import type { InventoryImage } from '@/lib/types';

type Props = {
  inventoryItemId: string;
  images: InventoryImage[];
};

export function ImageGalleryManager({ inventoryItemId, images }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!images.length) return null;

  const move = async (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;

    try {
      setError(null);
      setLoadingId(`move-${images[from].id}`);

      const reordered = [...images];
      const [picked] = reordered.splice(from, 1);
      reordered.splice(to, 0, picked);

      await apiFetch('/api/admin/media/inventory-image/reorder', {
        method: 'PATCH',
        body: JSON.stringify({
          inventoryItemId,
          imageIds: reordered.map((x) => x.id),
        }),
      });

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reorder failed');
    } finally {
      setLoadingId(null);
    }
  };

  const setPrimary = async (imageId: string) => {
    try {
      setError(null);
      setLoadingId(`primary-${imageId}`);

      await apiFetch('/api/admin/media/inventory-image/primary', {
        method: 'PATCH',
        body: JSON.stringify({ imageId }),
      });

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Set primary failed');
    } finally {
      setLoadingId(null);
    }
  };

  const deleteImage = async (imageId: string) => {
    if (!window.confirm('Delete this image permanently?')) return;

    try {
      setError(null);
      setLoadingId(`delete-${imageId}`);

      await apiFetch('/api/admin/media/inventory-image/delete', {
        method: 'DELETE',
        body: JSON.stringify({ imageId }),
      });

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4 rounded-[2rem] border border-border bg-slate-50 p-6">
      <div className="text-sm font-bold uppercase tracking-wider text-slate-500">Media Gallery</div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {images.map((image, index) => {
          const isLoading = loadingId?.includes(image.id);
          return (
            <div key={image.id} className={`group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md ${image.isPrimary ? 'border-blue-400 ring-2 ring-blue-100' : 'border-slate-200'}`}>
              {image.isPrimary && (
                <div className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
                  <Star className="h-4 w-4 fill-current" />
                </div>
              )}
              
              <div className="relative aspect-[4/3] bg-slate-100">
                <Image src={image.imageUrl} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                {isLoading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-slate-100 bg-white">
                <div className="flex flex-wrap gap-2 justify-between">
                  <Button
                    variant={image.isPrimary ? 'default' : 'secondary'}
                    className="flex-1 px-2 py-1.5 text-xs h-auto"
                    disabled={loadingId != null}
                    onClick={() => setPrimary(image.id)}
                  >
                    {image.isPrimary ? 'Primary' : 'Make Primary'}
                  </Button>
                  
                  <div className="flex gap-1">
                    <Button variant="outline" className="h-auto px-2 py-1.5" disabled={loadingId != null || index === 0} onClick={() => move(index, index - 1)}>
                      <ArrowUp className="h-3.5 w-3.5 text-slate-600" />
                    </Button>
                    <Button variant="outline" className="h-auto px-2 py-1.5" disabled={loadingId != null || index === images.length - 1} onClick={() => move(index, index + 1)}>
                      <ArrowDown className="h-3.5 w-3.5 text-slate-600" />
                    </Button>
                    <Button variant="outline" className="h-auto px-2 py-1.5 hover:bg-red-50 hover:text-red-600 hover:border-red-200" disabled={loadingId != null} onClick={() => deleteImage(image.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}