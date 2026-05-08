'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';

export function AiSuggestionsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const { t } = useI18n();

  useEffect(() => {
    let mounted = true;

    apiFetch<any[]>('/api/ai/suggestions')
      .then((data) => {
        if (mounted) setRows(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setRows([]);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-4 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
      <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
        <Sparkles className="w-24 h-24 text-indigo-500" />
      </div>
      
      <div className="relative z-10 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Arcturus AI</h2>
      </div>

      <div className="relative z-10 space-y-3 mt-6">
        {rows.length === 0 ? (
          <div className="text-sm font-medium text-slate-500">System operating optimally. No urgent AI suggestions.</div>
        ) : (
          rows.map((row) => (
            <div key={`${row.type}-${row.id}`} className="rounded-xl border border-[var(--border)] bg-[var(--background)]/50 p-4 transition-all hover:border-indigo-500/30 hover:bg-[var(--card)]">
              <div className="flex justify-between items-start gap-4">
                <div className="font-black text-[var(--foreground)] line-clamp-1">{row.title}</div>
                <div className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  Score {row.score.toFixed(0)}
                </div>
              </div>
              <div className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed">{row.suggestion}</div>
              <div className="mt-3 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline uppercase tracking-wider">
                Review action <ArrowRight size={14} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}