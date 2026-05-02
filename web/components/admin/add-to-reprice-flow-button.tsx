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

  return (
    <Button
      variant="secondary"
      className="px-3 py-2 text-xs"
      onClick={async () => {
        try {
          setLoading(true);
          await fetch('/api/admin/flows/reprice/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ inventoryItemId }),
          });
          router.refresh();
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? 'Adding...' : 'Reprice'}
    </Button>
  );
}