'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  item: {
    id: string;
    desiredBuyPrice: number;
    maxBuyPrice: number;
    targetSellPrice?: number | null;
    active: boolean;
  };
};

function toNumber(value: string, fallback: number | null = 0): number | null {
  if (value.trim() === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function WatchlistEditDialog({ item }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [desiredBuyPrice, setDesiredBuyPrice] = useState(
    String(item.desiredBuyPrice ?? ''),
  );
  const [maxBuyPrice, setMaxBuyPrice] = useState(
    String(item.maxBuyPrice ?? ''),
  );
  const [targetSellPrice, setTargetSellPrice] = useState(
    item.targetSellPrice != null ? String(item.targetSellPrice) : '',
  );
  const [active, setActive] = useState(item.active);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return (
      <Button className="px-3 py-2 text-xs" onClick={() => setOpen(true)}>
        Edit
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-white p-6 shadow-xl">
        <div className="text-lg font-black">Edit Watchlist Item</div>

        <div className="mt-4 space-y-3">
          <input
            value={desiredBuyPrice}
            onChange={(e) => setDesiredBuyPrice(e.target.value)}
            placeholder="Desired buy price"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
          />

          <input
            value={maxBuyPrice}
            onChange={(e) => setMaxBuyPrice(e.target.value)}
            placeholder="Max buy price"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
          />

          <input
            value={targetSellPrice}
            onChange={(e) => setTargetSellPrice(e.target.value)}
            placeholder="Target sell price"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
          />

          <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
            <span>Active</span>
          </label>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-5 flex gap-2">
          <Button
            disabled={loading}
            onClick={async () => {
              try {
                setLoading(true);
                setError(null);

                const response = await fetch('/api/admin/watchlist/update', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id: item.id,
                    desiredBuyPrice: toNumber(desiredBuyPrice, 0),
                    maxBuyPrice: toNumber(maxBuyPrice, 0),
                    targetSellPrice:
                      targetSellPrice.trim() === ''
                        ? null
                        : toNumber(targetSellPrice, null),
                    active,
                  }),
                });

                if (!response.ok) {
                  throw new Error(`Save failed: ${response.status}`);
                }

                router.refresh();
                setOpen(false);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Save failed');
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? 'Saving...' : 'Save'}
          </Button>

          <Button
            variant="secondary"
            disabled={loading}
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}