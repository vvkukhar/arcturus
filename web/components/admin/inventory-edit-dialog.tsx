'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { Loader2, Edit2, X, Package, DollarSign, Tag, Info } from 'lucide-react';
import type { InventoryItem } from '@/lib/types';

type Props = {
  item: InventoryItem;
};

function parseNumber(value: string, fallback: number | null = 0): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function InventoryEditDialog({ item }: Props) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [titleSnapshot, setTitleSnapshot] = useState(item.titleSnapshot ?? '');
  const [purchasePrice, setPurchasePrice] = useState(String(item.purchasePrice ?? ''));
  const [quantity, setQuantity] = useState(String(item.quantity ?? '1'));
  const [expectedSalePriceManual, setExpectedSalePriceManual] = useState(
    item.expectedSalePriceManual != null ? String(item.expectedSalePriceManual) : '',
  );
  const [condition, setCondition] = useState(item.condition ?? 'used');
  const [sealed, setSealed] = useState(Boolean(item.sealed));
  const [notes, setNotes] = useState(item.notes ?? '');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    setOpen(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const parsedPurchasePrice = parseNumber(purchasePrice, 0);
      const parsedQuantity = parseNumber(quantity, 1);
      const parsedExpectedSalePrice = expectedSalePriceManual.trim() === '' 
        ? null 
        : parseNumber(expectedSalePriceManual, null);

      if (parsedPurchasePrice === null || parsedPurchasePrice < 0) throw new Error('Invalid purchase price');
      if (parsedQuantity === null || parsedQuantity < 1) throw new Error('Quantity must be at least 1');
      if (!titleSnapshot.trim()) throw new Error('Title is required');

      await apiFetch('/api/admin/inventory/update', {
        method: 'PATCH',
        body: JSON.stringify({
          id: item.id,
          titleSnapshot: titleSnapshot.trim(),
          purchasePrice: parsedPurchasePrice,
          quantity: parsedQuantity,
          expectedSalePriceManual: parsedExpectedSalePrice,
          condition,
          sealed,
          notes: notes.trim() || null,
        }),
      });

      router.refresh();
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button variant="secondary" className="px-3 py-2 text-xs flex items-center gap-1.5 rounded-xl shadow-sm" onClick={() => setOpen(true)}>
        <Edit2 className="h-3.5 w-3.5" />
        Edit
      </Button>
    );
  }

  const inputClasses = "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold text-[var(--foreground)] focus:bg-[var(--card)] focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-500";

  return (
    // 🔥 ФІКС: Тепер скролиться весь фон, а не нутрощі модалки
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 custom-scrollbar">
      <div className="min-h-full flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-3xl flex flex-col rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] shadow-2xl animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-[var(--border)] flex justify-between items-center bg-[var(--background)]/50 rounded-t-[2.5rem]">
            <div>
              <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Edit Inventory Item</h2>
              <p className="text-sm font-medium text-slate-500 mt-1 font-mono">ID: {item.id}</p>
            </div>
            <button onClick={handleClose} className="rounded-full p-2 bg-[var(--card)] border border-[var(--border)] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors shadow-sm">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 md:p-8 space-y-8 text-left">
            
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Section 1: Basic Info */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-500 border-b border-[var(--border)] pb-2">
                <Package size={16} /> 1. Основна інформація
              </h3>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Назва товару (Title Snapshot) *</label>
                <input
                  required
                  value={titleSnapshot}
                  onChange={(e) => setTitleSnapshot(e.target.value)}
                  className={inputClasses}
                />
              </div>
              
              <div className="space-y-1.5 w-1/3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Кількість (Qty) *</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Section 2: Financials */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-500 border-b border-[var(--border)] pb-2">
                <DollarSign size={16} /> 2. Фінанси
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Собівартість (Purchase Price) ₴</label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                    className={inputClasses}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Ручна ціна продажу ₴</label>
                  <input
                    type="number"
                    step="0.01"
                    value={expectedSalePriceManual}
                    onChange={(e) => setExpectedSalePriceManual(e.target.value)}
                    placeholder="Залиште пустим для автоціни"
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Condition & Notes */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-orange-500 border-b border-[var(--border)] pb-2">
                <Tag size={16} /> 3. Стан та Нотатки
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Стан (Condition)</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className={`${inputClasses} cursor-pointer`}
                  >
                    <option value="new">Новий (New)</option>
                    <option value="used">Б/В (Used)</option>
                    <option value="incomplete">Неповний (Incomplete)</option>
                  </select>
                </div>
                
                <div className="space-y-1.5 flex flex-col justify-end pb-1">
                  <label className="flex h-[46px] items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 cursor-pointer hover:bg-[var(--card)] transition-colors shadow-sm">
                    <input
                      type="checkbox"
                      checked={sealed}
                      onChange={(e) => setSealed(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
                    />
                    <span className="font-bold text-[var(--foreground)] text-sm">Заводські Пломби (Sealed)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-1">
                  <Info size={12} /> Нотатки (Description / Notes)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Опишіть деталі, наприклад: Відсутня коробка, але всі деталі в наявності..."
                  rows={3}
                  className={`${inputClasses} resize-none`}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 md:p-8 border-t border-[var(--border)] flex justify-end gap-3 bg-[var(--background)]/50 rounded-b-[2.5rem]">
            <Button type="button" variant="ghost" className="px-8 h-12 rounded-xl font-bold" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="px-8 h-12 rounded-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all" 
              disabled={loading || !titleSnapshot || !purchasePrice}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Edit2 className="mr-2 h-5 w-5" />} 
              {loading ? 'Збереження...' : 'Зберегти зміни'}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}