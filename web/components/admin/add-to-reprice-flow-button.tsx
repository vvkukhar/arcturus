'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { Loader2, RefreshCw } from 'lucide-react';

type Props = {
  inventoryItemId: string;
};

export function AddToRepriceFlowButton({ inventoryItemId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    try {
      setLoading(true);
      await apiFetch('/api/admin/flows/reprice/add', {
        method: 'POST',
        body: JSON.stringify({ inventoryItemId }),
      });
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add to reprice flow');
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
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
      {loading ? 'Adding...' : 'Reprice'}
    </Button>
  );
}