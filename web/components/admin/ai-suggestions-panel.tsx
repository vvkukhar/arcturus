'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';

export function AiSuggestionsPanel() {
  const [rows, setRows] = useState<any[]>([]);

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
    <div className="space-y-3 rounded-2xl border border-border bg-white p-5">
      <div className="text-xl font-black">AI Suggestions</div>
      {rows.length === 0 ? (
        <div className="text-sm text-slate-500">No suggestions</div>
      ) : (
        rows.map((row) => (
          <div key={`${row.type}-${row.id}`} className="rounded-xl border border-border p-3">
            <div className="font-bold">{row.title}</div>
            <div className="mt-1 text-sm text-slate-500">{row.suggestion}</div>
            <div className="mt-1 text-xs text-slate-400">
              {row.type} • {row.score.toFixed(2)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}