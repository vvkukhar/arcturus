'use client';

import { useState } from 'react';

export function RepricerFromCompsPanel() {
  const [inventoryItemId, setInventoryItemId] = useState('');
  const [targetRoiPercent, setTargetRoiPercent] = useState('40');
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5">
      <div>
        <div className="text-xl font-black">Repricer From Sold Comps</div>
        <div className="mt-1 text-sm text-slate-500">
          Build price suggestion from sold comparable listings.
        </div>
      </div>

      <input
        value={inventoryItemId}
        onChange={(e) => setInventoryItemId(e.target.value)}
        placeholder="Inventory Item ID"
        className="w-full rounded-xl border border-border px-4 py-3 text-sm"
      />

      <input
        value={targetRoiPercent}
        onChange={(e) => setTargetRoiPercent(e.target.value)}
        placeholder="Target ROI %"
        className="w-full rounded-xl border border-border px-4 py-3 text-sm"
      />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          disabled={loading || !inventoryItemId}
          onClick={async () => {
            try {
              setLoading(true);
              setError(null);

              const response = await fetch('/api/repricer/analyze-from-comps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  inventoryItemId,
                  targetRoiPercent: Number(targetRoiPercent || 40),
                }),
              });

              if (!response.ok) {
                throw new Error(`Analyze failed: ${response.status}`);
              }

              setResult(await response.json());
            } catch (err) {
              setResult(null);
              setError(err instanceof Error ? err.message : 'Analyze failed');
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze From Comps'}
        </button>

        {result?.suggestedPrice ? (
          <button
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:opacity-60"
            disabled={applying}
            onClick={async () => {
              try {
                setApplying(true);
                setError(null);

                const response = await fetch('/api/repricer/apply', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    inventoryItemId,
                    suggestedPrice: result.suggestedPrice,
                  }),
                });

                if (!response.ok) {
                  throw new Error(`Apply failed: ${response.status}`);
                }
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Apply failed');
              } finally {
                setApplying(false);
              }
            }}
          >
            {applying ? 'Applying...' : 'Apply'}
          </button>
        ) : null}
      </div>

      {result ? (
        <div className="rounded-xl border border-border bg-slate-50 p-4 text-sm">
          <div className="font-bold">{result.title ?? 'Comps result'}</div>
          <div className="mt-1">Comp Count: {result.soldCompCount ?? 0}</div>
          <div className="mt-1">Floor: {result.marketFloor ?? '—'}</div>
          <div className="mt-1">Average: {result.marketAverage ?? '—'}</div>
          <div className="mt-1">Ceiling: {result.marketCeiling ?? '—'}</div>
          <div className="mt-1">Suggested: {result.suggestedPrice ?? '—'}</div>
          <div className="mt-1">ROI: {result.roiPercent ?? '—'}</div>
          <div className="mt-1">Mode: {result.classification ?? '—'}</div>
        </div>
      ) : null}
    </div>
  );
}