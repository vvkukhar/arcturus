'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  item: {
    id: string;
    purchasePrice: number;
    quantity: number;
    expectedSalePriceManual?: number | null;
  };
};

function toNumber(value: string, fallback: number | null = 0): number | null {
  if (value.trim() === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function InventoryEditDialog({ item }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [purchasePrice, setPurchasePrice] = useState(
    String(item.purchasePrice ?? ''),
  );
  const [quantity, setQuantity] = useState(String(item.quantity ?? '1'));
  const [expectedSalePriceManual, setExpectedSalePriceManual] = useState(
    item.expectedSalePriceManual != null
      ? String(item.expectedSalePriceManual)
      : '',
  );
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
        <div className="text-lg font-black">Edit Inventory Item</div>

        <div className="mt-4 space-y-3">
          <input
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            placeholder="Purchase price"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
          />

          <input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantity"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
          />

          <input
            value={expectedSalePriceManual}
            onChange={(e) => setExpectedSalePriceManual(e.target.value)}
            placeholder="Manual sell price"
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
          />
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

                const response = await fetch('/api/admin/inventory/update', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    id: item.id,
                    purchasePrice: toNumber(purchasePrice, 0),
                    quantity: toNumber(quantity, 1),
                    expectedSalePriceManual:
                      expectedSalePriceManual.trim() === ''
                        ? null
                        : toNumber(expectedSalePriceManual, null),
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