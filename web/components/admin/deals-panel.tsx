'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';
import { Loader2, RefreshCw } from 'lucide-react';
import { StatusPill } from '@/components/admin/status-pill';
import { formatMoney, formatPercent } from '@/lib/format';

interface DealRow {
  id: string;
  action: string;
  buyPrice?: number;
  targetSellPrice?: number;
  roiPercent?: number;
  listing?: { title?: string; sourceCode?: string };
  watchlistItem?: { titleSnapshot?: string };
}

export function DealsPanel() {
  const [rows, setRows] = useState<DealRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiFetch<DealRow[]>('/api/deals');
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch deals');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunDetection = async () => {
    try {
      setDetecting(true);
      setError(null);
      await apiFetch('/api/deals', { method: 'POST' });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Detection failed');
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-border bg-white p-6 shadow-sm flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Detected Deals</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">
            High ROI matches from scanner requiring immediate action.
          </p>
        </div>
        <button
          disabled={detecting || loading}
          onClick={handleRunDetection}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-50 whitespace-nowrap"
        >
          <RefreshCw className={`h-4 w-4 ${detecting ? 'animate-spin' : ''}`} />
          {detecting ? 'Detecting...' : 'Run Detection'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 min-h-[300px]">
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-center">
            <div className="text-slate-400 font-medium">No profitable deals detected.</div>
            <div className="text-xs text-slate-400 mt-1">Run scanner or wait for new data.</div>
          </div>
        ) : (
          rows.map((row, index) => (
            <div key={row.id ?? index} className="group flex flex-col gap-3 rounded-xl border border-border bg-slate-50 p-4 transition-colors hover:bg-white hover:shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="font-bold text-slate-900 leading-tight">
                  {row.listing?.title ?? row.watchlistItem?.titleSnapshot ?? 'Unknown Deal'}
                </div>
                <StatusPill value={row.action ?? 'Pending'} />
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-200">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Source</span>
                  <span className="font-mono text-sm font-medium text-slate-700">{row.listing?.sourceCode ?? '—'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Buy</span>
                  <span className="text-sm font-bold text-slate-900">{formatMoney(row.buyPrice)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target</span>
                  <span className="text-sm font-bold text-blue-600">{formatMoney(row.targetSellPrice)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ROI</span>
                  <span className="text-sm font-black text-emerald-600">{formatPercent(row.roiPercent)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}