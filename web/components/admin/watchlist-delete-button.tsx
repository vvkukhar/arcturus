'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  id: string;
};

export function WatchlistDeleteButton({ id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="secondary"
        className="px-3 py-2 text-xs"
        disabled={loading}
        onClick={async () => {
          const ok = window.confirm('Delete watchlist item?');
          if (!ok) return;

          try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/admin/watchlist/delete', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id }),
            });

            if (!response.ok) {
              throw new Error(`Delete failed: ${response.status}`);
            }

            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Delete failed');
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? 'Deleting...' : 'Delete'}
      </Button>

      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}