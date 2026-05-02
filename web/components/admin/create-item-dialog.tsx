'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
export function CreateItemDialog() {
 const router = useRouter();
 const [open, setOpen] = useState(false);
 const [title, setTitle] = useState('');
 const [setNumber, setSetNumber] = useState('');
 const [theme, setTheme] = useState('');
 const [kind, setKind] = useState('set');
 const [loading, setLoading] = useState(false);
 if (!open) {
  return (
   <Button onClick={() => setOpen(true)}>
    Create Item
   </Button>
  );
 }
 return (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
   <div className="w-full max-w-lg rounded-3xl border border-border bg-white p-6 shadow-xl">
    <div className="text-lg font-black">Create Item</div>
    <div className="mt-4 space-y-3">
     <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Title"
      className="w-full rounded-xl border border-border px-4 py-3 text-sm"
     />
     <input
      value={setNumber}
      onChange={(e) => setSetNumber(e.target.value)}
      placeholder="Set Number"
      className="w-full rounded-xl border border-border px-4 py-3 text-sm"
     />
     <input
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      placeholder="Theme"
      className="w-full rounded-xl border border-border px-4 py-3 text-sm"
     />
     <select
      value={kind}
      onChange={(e) => setKind(e.target.value)}
      className="w-full rounded-xl border border-border px-4 py-3 text-sm"
     >
      <option value="set">set</option>
      <option value="minifigure">minifigure</option>
      <option value="bundle">bundle</option>
     </select>
    </div>
    <div className="mt-5 flex gap-2">
     <Button
      onClick={async () => {
       try {
        setLoading(true);
        await fetch('/api/admin/items/create', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
          title,
          setNumber: setNumber || null,
          theme: theme || null,
          kind,
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