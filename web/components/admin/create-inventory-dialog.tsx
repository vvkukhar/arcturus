// call:function_1{"queries":["web/components/admin/create-inventory-dialog.tsx"]}
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ItemAutocomplete } from '@/components/admin/item-autocomplete';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { Loader2, Plus, X, Package, DollarSign, Tag, Info } from 'lucide-react';

function parseNumber(value: string, fallback: number | null = null): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.'));
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
  const [expectedSalePriceManual, setExpectedSalePriceManual] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [condition, setCondition] = useState('used');
  const [sealed, setSealed] = useState(false);
  const [source, setSource] = useState('');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setItemSearch('');
    setItemId('');
    setTitleSnapshot('');
    setPurchasePrice('');
    setExpectedSalePriceManual('');
    setQuantity('1');
    setCondition('used');
    setSealed(false);
    setSource('');
    setNotes('');
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

      const parsedPrice = parseNumber(purchasePrice, 0);
      const parsedExpected = parseNumber(expectedSalePriceManual, null);
      const parsedQty = parseNumber(quantity, 1);

      if (parsedPrice === null || parsedPrice < 0) throw new Error('Ціна закупівлі не може бути від\'ємною');
      if (parsedQty === null || parsedQty < 1) throw new Error('Кількість має бути мінімум 1');
      if (!itemId.trim()) throw new Error('Оберіть товар з каталогу');

      await apiFetch('/api/admin/inventory/create', {
        method: 'POST',
        body: JSON.stringify({ 
          itemId: itemId.trim(), 
          titleSnapshot: titleSnapshot.trim(), 
          purchasePrice: parsedPrice,
          expectedSalePriceManual: parsedExpected,
          quantity: parsedQty, 
          condition, 
          sealed,
          source: source.trim() || null,
          notes: notes.trim() || null,
        }),
      });
      
      router.refresh();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося додати товар');
    } finally { 
      setLoading(false); 
    }
  };

  const inputClasses = "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold focus:bg-[var(--card)] focus:border-blue-500 outline-none transition-all shadow-sm text-[var(--foreground)] placeholder:text-slate-500";

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 rounded-xl px-5 h-11">
        <Plus className="h-4 w-4" /> 
        Add Inventory
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-[2rem] border border-[var(--border)] bg-[var(--card)] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-[var(--border)] shrink-0 flex justify-between items-center bg-[var(--background)]/50">
          <div>
            <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Add to Inventory</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Оприбуткування нового активу на баланс.</p>
          </div>
          <button onClick={handleClose} className="rounded-full p-2 bg-[var(--card)] border border-[var(--border)] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar space-y-8">
          
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Секція: Пошук по каталогу */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-500 border-b border-[var(--border)] pb-2">
              <Package size={16} /> 1. Ідентифікація
            </h3>
            
            <ItemAutocomplete 
              value={itemSearch} 
              onChangeAction={setItemSearch} 
              placeholder="Введіть артикул (напр. 75192) або назву набору..."
              onPickAction={(i) => { 
                setItemSearch(i.title); 
                setItemId(i.id); 
                setTitleSnapshot(i.title); 
              }} 
            />

            {itemId && (
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/40 flex items-center gap-4 animate-in fade-in zoom-in-95">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                  <Package size={24} />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-0.5">Обраний актив</div>
                  <div className="font-black text-[var(--foreground)] leading-tight truncate text-lg">{titleSnapshot}</div>
                  <div className="text-xs font-mono text-slate-500 mt-1">{itemId}</div>
                </div>
              </div>
            )}
          </div>

          {/* Секція: Фінанси */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-500 border-b border-[var(--border)] pb-2">
              <DollarSign size={16} /> 2. Фінанси та Кількість
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Собівартість (₴) *</label>
                <input 
                  required 
                  type="number" 
                  step="0.01"
                  value={purchasePrice} 
                  onChange={(e) => setPurchasePrice(e.target.value)} 
                  placeholder="0.00" 
                  className={inputClasses} 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Бажана ціна продажу (₴)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={expectedSalePriceManual} 
                  onChange={(e) => setExpectedSalePriceManual(e.target.value)} 
                  placeholder="Авто-прорахунок" 
                  className={inputClasses} 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Кількість (шт) *</label>
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
          </div>

          {/* Секція: Стан та деталі */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-orange-500 border-b border-[var(--border)] pb-2">
              <Tag size={16} /> 3. Стан та Джерело
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Стан коробки / деталей</label>
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
                  <span className="font-bold text-[var(--foreground)] text-sm">Заводські Пломби</span>
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Де купили (Опціонально)</label>
                <input 
                  type="text" 
                  value={source} 
                  onChange={(e) => setSource(e.target.value)} 
                  placeholder="OLX, eBay, і т.д." 
                  className={inputClasses} 
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-1">
                <Info size={12} /> Нотатки колекціонера (відображаються на вітрині)
              </label>
              <textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                placeholder="Опишіть стан набору, наявність інструкцій чи дефекти коробки..." 
                rows={3}
                className={`${inputClasses} resize-none`}
              />
            </div>
          </div>

        </div>

        {/* Footer Buttons */}
        <div className="p-6 md:p-8 border-t border-[var(--border)] shrink-0 flex justify-end gap-3 bg-[var(--background)]/50">
          <Button type="button" variant="ghost" className="px-8 h-12 rounded-xl font-bold" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="px-8 h-12 rounded-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all" 
            disabled={loading || !itemId || !purchasePrice}
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Package className="mr-2 h-5 w-5" />} 
            {loading ? 'Збереження...' : 'Оприбуткувати Актив'}
          </Button>
        </div>

      </div>
    </div>
  );
}