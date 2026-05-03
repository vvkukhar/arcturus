'use client';

import { useEffect, useState } from 'react';

export function DealsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/deals', {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`Load failed: ${res.status}`);
      }

      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deals');
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xl font-black">Detected Deals</div>
          <div className="mt-1 text-sm text-slate-500">
            Scanner matches with BUY_NOW / review signals.
          </div>
        </div>

        <button
          disabled={detecting}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          onClick={async () => {
            try {
              setDetecting(true);
              setError(null);

              const response = await fetch('/api/deals', {
                method: 'POST',
              });

              if (!response.ok) {
                throw new Error(`Detection failed: ${response.status}`);
              }

              await load();
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Detection failed');
            } finally {
              setDetecting(false);
            }
          }}
        >
          {detecting ? 'Detecting...' : 'Run Detection'}
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-slate-500">Loading deals...</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-slate-500">No deals</div>
      ) : (
        rows.map((row, index) => (
          <div
            key={row.id ?? `${row.action}-${index}`}
            className="rounded-xl border border-border p-3"
          >
            <div className="font-bold">
              {row.listing?.title ?? row.watchlistItem?.titleSnapshot ?? 'Deal'}
            </div>
            <div className="mt-1 text-sm text-slate-500">
              {row.listing?.sourceCode ?? '—'} • buy {row.buyPrice ?? '—'} • target{' '}
              {row.targetSellPrice ?? '—'}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              ROI {row.roiPercent?.toFixed?.(2) ?? row.roiPercent ?? '—'}% •{' '}
              {row.action ?? '—'}
            </div>
          </div>
        ))
      )}
    </div>
  );
}