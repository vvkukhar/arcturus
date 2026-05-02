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
export function InventoryInlineEditor({ item }: Props) {
 const router = useRouter();
 const [titleSnapshot, setTitleSnapshot] = useState(item.titleSnapshot ?? '');
 const [purchasePrice, setPurchasePrice] = useState(String(item.purchasePrice ?? ''));
 const [quantity, setQuantity] = useState(String(item.quantity ?? '1'));
 const [expectedSalePriceManual, setExpectedSalePriceManual] = useState(
  item.expectedSalePriceManual != null ? String(item.expectedSalePriceManual) : '',
 );
 const [condition, setCondition] = useState(item.condition ?? 'used');
 const [sealed, setSealed] = useState(Boolean(item.sealed));
 const [loading, setLoading] = useState(false);
 return (
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
    className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
    onClick={async () => {
     try {
      setLoading(true);
      await fetch('/api/admin/inventory/update', {
       method: 'PATCH',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
        id: item.id,
        titleSnapshot,
        purchasePrice: Number(purchasePrice || 0),
        quantity: Number(quantity || 1),
        expectedSalePriceManual: expectedSalePriceManual
         ? Number(expectedSalePriceManual)
         : null,
        condition,
        sealed,
       }),
      });
      router.refresh();
     } finally {
      setLoading(false);
     }
    }}
   >
    {loading ? 'Saving...' : 'Save Inline'}
   </button>
  </div>
 );
}