'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { Loader2, PlusCircle } from 'lucide-react';

type Props = {
  watchlistItemId: string;
};

export function AddToPurchaseFlowButton({ watchlistItemId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    try {
      setLoading(true);
      await apiFetch('/api/admin/flows/purchase/add', {
        method: 'POST',
        body: JSON.stringify({ watchlistItemId }),
      });
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add to purchase flow');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={loading}
      onClick={handleAdd}
      className="gap-1.5"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PlusCircle className="h-3.5 w-3.5" />}
      {loading ? 'Adding...' : 'To Flow'}
    </Button>
  );
}