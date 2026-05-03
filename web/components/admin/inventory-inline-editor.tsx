'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  item: {
    id: string;
    titleSnapshot: string;
    purchasePrice: number;
    quantity: number;
    expectedSalePriceManual?: number | null;
    condition: string;
    sealed: boolean;
  };
};

function toNumber(value: string, fallback: number | null = 0): number | null {
  if (value.trim() === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function InventoryInlineEditor({ item }: Props) {
  const router = useRouter();

  const [titleSnapshot, setTitleSnapshot] = useState(item.titleSnapshot ?? '');
  const [purchasePrice, setPurchasePrice] = useState(
    String(item.purchasePrice ?? ''),
  );
  const [quantity, setQuantity] = useState(String(item.quantity ?? '1'));
  const [expectedSalePriceManual, setExpectedSalePriceManual] = useState(
    item.expectedSalePriceManual != null
      ? String(item.expectedSalePriceManual)
      : '',
  );
  const [condition, setCondition] = useState(item.condition ?? 'used');
  const [sealed, setSealed] = useState(Boolean(item.sealed));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <div className="grid gap-2 md:grid-cols-6">
        <input
          value={titleSnapshot}
          onChange={(e) => setTitleSnapshot(e.target.value)}
          className="rounded-xl border border-border px-3 py-2 text-sm"
          placeholder="Title"
        />

        <input
          value={purchasePrice}
          onChange={(e) => setPurchasePrice(e.target.value)}
          className="rounded-xl border border-border px-3 py-2 text-sm"
          placeholder="Purchase"
        />

        <input
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="rounded-xl border border-border px-3 py-2 text-sm"
          placeholder="Qty"
        />

        <input
          value={expectedSalePriceManual}
          onChange={(e) => setExpectedSalePriceManual(e.target.value)}
          className="rounded-xl border border-border px-3 py-2 text-sm"
          placeholder="Manual Sell"
        />

        <input
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="rounded-xl border border-border px-3 py-2 text-sm"
          placeholder="Condition"
        />

        <label className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={sealed}
            onChange={(e) => setSealed(e.target.checked)}
          />
          <span>Sealed</span>
        </label>

        <button
          disabled={loading}
          className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={async () => {
            try {
              setLoading(true);
              setError(null);

              const response = await fetch('/api/admin/inventory/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  id: item.id,
                  titleSnapshot,
                  purchasePrice: toNumber(purchasePrice, 0),
                  quantity: toNumber(quantity, 1),
                  expectedSalePriceManual:
                    expectedSalePriceManual.trim() === ''
                      ? null
                      : toNumber(expectedSalePriceManual, null),
                  condition,
                  sealed,
                }),
              });

              if (!response.ok) {
                throw new Error(`Save failed: ${response.status}`);
              }

              router.refresh();
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Save failed');
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? 'Saving...' : 'Save Inline'}
        </button>
      </div>

      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}