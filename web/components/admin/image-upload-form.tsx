'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  inventoryItemId: string;
};

export function ImageUploadForm({ inventoryItemId }: Props) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-slate-50 p-4">
      <div className="text-sm font-bold text-slate-500">Upload Product Image</div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setError(null);
          setFile(e.target.files?.[0] ?? null);
        }}
        className="block w-full text-sm"
      />

      <Button
        disabled={loading || !file}
        onClick={async () => {
          if (!file) return;

          try {
            setLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('inventoryItemId', inventoryItemId);
            formData.append('file', file);

            const response = await fetch('/api/admin/media/inventory-image', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error(`Upload failed: ${response.status}`);
            }

            setFile(null);
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  );
}