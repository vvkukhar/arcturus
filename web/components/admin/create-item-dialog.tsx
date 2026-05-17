'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { Loader2, Plus, X } from 'lucide-react';

export function CreateItemDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [setNumber, setSetNumber] = useState('');
  const [theme, setTheme] = useState('');
  const [kind, setKind] = useState('set');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setTitle('');
    setSetNumber('');
    setTheme('');
    setKind('set');
    setError(null);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !title.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await apiFetch('/api/admin/items/create', {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          setNumber: setNumber.trim() || null,
          theme: theme.trim() || null,
          kind,
        }),
      });
      router.refresh();
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Creation failed');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus size={16} />
        Create Item
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-[var(--foreground)]">Create Catalog Item</h2>
          <button onClick={handleClose} className="rounded-full p-2 hover:bg-[var(--background)] text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Title</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. LEGO Star Wars Millennium Falcon"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold text-[var(--foreground)] focus:bg-[var(--card)] focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Set Number</label>
              <input
                value={setNumber}
                onChange={(e) => setSetNumber(e.target.value)}
                placeholder="e.g. 75192"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold text-[var(--foreground)] focus:bg-[var(--card)] focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Theme</label>
              <input
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g. Star Wars"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold text-[var(--foreground)] focus:bg-[var(--card)] focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Kind</label>
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold text-[var(--foreground)] focus:bg-[var(--card)] focus:border-blue-500 outline-none cursor-pointer shadow-sm"
            >
              <option value="set">Set</option>
              <option value="minifigure">Minifigure</option>
              <option value="bundle">Bundle</option>
            </select>
          </div>

          <div className="mt-8 pt-4 border-t border-[var(--border)] flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || !title.trim()}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Creating...' : 'Create Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}