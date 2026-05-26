'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { Loader2, Split, Trash2, X } from 'lucide-react';
import { ItemAutocomplete } from '@/components/admin/item-autocomplete';
import { formatMoney } from '@/lib/format';
import type { InventoryItem } from '@/lib/types';

type Props = {
  item: InventoryItem;
};

type SplitPart = {
  id: string; // temp id for react key
  itemId: string;
  titleSnapshot: string;
  costAllocation: string;
  expectedSalePriceManual: string;
  quantity: string;
  condition: string;
  sealed: boolean;
};

export function InventorySplitDialog({ item }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parts, setParts] = useState<SplitPart[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const parentCost = item.totalCost || 0;
  const allocatedCost = parts.reduce((sum, p) => sum + (Number(p.costAllocation) || 0), 0);
  const isCostBalanced = Math.abs(parentCost - allocatedCost) < 0.1;

  const handleAddPart = (pickedItem: any) => {
    setParts(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      itemId: pickedItem.id,
      titleSnapshot: pickedItem.title,
      costAllocation: '',
      expectedSalePriceManual: '',
      quantity: '1',
      condition: 'used',
      sealed: false
    }]);
    setSearchQuery('');
  };

  const updatePart = (id: string, field: keyof SplitPart, value: any) => {
    setParts(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const removePart = (id: string) => {
    setParts(prev => prev.filter(p => p.id !== id));
  };

  const handleSubmit = async () => {
    if (loading || parts.length === 0) return;
    try {
      setLoading(true);
      setError(null);

      const payloadParts = parts.map(p => ({
        itemId: p.itemId,
        titleSnapshot: p.titleSnapshot,
        costAllocation: Number(p.costAllocation) || 0,
        expectedSalePriceManual: p.expectedSalePriceManual ? Number(p.expectedSalePriceManual) : null,
        quantity: Number(p.quantity) || 1,
        condition: p.condition,
        sealed: p.sealed
      }));

      await apiFetch(`/api/proxy/admin/inventory/${item.id}/split`, {
        method: 'POST',
        body: JSON.stringify({ parts: payloadParts }),
      });

      router.refresh();
      setOpen(false);
      setParts([]);
    } catch (err: any) {
      setError(err.message || 'Failed to split bundle');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button variant="outline" className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-900/50 dark:text-indigo-400 dark:hover:bg-indigo-900/30" onClick={() => setOpen(true)}>
        <Split className="h-4 w-4" /> Part-Out Bundle
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="p-6 md:p-8 border-b border-[var(--border)] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2 text-[var(--foreground)]">
              <Split className="text-indigo-500" /> Part-Out / Split Bundle
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">Breaking down: <span className="font-bold text-[var(--foreground)]">{item.titleSnapshot}</span></p>
          </div>
          <button onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-[var(--background)] text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 p-5 rounded-2xl flex justify-between items-center">
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Original Cost Basis</div>
              <div className="text-2xl font-black text-indigo-700 dark:text-indigo-400">{formatMoney(parentCost)}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Allocated to parts</div>
              <div className={`text-2xl font-black ${isCostBalanced ? 'text-emerald-500' : 'text-rose-500'}`}>
                {formatMoney(allocatedCost)}
              </div>
            </div>
          </div>

          <div className="space-y-2 relative z-50">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Add part to bundle</label>
            <ItemAutocomplete value={searchQuery} onChangeAction={setSearchQuery} onPickAction={handleAddPart} placeholder="Search catalog to add a part (e.g. Minifigure)..." />
          </div>

          <div className="space-y-4">
            {parts.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-[var(--border)] rounded-2xl text-slate-400 font-bold">
                No parts added yet. Search and add items above.
              </div>
            ) : (
              parts.map((p, idx) => (
                <div key={p.id} className="p-4 bg-[var(--background)] border border-[var(--border)] rounded-2xl flex flex-wrap gap-4 items-end relative group">
                  <div className="absolute -top-3 -left-3 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center text-xs font-black">{idx + 1}</div>
                  
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-black uppercase text-slate-500">Title</label>
                    <input value={p.titleSnapshot} onChange={e => updatePart(p.id, 'titleSnapshot', e.target.value)} className="w-full mt-1 px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-xl font-bold text-sm outline-none text-[var(--foreground)]" />
                  </div>

                  <div className="w-24">
                    <label className="text-[10px] font-black uppercase text-slate-500">Cost (в‚ґ)</label>
                    <input type="number" value={p.costAllocation} onChange={e => updatePart(p.id, 'costAllocation', e.target.value)} className="w-full mt-1 px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-xl font-bold text-sm outline-none focus:border-indigo-500 text-[var(--foreground)]" placeholder="0" />
                  </div>

                  <div className="w-28">
                    <label className="text-[10px] font-black uppercase text-slate-500">Sell Price (в‚ґ)</label>
                    <input type="number" value={p.expectedSalePriceManual} onChange={e => updatePart(p.id, 'expectedSalePriceManual', e.target.value)} className="w-full mt-1 px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-xl font-bold text-sm outline-none text-blue-600 dark:text-blue-400" placeholder="Auto" />
                  </div>

                  <div className="w-16">
                    <label className="text-[10px] font-black uppercase text-slate-500">Qty</label>
                    <input type="number" value={p.quantity} onChange={e => updatePart(p.id, 'quantity', e.target.value)} className="w-full mt-1 px-3 py-2 bg-[var(--card)] border border-[var(--border)] rounded-xl font-bold text-sm outline-none text-[var(--foreground)]" />
                  </div>

                  <button onClick={() => removePart(p.id)} className="mb-1 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
          
          {error && <div className="text-sm font-bold text-red-500 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-xl">{error}</div>}
        </div>

        <div className="p-6 md:p-8 border-t border-[var(--border)] flex justify-end gap-3 shrink-0 bg-[var(--background)]/50 rounded-b-[2rem]">
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading || parts.length === 0 || !isCostBalanced} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Split className="w-4 h-4 mr-2" />}
            Confirm Split
          </Button>
        </div>
      </div>
    </div>
  );
}