'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { ItemAutocomplete } from '@/components/admin/item-autocomplete';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { Loader2, Plus, X, Package, DollarSign, Tag, Info, Layers, ImagePlus } from 'lucide-react';

function parseNumber(value: string, fallback: number | null = null): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

// Компресія зображень на клієнті перед відправкою (як на sell page)
const compressImage = async (file: File, maxWidth = 1920): Promise<File> => {
  if (!file.type.startsWith('image/')) return file;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' }));
            else reject(new Error('Canvas to Blob failed'));
          },
          'image/webp',
          0.85
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export function CreateInventoryDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  // States
  const [itemSearch, setItemSearch] = useState('');
  const [itemId, setItemId] = useState('');
  const [titleSnapshot, setTitleSnapshot] = useState('');
  
  // Category & Theme
  const [kind, setKind] = useState('set');
  const [theme, setTheme] = useState('');

  // Financials & Condition
  const [purchasePrice, setPurchasePrice] = useState('');
  const [expectedSalePriceManual, setExpectedSalePriceManual] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [condition, setCondition] = useState('used');
  const [sealed, setSealed] = useState(false);
  const [source, setSource] = useState('');
  const [notes, setNotes] = useState('');

  // Images
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setItemSearch(''); setItemId(''); setTitleSnapshot(''); setKind('set'); setTheme('');
    setPurchasePrice(''); setExpectedSalePriceManual(''); setQuantity('1'); setCondition('used');
    setSealed(false); setSource(''); setNotes(''); setFiles([]); setPreviewUrls([]); setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const combined = [...files, ...newFiles].slice(0, 5); 
      setFiles(combined);
      const urls = combined.map(f => URL.createObjectURL(f));
      setPreviewUrls(urls);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newUrls = [...previewUrls];
    URL.revokeObjectURL(newUrls[index]);
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
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
      if (!titleSnapshot.trim()) throw new Error('Введіть назву або оберіть товар з каталогу');

      // 1. Створюємо товар
      const res = await apiFetch<any>('/api/admin/inventory/create', {
        method: 'POST',
        body: JSON.stringify({ 
          itemId: itemId.trim() || undefined,
          titleSnapshot: titleSnapshot.trim(), 
          kind,
          theme: theme.trim() || null,
          purchasePrice: parsedPrice,
          expectedSalePriceManual: parsedExpected,
          quantity: parsedQty, 
          condition, 
          sealed,
          source: source.trim() || null,
          notes: notes.trim() || null,
        }),
      });

      const createdId = res?.data?.id || res?.id;

      // 2. Якщо є фотки - завантажуємо їх
      if (files.length > 0 && createdId) {
        for (let i = 0; i < files.length; i++) {
          const compressed = await compressImage(files[i]);
          const formData = new FormData();
          formData.append('inventoryItemId', createdId);
          formData.append('file', compressed);

          // Використовуємо apiFetch, він вміє обробляти FormData і прокидати токен
          await apiFetch('/api/admin/media/inventory-image', {
            method: 'POST',
            body: formData,
          });
        }
      }
      
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
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 custom-scrollbar">
      <div className="min-h-full flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-3xl flex flex-col rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] shadow-2xl animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-[var(--border)] flex justify-between items-center bg-[var(--background)]/50 rounded-t-[2.5rem]">
            <div>
              <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Add to Inventory</h2>
              <p className="text-sm font-medium text-slate-500 mt-1">Оприбуткування нового активу на баланс.</p>
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

            {/* Секція: Пошук та Категоризація */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-blue-500 border-b border-[var(--border)] pb-2">
                <Layers size={16} /> 1. Ідентифікація та Категорія
              </h3>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Артикул або Назва *</label>
                <ItemAutocomplete 
                  value={itemSearch} 
                  onChangeAction={(val) => {
                    setItemSearch(val);
                    setTitleSnapshot(val);
                    setItemId(''); 
                  }} 
                  placeholder="Введіть артикул (напр. 75192) або назву..."
                  onPickAction={(i) => { 
                    setItemSearch(i.title); 
                    setItemId(i.id); 
                    setTitleSnapshot(i.title); 
                    setKind(i.kind ?? 'set');
                    setTheme(i.theme ?? '');
                  }} 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Тип активу</label>
                  <select 
                    value={kind} 
                    onChange={(e) => setKind(e.target.value)}
                    className={`${inputClasses} cursor-pointer`}
                  >
                    <option value="set">Набір (Set)</option>
                    <option value="minifigure">Мініфігурка (Minifigure)</option>
                    <option value="bundle">Лот / Колекція (Bundle)</option>
                    <option value="part">Деталь (Part)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Серія (Theme)</label>
                  <input 
                    type="text" 
                    value={theme} 
                    onChange={(e) => setTheme(e.target.value)} 
                    placeholder="Star Wars, Ninjago..." 
                    className={inputClasses} 
                  />
                </div>
              </div>
            </div>

            {/* Секція: Фотографії */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-purple-500 border-b border-[var(--border)] pb-2">
                <ImagePlus size={16} /> 2. Фотографії (опціонально)
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl border border-[var(--border)] overflow-hidden group bg-slate-100 dark:bg-slate-900">
                    <Image src={url} alt="Preview" fill className="object-contain p-1 mix-blend-multiply dark:mix-blend-normal" />
                    <button type="button" onClick={() => removeFile(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {files.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--background)] text-slate-400 hover:text-blue-500 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    <Plus size={24} />
                  </button>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple accept="image/jpeg,image/png,image/webp,image/avif,image/heic" className="hidden" />
            </div>

            {/* Секція: Фінанси */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-500 border-b border-[var(--border)] pb-2">
                <DollarSign size={16} /> 3. Фінанси та Кількість
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Собівартість (₴) *</label>
                  <input required type="number" step="0.01" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)} placeholder="0.00" className={inputClasses} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Ціна продажу (₴)</label>
                  <input type="number" step="0.01" value={expectedSalePriceManual} onChange={(e) => setExpectedSalePriceManual(e.target.value)} placeholder="Авто-прорахунок" className={inputClasses} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Кількість (шт) *</label>
                  <input required type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className={inputClasses} />
                </div>
              </div>
            </div>

            {/* Секція: Стан та деталі */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-orange-500 border-b border-[var(--border)] pb-2">
                <Tag size={16} /> 4. Стан та Джерело
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Стан коробки / деталей</label>
                  <select value={condition} onChange={(e) => setCondition(e.target.value)} className={`${inputClasses} cursor-pointer`}>
                    <option value="new">Новий (New)</option>
                    <option value="used">Б/В (Used)</option>
                    <option value="incomplete">Неповний (Incomplete)</option>
                  </select>
                </div>

                <div className="space-y-1.5 flex flex-col justify-end pb-1">
                  <label className="flex h-[46px] items-center justify-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-2 cursor-pointer hover:bg-[var(--card)] transition-colors shadow-sm">
                    <input type="checkbox" checked={sealed} onChange={(e) => setSealed(e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-5 w-5" />
                    <span className="font-bold text-[var(--foreground)] text-sm">Заводські Пломби (Sealed)</span>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Де купили (Опціонально)</label>
                  <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="OLX, eBay, і т.д." className={inputClasses} />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1 flex items-center gap-1">
                  <Info size={12} /> Нотатки (відображаються на вітрині)
                </label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Опишіть стан набору, наявність інструкцій чи дефекти коробки..." rows={2} className={`${inputClasses} resize-none`} />
              </div>
            </div>

          </div>

          {/* Footer Buttons */}
          <div className="p-6 md:p-8 border-t border-[var(--border)] flex justify-end gap-3 bg-[var(--background)]/50 rounded-b-[2.5rem]">
            <Button type="button" variant="ghost" className="px-8 h-12 rounded-xl font-bold" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="px-8 h-12 rounded-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all" 
              disabled={loading || !titleSnapshot || !purchasePrice}
            >
              {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Package className="mr-2 h-5 w-5" />} 
              {loading ? 'Збереження...' : 'Оприбуткувати Актив'}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}