'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, UploadCloud } from 'lucide-react';

type Props = {
  inventoryItemId: string;
};

const compressImage = async (file: File, maxWidth = 1920): Promise<File> => {
  if (!file.type.startsWith('image/')) return file;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Canvas to Blob failed'));
            }
          },
          'image/webp',
          0.85
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
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

      const compressedFile = await compressImage(file);

      const formData = new FormData();
      formData.append('inventoryItemId', inventoryItemId);
      formData.append('file', compressedFile);

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
    <div className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm flex flex-col h-full">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <UploadCloud className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Upload Media</h2>
          <p className="text-sm font-medium text-slate-500">Add photos to your listing.</p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleUpload} className="flex flex-col gap-4 flex-1">
        <div className="flex-1 border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--background)]/50 p-6 flex flex-col items-center justify-center text-center hover:bg-[var(--card)] transition-colors relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/heic"
            onChange={(e) => {
              setError(null);
              setFile(e.target.files?.[0] ?? null);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <UploadCloud className="h-12 w-12 text-slate-300 mb-4" />
          <div className="text-sm font-bold text-[var(--foreground)]">
            {file ? file.name : 'Click to select or drag and drop'}
          </div>
          <div className="text-xs text-slate-400 mt-1 font-medium">JPEG, PNG, WEBP, HEIC</div>
        </div>

        <Button
          type="submit"
          disabled={loading || !file}
          className="w-full h-14 rounded-xl text-sm font-bold"
        >
          {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {loading ? 'Uploading & Compressing...' : 'Upload Selected Image'}
        </Button>
      </form>
    </div>
  );
}