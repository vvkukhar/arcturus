'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ItemAutocomplete } from '@/components/admin/item-autocomplete';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/client-api';
import { Loader2, Plus, X } from 'lucide-react';

function parseNumber(value: string, fallback: number = 0): number {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function CreateInventoryDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [itemSearch, setItemSearch] = useState('');
  const [itemId, setItemId] = useState('');
  const [titleSnapshot, setTitleSnapshot] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setItemSearch('');
    setItemId('');
    setTitleSnapshot('');
    setPurchasePrice('');
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const parsedPrice = parseNumber(purchasePrice);
      if (parsedPrice < 0) throw new Error('Purchase price cannot be negative');
      if (!itemId.trim()) throw new Error('Item ID is required');

      await apiFetch('/api/admin/inventory/create', {
        method: 'POST',
        body: JSON.stringify({ 
          itemId: itemId.trim(), 
          titleSnapshot: titleSnapshot.trim(), 
          purchasePrice: parsedPrice, 
          quantity: 1, 
          condition: 'used', 
          sealed: false 
        }),
      });
      
      router.refresh();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create inventory item');
    } finally { 
      setLoading(false); 
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" /> 
        Add Inventory
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Add to Inventory</h2>
          <button onClick={handleClose} className="rounded-full p-2 hover:bg-[var(--background)] text-slate-400 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Search Catalog</label>
            <ItemAutocomplete 
              value={itemSearch} 
              onChangeAction={setItemSearch} 
              onPickAction={(i) => { 
                setItemSearch(i.title); 
                setItemId(i.id); 
                setTitleSnapshot(i.title); 
              }} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Item ID</label>
              <input 
                required 
                value={itemId} 
                onChange={(e) => setItemId(e.target.value)} 
                placeholder="system_id" 
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold focus:bg-[var(--card)] focus:border-blue-500 outline-none transition-all shadow-sm text-[var(--foreground)]" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Cost Basis (₴)</label>
              <input 
                required 
                type="number" 
                step="0.01"
                value={purchasePrice} 
                onChange={(e) => setPurchasePrice(e.target.value)} 
                placeholder="0.00" 
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold focus:bg-[var(--card)] focus:border-blue-500 outline-none transition-all shadow-sm text-[var(--foreground)]" 
              />
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[var(--border)] flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || !itemId || !purchasePrice}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
              {loading ? 'Processing...' : 'Add to Stock'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}