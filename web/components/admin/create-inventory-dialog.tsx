'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ItemAutocomplete } from '@/components/admin/item-autocomplete';
export function CreateInventoryDialog() {
 const router = useRouter();
 const [open, setOpen] = useState(false);
 const [itemSearch, setItemSearch] = useState('');
 const [itemId, setItemId] = useState('');
 const [titleSnapshot, setTitleSnapshot] = useState('');
 const [purchasePrice, setPurchasePrice] = useState('');
 const [totalCost, setTotalCost] = useState('');
 const [quantity, setQuantity] = useState('1');
 const [condition, setCondition] = useState('used');
 const [sealed, setSealed] = useState(false);
 const [expectedSalePriceManual, setExpectedSalePriceManual] = useState('');
 const [loading, setLoading] = useState(false);
 if (!open) {
  return <Button onClick={() => setOpen(true)}>Create Inventory</Button>;
 }
 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
   <div className="w-full max-w-lg rounded-3xl border border-border bg-white p-6 shadow-xl">
    <div className="text-lg font-black">Create Inventory Item</div>
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
      value={purchasePrice}
      onChange={(e) => setPurchasePrice(e.target.value)}
      placeholder="Purchase Price"
      className="w-full rounded-xl border border-border px-4 py-3 text-sm"
     />
     <input
      value={totalCost}
      onChange={(e) => setTotalCost(e.target.value)}
      placeholder="Total Cost"
      className="w-full rounded-xl border border-border px-4 py-3 text-sm"
     />
     <input
      value={quantity}
      onChange={(e) => setQuantity(e.target.value)}
      placeholder="Quantity"
      className="w-full rounded-xl border border-border px-4 py-3 text-sm"
     />
     <input
      value={condition}
      onChange={(e) => setCondition(e.target.value)}
      placeholder="Condition"
      className="w-full rounded-xl border border-border px-4 py-3 text-sm"
     />
     <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm">
      <input
       type="checkbox"
       checked={sealed}
       onChange={(e) => setSealed(e.target.checked)}
      />
      <span>Sealed</span>
     </label>
     <input
      value={expectedSalePriceManual}
      onChange={(e) => setExpectedSalePriceManual(e.target.value)}
      placeholder="Manual Sell Price"
      className="w-full rounded-xl border border-border px-4 py-3 text-sm"
     />
    </div>
    <div className="mt-5 flex gap-2">
     <Button
      onClick={async () => {
       try {
        setLoading(true);
        await fetch('/api/admin/inventory/create', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
          itemId,
          titleSnapshot,
          purchasePrice: Number(purchasePrice || 0),
          totalCost: totalCost ? Number(totalCost) : Number(purchasePrice || 0),
          quantity: Number(quantity || 1),
          condition,
          sealed,
          expectedSalePriceManual: expectedSalePriceManual
           ? Number(expectedSalePriceManual)
           : null,
         }),
        });
        router.refresh();
        setOpen(false);
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