'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
type Props = {
 item: {
  id: string;
  titleSnapshot: string;
  desiredBuyPrice: number;
  maxBuyPrice: number;
  targetSellPrice?: number | null;
  active: boolean;
  priority: number;
 };
};
export function WatchlistInlineEditor({ item }: Props) {
 const router = useRouter();
 const [titleSnapshot, setTitleSnapshot] = useState(item.titleSnapshot ?? '');
 const [desiredBuyPrice, setDesiredBuyPrice] = useState(String(item.desiredBuyPrice ?? ''));
 const [maxBuyPrice, setMaxBuyPrice] = useState(String(item.maxBuyPrice ?? ''));
 const [targetSellPrice, setTargetSellPrice] = useState(
  item.targetSellPrice != null ? String(item.targetSellPrice) : '',
 );
 const [active, setActive] = useState(Boolean(item.active));
 const [priority, setPriority] = useState(String(item.priority ?? '0'));
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
    value={desiredBuyPrice}
    onChange={(e) => setDesiredBuyPrice(e.target.value)}
    className="rounded-xl border border-border px-3 py-2 text-sm"
    placeholder="Desired Buy"
   />
   <input
    value={maxBuyPrice}
    onChange={(e) => setMaxBuyPrice(e.target.value)}
    className="rounded-xl border border-border px-3 py-2 text-sm"
    placeholder="Max Buy"
   />
   <input
    value={targetSellPrice}
    onChange={(e) => setTargetSellPrice(e.target.value)}
    className="rounded-xl border border-border px-3 py-2 text-sm"
    placeholder="Target Sell"
   />
   <input
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
    className="rounded-xl border border-border px-3 py-2 text-sm"
    placeholder="Priority"
   />
   <label className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm">
    <input
     type="checkbox"
     checked={active}
     onChange={(e) => setActive(e.target.checked)}
    />
    <span>Active</span>
   </label>
   <button
    className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white"
    onClick={async () => {
     try {
      setLoading(true);
      await fetch('/api/admin/watchlist/update', {
       method: 'PATCH',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
        id: item.id,
        titleSnapshot,
        desiredBuyPrice: Number(desiredBuyPrice || 0),
        maxBuyPrice: Number(maxBuyPrice || 0),
        targetSellPrice: targetSellPrice ? Number(targetSellPrice) : null,
        active,
        priority: Number(priority || 0),
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