'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ItemAutocomplete } from '@/components/admin/item-autocomplete';
import { Button } from '@/components/ui/button';

function parseNumber(value: string, fallback: number | null = null): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function CreateWatchlistDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [itemSearch, setItemSearch] = useState('');
  const [itemId, setItemId] = useState('');
  const [titleSnapshot, setTitleSnapshot] = useState('');
  const [desiredBuyPrice, setDesiredBuyPrice] = useState('');
  const [maxBuyPrice, setMaxBuyPrice] = useState('');
  const [targetSellPrice, setTargetSellPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return <Button onClick={() => setOpen(true)}>Create Watchlist</Button>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-white p-6 shadow-xl">
        <div className="text-lg font-black">Create Watchlist Item</div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          <ItemAutocomplete
            value={itemSearch}
            onChange={setItemSearch}
            onPick={(item) => {
              setItemSearch(item.title);
              setItemId(item.id);
              setTitleSnapshot(item.title);
            }}
            placeholder="Search item by title or set number"
          />

          <input
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            placeholder="Item ID"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
          />

          <input
            value={titleSnapshot}
            onChange={(e) => setTitleSnapshot(e.target.value)}
            placeholder="Title Snapshot"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
          />

          <input
            value={desiredBuyPrice}
            onChange={(e) => setDesiredBuyPrice(e.target.value)}
            placeholder="Desired Buy Price"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
          />

          <input
            value={maxBuyPrice}
            onChange={(e) => setMaxBuyPrice(e.target.value)}
            placeholder="Max Buy Price"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
          />

          <input
            value={targetSellPrice}
            onChange={(e) => setTargetSellPrice(e.target.value)}
            placeholder="Target Sell Price"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
          />
        </div>

        <div className="mt-5 flex gap-2">
          <Button
            disabled={loading}
            onClick={async () => {
              try {
                setLoading(true);
                setError(null);

                const parsedDesired = parseNumber(desiredBuyPrice);
                const parsedMax = parseNumber(maxBuyPrice);
                const parsedTarget = parseNumber(targetSellPrice, null);

                if (!itemId.trim()) throw new Error('Item ID is required');
                if (!titleSnapshot.trim()) throw new Error('Title is required');

                if (parsedDesired == null || parsedDesired < 0) {
                  throw new Error('Desired buy price must be a valid number');
                }

                if (parsedMax == null || parsedMax < 0) {
                  throw new Error('Max buy price must be a valid number');
                }

                const response = await fetch('/api/admin/watchlist/create', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    itemId: itemId.trim(),
                    titleSnapshot: titleSnapshot.trim(),
                    desiredBuyPrice: parsedDesired,
                    maxBuyPrice: parsedMax,
                    targetSellPrice: parsedTarget,
                  }),
                });

                if (!response.ok) {
                  throw new Error(`Create failed: ${response.status}`);
                }

                router.refresh();
                setOpen(false);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Create failed');
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? 'Creating...' : 'Create'}
          </Button>

          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}