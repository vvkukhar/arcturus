'use client';

import { useState } from 'react';
import { Send, Loader2, MessageSquare, Zap } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export function SmmBroadcasterPanel() {
  const [loading, setLoading] = useState(false);

  const handleBroadcast = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await apiFetch('/api/admin/marketing/smm', { method: 'POST' });
      toast.success('AI SMM Broadcaster queued successfully.');
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch SMM job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
          <MessageSquare size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)]">SMM Broadcaster</h2>
          <p className="text-sm font-medium text-slate-500">Auto-generate FOMO posts for Telegram channel.</p>
        </div>
      </div>

      <div className="flex-1 bg-[var(--background)] p-6 rounded-2xl border border-[var(--border)]">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-6">
          The AI will select top 3 hottest items added to inventory in the last 24 hours, generate aggressive sales copy, attach images, and dispatch it to the connected Telegram community channel.
        </p>
        <button
          onClick={handleBroadcast}
          disabled={loading}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          Dispatch Broadcaster
        </button>
      </div>
    </div>
  );
}