'use client';

import { useEffect, useState } from 'react';

export function DealsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const res = await fetch('/api/deals');
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="text-xl font-black">Detected Deals</div>
        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={async () => {
            try {
              setLoading(true);

              await fetch('/api/deals', {
                method: 'POST',
              });

              await load();
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? 'Detecting…' : 'Run Detection'}
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="text-sm text-slate-500">No deals</div>
      ) : (
        rows.map((row) => (
          <div key={row.id} className="rounded-xl border border-border p-3">
            <div className="font-bold">
              {row.listing?.title ?? row.watchlistItem?.titleSnapshot ?? 'Deal'}
            </div>
            <div className="mt-1 text-sm text-slate-500">
              {row.listing?.sourceCode ?? '—'} • buy {row.buyPrice} • target{' '}
              {row.targetSellPrice ?? '—'}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              ROI {row.roiPercent?.toFixed?.(2) ?? row.roiPercent}% •{' '}
              {row.action}
            </div>
          </div>
        ))
      )}
    </div>
  );
}