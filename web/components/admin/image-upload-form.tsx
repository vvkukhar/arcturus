'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud } from 'lucide-react';

type Props = {
  inventoryItemId: string;
};

export function ImageUploadForm({ inventoryItemId }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Upload failed: ${response.status}`);
      }

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
        <UploadCloud className="h-4 w-4" />
        Upload Media
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="w-full flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={(e) => {
              setError(null);
              setFile(e.target.files?.[0] ?? null);
            }}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors"
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !file}
          className="w-full sm:w-auto"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </form>
    </div>
  );
}