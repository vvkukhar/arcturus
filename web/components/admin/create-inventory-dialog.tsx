'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ItemAutocomplete } from '@/components/admin/item-autocomplete';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/client-api';
import { Loader2, Plus, X } from 'lucide-react';

function parseNumber(value: string, fallback: number | null = null): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.')); // Дозволяємо і кому і крапку
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function CreateInventoryDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  // States
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
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setItemSearch(''); setItemId(''); setTitleSnapshot('');
    setPurchasePrice(''); setTotalCost(''); setQuantity('1');
    setCondition('used'); setSealed(false); setExpectedSalePriceManual('');
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const parsedPurchasePrice = parseNumber(purchasePrice);
      const parsedTotalCost = parseNumber(totalCost, parsedPurchasePrice);
      const parsedQuantity = parseNumber(quantity, 1);
      const parsedExpectedSalePrice = parseNumber(expectedSalePriceManual, null);

      if (!itemId.trim()) throw new Error('Поле Item ID є обов\'язковим');
      if (!titleSnapshot.trim()) throw new Error('Поле Title є обов\'язковим');
      if (parsedPurchasePrice == null || parsedPurchasePrice < 0) throw new Error('Некоректна ціна закупівлі');
      if (parsedTotalCost == null || parsedTotalCost < 0) throw new Error('Некоректна загальна вартість');
      if (parsedQuantity == null || parsedQuantity < 1) throw new Error('Кількість має бути мінімум 1');

      await apiFetch('/api/admin/inventory/create', {
        method: 'POST',
        body: JSON.stringify({
          itemId: itemId.trim(),
          titleSnapshot: titleSnapshot.trim(),
          purchasePrice: parsedPurchasePrice,
          totalCost: parsedTotalCost,
          quantity: parsedQuantity,
          condition: condition.trim() || 'used',
          sealed,
          expectedSalePriceManual: parsedExpectedSalePrice,
        }),
      });

      router.refresh();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка при створенні');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Додати товар
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-[2rem] border border-border bg-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Створити товар</h2>
          <button onClick={handleClose} className="rounded-full p-2 hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Знайти товар (Автозаповнення)</label>
            <ItemAutocomplete
              value={itemSearch}
              onChange={setItemSearch}
              onPick={(item) => {
                setItemSearch(item.title);
                setItemId(item.id);
                setTitleSnapshot(item.title);
              }}
              placeholder="Введіть назву або артикул LEGO..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Item ID</label>
              <input required value={itemId} onChange={(e) => setItemId(e.target.value)} placeholder="Напр. 75192-1" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Кількість</label>
              <input type="number" min="1" required value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Назва</label>
            <input required value={titleSnapshot} onChange={(e) => setTitleSnapshot(e.target.value)} placeholder="Повна назва набору" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Ціна закупівлі (₴)</label>
              <input required type="number" step="0.01" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="0.00" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Собівартість (₴)</label>
              <input type="number" step="0.01" value={totalCost} onChange={(e) => setTotalCost(e.target.value)} placeholder="Опціонально" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Бажана ціна продажу</label>
              <input type="number" step="0.01" value={expectedSalePriceManual} onChange={(e) => setExpectedSalePriceManual(e.target.value)} placeholder="Опціонально" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Стан</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer">
                <option value="new">New (Новий)</option>
                <option value="used">Used (Вживаний)</option>
                <option value="incomplete">Incomplete (Неповний)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold cursor-pointer hover:bg-slate-100 transition-colors">
              <input type="checkbox" checked={sealed} onChange={(e) => setSealed(e.target.checked)} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span>Запакований (Sealed)</span>
            </label>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={loading}>
              Скасувати
            </Button>
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Створення...' : 'Створити'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}