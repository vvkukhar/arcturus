'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';
import { Loader2 } from 'lucide-react';
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

  const loadData = async () => {
    try {
      const data = await apiFetch<CompRow[]>('/api/comps/sold');
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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
    <div className="space-y-6 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Sold Comps Ingestion</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">
          Manually ingest sold-market examples for pricing intelligence.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Source Code</label>
          <input
            required
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            placeholder="e.g. ebay_sold"
            className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">JSON Payload (Array of objects)</label>
          <textarea
            required
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="min-h-[200px] w-full resize-y rounded-xl border border-border bg-slate-50 p-4 font-mono text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            spellCheck={false}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <button
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-50"
          disabled={loading || !sourceCode.trim() || !payload.trim()}
          onClick={handleIngest}
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Ingesting...' : 'Ingest Data'}
        </button>
      </div>

      <div className="pt-6 border-t border-slate-100 space-y-4">
        <h3 className="text-lg font-bold text-slate-900">Recent Comps</h3>
        <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
          {rows.length === 0 ? (
            <div className="text-center text-sm font-medium text-slate-400 py-4 border-2 border-dashed border-slate-200 rounded-xl">
              No sold comps available.
            </div>
          ) : (
            rows.slice(0, 20).map((row) => (
              <div key={row.id} className="flex flex-col gap-2 rounded-xl border border-border bg-slate-50 p-4 transition-colors hover:bg-white hover:shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="font-bold text-slate-900 line-clamp-2">{row.title}</div>
                  <div className="font-black text-emerald-600 whitespace-nowrap">{formatMoney(row.soldPrice)}</div>
                </div>
                <div className="flex items-center justify-between text-xs font-medium text-slate-500 mt-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-mono">{row.sourceCode ?? '—'}</span>
                    <span>Set: {row.extractedSetNo ?? '—'}</span>
                  </div>
                  <span>{row.soldAt ? new Date(row.soldAt).toLocaleDateString('uk-UA') : '—'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}