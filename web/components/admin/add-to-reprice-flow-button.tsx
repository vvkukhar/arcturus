'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  inventoryItemId: string;
};

export function AddToRepriceFlowButton({ inventoryItemId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-1">
      <Button
        variant="secondary"
        className="px-3 py-2 text-xs"
        disabled={loading}
        onClick={async () => {
          try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/admin/flows/reprice/add', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ inventoryItemId }),
            });

            if (!response.ok) {
              throw new Error(`Add failed: ${response.status}`);
            }

            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Add failed');
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? 'Adding...' : 'Reprice'}
      </Button>

      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}