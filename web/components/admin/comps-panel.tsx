'use client';

import { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '@/lib/client-api';
import { Loader2, DatabaseZap } from 'lucide-react';
import { formatMoney } from '@/lib/format';

interface CompRow {
  id: string;
  title: string;
  sourceCode?: string;
  soldPrice?: number;
  extractedSetNo?: string;
  soldAt?: string;
  createdAt?: string;
}

export function CompsPanel() {
  const [rows, setRows] = useState<CompRow[]>([]);
  const [sourceCode, setSourceCode] = useState('');
  const [payload, setPayload] = useState(`[\n  {\n    "externalId": "demo-1",\n    "title": "LEGO Ninjago 71700",\n    "soldPrice": 120,\n    "soldAt": "${new Date().toISOString()}"\n  }\n]`);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const data = await apiFetch<CompRow[]>('/api/comps/sold');
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleIngest = async () => {
    try {
      setLoading(true);
      setError(null);

      let comps: any[];
      try {
        comps = JSON.parse(payload);
        if (!Array.isArray(comps)) throw new Error('Payload is not an array');
      } catch (err) {
        throw new Error('Invalid JSON format. Payload must be a valid JSON array.');
      }

      await apiFetch('/api/comps/ingest', {
        method: 'POST',
        body: JSON.stringify({ sourceCode, comps }),
      });

      setPayload('[\n\n]');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ingest failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm transition-all hover:shadow-md h-full flex flex-col">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
          <DatabaseZap className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Comps Ingestion</h2>
          <p className="text-sm font-medium text-slate-500">
            Manually ingest sold market examples for ML pricing models.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Source Code</label>
          <input
            required
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            placeholder="e.g. ebay_sold"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold text-[var(--foreground)] focus:bg-[var(--card)] focus:border-amber-500 outline-none transition-all shadow-sm"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">JSON Payload (Array of objects)</label>
          <textarea
            required
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="min-h-[160px] w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs md:text-sm text-[var(--foreground)] focus:bg-[var(--card)] focus:border-amber-500 outline-none transition-all shadow-sm custom-scrollbar"
            spellCheck={false}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-md shadow-slate-900/20 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          disabled={loading || !sourceCode.trim() || !payload.trim()}
          onClick={handleIngest}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Ingesting...' : 'Ingest Data'}
        </button>
      </div>

      <div className="pt-6 border-t border-[var(--border)] flex-1 flex flex-col min-h-[250px]">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Recent Ingested Comps</h3>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
          {rows.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-sm font-bold text-slate-400 border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--background)]/50">
              No sold comps available
            </div>
          ) : (
            rows.slice(0, 20).map((row) => (
              <div key={row.id} className="flex flex-col gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)]/50 p-4 transition-all hover:bg-[var(--card)] hover:shadow-md hover:border-amber-500/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="font-black text-[var(--foreground)] leading-tight line-clamp-2">{row.title}</div>
                  <div className="font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{formatMoney(row.soldPrice)}</div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-200/50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-mono text-[10px] font-black uppercase tracking-wider">{row.sourceCode ?? '—'}</span>
                    <span className="text-xs font-bold text-slate-500">Set: {row.extractedSetNo ?? '—'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{row.soldAt ? new Date(row.soldAt).toLocaleDateString('uk-UA') : '—'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}