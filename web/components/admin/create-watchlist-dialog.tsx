'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ItemAutocomplete } from '@/components/admin/item-autocomplete';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { Loader2, Plus, X, Search, DollarSign, Activity } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';

function parseNumber(value: string, fallback: number | null = null): number | null {
  if (!value.trim()) return fallback;
  const parsed = Number(value.replace(/,/g, '.'));
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function CreateWatchlistDialog() {
  const router = useRouter();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  
  const [itemSearch, setItemSearch] = useState('');
  const [itemId, setItemId] = useState('');
  const [titleSnapshot, setTitleSnapshot] = useState('');
  const [desiredBuyPrice, setDesiredBuyPrice] = useState('');
  const [maxBuyPrice, setMaxBuyPrice] = useState('');
  const [targetSellPrice, setTargetSellPrice] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setItemSearch(''); setItemId(''); setTitleSnapshot('');
    setDesiredBuyPrice(''); setMaxBuyPrice(''); setTargetSellPrice('');
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

      const parsedDesired = parseNumber(desiredBuyPrice);
      const parsedMax = parseNumber(maxBuyPrice);
      const parsedTarget = parseNumber(targetSellPrice, null);

      if (!itemId.trim()) throw new Error('Item ID is required. Please select from catalog.');
      if (!titleSnapshot.trim()) throw new Error('Title is required.');
      if (parsedDesired == null || parsedDesired < 0) throw new Error('Invalid desired buy price.');
      if (parsedMax == null || parsedMax < 0) throw new Error('Invalid max buy price.');

      await apiFetch('/api/admin/watchlist/create', {
        method: 'POST',
        body: JSON.stringify({
          itemId: itemId.trim(),
          titleSnapshot: titleSnapshot.trim(),
          desiredBuyPrice: parsedDesired,
          maxBuyPrice: parsedMax,
          targetSellPrice: parsedTarget,
        }),
      });

      router.refresh();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error' as any));
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 rounded-xl px-5 h-11">
        <Plus className="h-4 w-4" />
        {t('admin.ui.watch.add' as any)}
      </Button>
    );
  }

  const inputClasses = "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold text-[var(--foreground)] focus:bg-[var(--card)] focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden text-left">
        
        <div className="p-6 md:p-8 border-b border-[var(--border)] shrink-0 flex justify-between items-center bg-[var(--background)]/50">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md">
              <Plus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">{t('admin.ui.watch.add' as any)}</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{t('admin.ui.watch.addDesc' as any)}</p>
            </div>
          </div>
          <button onClick={handleClose} className="rounded-full p-2 bg-[var(--card)] border border-[var(--border)] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors shadow-sm">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar space-y-6">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-indigo-500 border-b border-[var(--border)] pb-2">
              <Search size={16} /> {t('admin.ui.watch.step1' as any)}
            </h3>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('admin.ui.watch.search' as any)}</label>
              <ItemAutocomplete
                value={itemSearch}
                onChangeAction={setItemSearch}
                placeholder=""
                onPickAction={(item) => {
                  setItemSearch(item.title);
                  setItemId(item.id);
                  setTitleSnapshot(item.title);
                }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('admin.ui.watch.titleSnap' as any)}</label>
              <input 
                required 
                value={titleSnapshot} 
                onChange={(e) => setTitleSnapshot(e.target.value)} 
                className={inputClasses} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-500 border-b border-[var(--border)] pb-2">
              <DollarSign size={16} /> {t('admin.ui.watch.step2' as any)}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('admin.ui.watch.desBuy' as any)}</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={desiredBuyPrice}
                  onChange={(e) => setDesiredBuyPrice(e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('admin.ui.watch.maxBuy' as any)}</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={maxBuyPrice}
                  onChange={(e) => setMaxBuyPrice(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">{t('admin.ui.watch.targetSell' as any)}</label>
              <input
                type="number"
                step="0.01"
                value={targetSellPrice}
                onChange={(e) => setTargetSellPrice(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 border-t border-[var(--border)] shrink-0 flex justify-end gap-3 bg-[var(--background)]/50">
          <Button type="button" variant="ghost" className="px-8 h-12 rounded-xl font-bold" onClick={handleClose} disabled={loading}>
            {t('common.cancel' as any)}
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="px-8 h-12 rounded-xl font-black bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all" 
            disabled={loading || !itemId || !desiredBuyPrice || !maxBuyPrice}
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Activity className="mr-2 h-5 w-5" />} 
            {loading ? t('common.loading' as any) : t('admin.ui.watch.start' as any)}
          </Button>
        </div>

      </div>
    </div>
  );
}