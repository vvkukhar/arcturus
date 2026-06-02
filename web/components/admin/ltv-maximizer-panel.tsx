'use client';

import { useState } from 'react';
import { Target, Loader2, Sparkles, UserPlus } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export function LtvMaximizerPanel() {
  const [loading, setLoading] = useState(false);

  const handleDispatch = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await apiFetch('/api/admin/marketing/ltv', { method: 'POST' });
      toast.success('LTV Maximizer queued successfully.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch LTV job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
          <UserPlus size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">LTV Maximizer</h2>
          <p className="text-sm font-medium text-slate-500">Cross-sell related sets to existing customers.</p>
        </div>
      </div>

      <div className="flex-1 bg-[var(--background)] p-6 rounded-2xl border border-[var(--border)]">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-6">
          The engine analyzes historical sales, finds matching themes in current inventory, and pushes suggested personalized messages directly to the admin Telegram for manual approval and forwarding to the client.
        </p>
        <button
          onClick={handleDispatch}
          disabled={loading}
          className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Target size={20} />}
          Run LTV Scan
        </button>
      </div>
    </div>
  );
}