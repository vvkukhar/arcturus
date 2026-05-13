'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { Loader2, Trash2 } from 'lucide-react';

type Props = {
  id: string;
};

export function WatchlistDeleteButton({ id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Delete watchlist item?')) return;

    try {
      setLoading(true);
      await apiFetch('/api/admin/watchlist/delete', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      });
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={loading}
      onClick={handleDelete}
      className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      {loading ? 'Deleting...' : 'Delete'}
    </Button>
  );
}