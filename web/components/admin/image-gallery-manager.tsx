'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type ImageRow = {
  id: string;
  imageUrl: string;
  isPrimary?: boolean;
};

type Props = {
  inventoryItemId: string;
  images: ImageRow[];
};

export function ImageGalleryManager({ inventoryItemId, images }: Props) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!images.length) {
    return null;
  }

  const move = async (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;

    try {
      setError(null);
      setLoadingId(`move-${images[from].id}`);

      const reordered = [...images];
      const [picked] = reordered.splice(from, 1);
      reordered.splice(to, 0, picked);

      const response = await fetch('/api/admin/media/inventory-image/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventoryItemId,
          imageIds: reordered.map((x) => x.id),
        }),
      });

      if (!response.ok) {
        throw new Error(`Reorder failed: ${response.status}`);
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reorder failed');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-slate-50 p-4">
      <div className="text-sm font-bold text-slate-500">Gallery</div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="overflow-hidden rounded-2xl border border-border bg-white"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={image.imageUrl}
                alt=""
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-2 p-3">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="px-3 py-2 text-xs"
                  disabled={loadingId != null}
                  onClick={async () => {
                    try {
                      setError(null);
                      setLoadingId(`primary-${image.id}`);

                      const response = await fetch('/api/admin/media/inventory-image/primary', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ imageId: image.id }),
                      });

                      if (!response.ok) {
                        throw new Error(`Set primary failed: ${response.status}`);
                      }

                      router.refresh();
                    } catch (err) {
                      setError(err instanceof Error ? err.message : 'Set primary failed');
                    } finally {
                      setLoadingId(null);
                    }
                  }}
                >
                  {loadingId === `primary-${image.id}`
                    ? 'Saving...'
                    : image.isPrimary
                      ? 'Primary'
                      : 'Set Primary'}
                </Button>

                <Button
                  variant="secondary"
                  className="px-3 py-2 text-xs"
                  disabled={loadingId != null || index === 0}
                  onClick={() => move(index, index - 1)}
                >
                  Up
                </Button>

                <Button
                  variant="secondary"
                  className="px-3 py-2 text-xs"
                  disabled={loadingId != null || index === images.length - 1}
                  onClick={() => move(index, index + 1)}
                >
                  Down
                </Button>
              </div>

              <Button
                variant="secondary"
                className="w-full"
                disabled={loadingId != null}
                onClick={async () => {
                  const ok = window.confirm('Delete image?');
                  if (!ok) return;

                  try {
                    setError(null);
                    setLoadingId(image.id);

                    const response = await fetch('/api/admin/media/inventory-image/delete', {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ imageId: image.id }),
                    });

                    if (!response.ok) {
                      throw new Error(`Delete failed: ${response.status}`);
                    }

                    router.refresh();
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Delete failed');
                  } finally {
                    setLoadingId(null);
                  }
                }}
              >
                {loadingId === image.id ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}