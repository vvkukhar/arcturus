'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ItemAutocomplete } from '@/components/admin/item-autocomplete';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/client-api';
import { Loader2, Plus, X } from 'lucide-react';

export function CreateInventoryDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [itemSearch, setItemSearch] = useState('');
  const [itemId, setItemId] = useState('');
  const [titleSnapshot, setTitleSnapshot] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await apiFetch('/api/admin/inventory/create', {
        method: 'POST',
        body: JSON.stringify({ itemId, titleSnapshot, purchasePrice: Number(purchasePrice), quantity: 1, condition: 'used', sealed: false }),
      });
      router.refresh();
      setOpen(false);
    } finally { setLoading(false); }
  };

  if (!open) return <Button onClick={() => setOpen(true)} className="gap-2"><Plus className="h-4 w-4" /> Додати товар</Button>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[var(--foreground)]">Створити товар</h2>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-200"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase text-slate-500">Знайти товар</label>
            <ItemAutocomplete value={itemSearch} onChange={setItemSearch} onPick={(i) => { setItemSearch(i.title); setItemId(i.id); setTitleSnapshot(i.title); }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input required value={itemId} onChange={(e) => setItemId(e.target.value)} placeholder="Item ID" className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-blue-500" />
            <input required type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="Ціна (₴)" className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-blue-500" />
          </div>
          <Button type="submit" disabled={loading} className="w-full mt-4">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} {loading ? 'Створення...' : 'Створити'}
          </Button>
        </form>
      </div>
    </div>
  );
}