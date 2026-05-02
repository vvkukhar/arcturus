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
 return (
  <div className="space-y-3 rounded-2xl border border-border bg-slate-50 p-4">
   <div className="text-sm font-bold text-slate-500">Upload Product Image</div>
   <input
    type="file"
    accept="image/*"
    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
    className="block w-full text-sm"
   />
   <Button
    onClick={async () => {
     if (!file) return;
     try {
      setLoading(true);
      const formData = new FormData();
      formData.append('inventoryItemId', inventoryItemId);
      formData.append('file', file);
      await fetch('/api/admin/media/inventory-image', {
       method: 'POST',
       body: formData,
      });
      router.refresh();
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