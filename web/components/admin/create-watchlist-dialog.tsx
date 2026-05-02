'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ItemAutocomplete } from '@/components/admin/item-autocomplete';
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
 if (!open) {
  return <Button onClick={() => setOpen(true)}>Create Watchlist</Button>;
 }
 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
   <div className="w-full max-w-lg rounded-3xl border border-border bg-white p-6 shadow-xl">
    <div className="text-lg font-black">Create Watchlist Item</div>
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
      onClick={async () => {
       try {
        setLoading(true);
        await fetch('/api/admin/watchlist/create', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
          itemId,
          titleSnapshot,
          desiredBuyPrice: Number(desiredBuyPrice || 0),
          maxBuyPrice: Number(maxBuyPrice || 0),
          targetSellPrice: targetSellPrice ? Number(targetSellPrice) : null,
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