'use client';

import { useState } from 'react';

export function RepricerPanel() {
  const [inventoryItemId, setInventoryItemId] = useState('');
  const [marketFloor, setMarketFloor] = useState('');
  const [marketAverage, setMarketAverage] = useState('');
  const [marketCeiling, setMarketCeiling] = useState('');
  const [targetRoiPercent, setTargetRoiPercent] = useState('40');
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5">
      <div>
        <div className="text-xl font-black">Auto Repricer</div>
        <div className="mt-1 text-sm text-slate-500">
          Calculate suggested sell price from market bounds.
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={inventoryItemId}
          onChange={(e) => setInventoryItemId(e.target.value)}
          placeholder="Inventory Item ID"
          className="rounded-xl border border-border px-4 py-3 text-sm"
        />
        <input
          value={targetRoiPercent}
          onChange={(e) => setTargetRoiPercent(e.target.value)}
          placeholder="Target ROI %"
          className="rounded-xl border border-border px-4 py-3 text-sm"
        />
        <input
          value={marketFloor}
          onChange={(e) => setMarketFloor(e.target.value)}
          placeholder="Market Floor"
          className="rounded-xl border border-border px-4 py-3 text-sm"
        />
        <input
          value={marketAverage}
          onChange={(e) => setMarketAverage(e.target.value)}
          placeholder="Market Average"
          className="rounded-xl border border-border px-4 py-3 text-sm"
        />
        <input
          value={marketCeiling}
          onChange={(e) => setMarketCeiling(e.target.value)}
          placeholder="Market Ceiling"
          className="rounded-xl border border-border px-4 py-3 text-sm"
        />
      </div>

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

              const res = await fetch('/api/repricer/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  inventoryItemId,
                  marketFloor: marketFloor ? Number(marketFloor) : null,
                  marketAverage: marketAverage ? Number(marketAverage) : null,
                  marketCeiling: marketCeiling ? Number(marketCeiling) : null,
                  targetRoiPercent: targetRoiPercent
                    ? Number(targetRoiPercent)
                    : null,
                }),
              });

              if (!res.ok) {
                throw new Error(`Analyze failed: ${res.status}`);
              }

              setResult(await res.json());
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Analyze failed');
              setResult(null);
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>

        {result?.suggestedPrice ? (
          <button
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:opacity-60"
            disabled={applying}
            onClick={async () => {
              try {
                setApplying(true);
                setError(null);

                const res = await fetch('/api/repricer/apply', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    inventoryItemId: result.inventoryItemId ?? inventoryItemId,
                    suggestedPrice: result.suggestedPrice,
                  }),
                });

                if (!res.ok) {
                  throw new Error(`Apply failed: ${res.status}`);
                }
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Apply failed');
              } finally {
                setApplying(false);
              }
            }}
          >
            {applying ? 'Applying...' : 'Apply Suggested Price'}
          </button>
        ) : null}
      </div>

      {result ? (
        <div className="rounded-xl border border-border bg-slate-50 p-4 text-sm">
          <div className="font-bold">{result.title ?? 'Reprice result'}</div>
          <div className="mt-1">Suggested Price: {result.suggestedPrice ?? '—'}</div>
          <div className="mt-1">
            ROI: {result.roiPercent?.toFixed?.(2) ?? result.roiPercent ?? '—'}%
          </div>
          <div className="mt-1">Mode: {result.classification ?? '—'}</div>
        </div>
      ) : null}
    </div>
  );
}