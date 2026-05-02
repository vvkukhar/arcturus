'use client';

import { useState } from 'react';

export function RepricerFromCompsPanel() {
  const [inventoryItemId, setInventoryItemId] = useState('');
  const [targetRoiPercent, setTargetRoiPercent] = useState('40');
  const [result, setResult] = useState<any | null>(null);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5">
      <div className="text-xl font-black">Repricer From Sold Comps</div>
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
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={async () => {
            const res = await fetch('/api/repricer/analyze-from-comps', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                inventoryItemId,
                targetRoiPercent: Number(targetRoiPercent || 40),
              }),
            });
            setResult(await res.json());
          }}
        >
          Analyze From Comps
        </button>
        {result?.suggestedPrice ? (
          <button
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold"
            onClick={async () => {
              await fetch('/api/repricer/apply', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  inventoryItemId,
                  suggestedPrice: result.suggestedPrice,
                }),
              });
            }}
          >
            Apply
          </button>
        ) : null}
      </div>
      {result ? (
        <div className="rounded-xl border border-border bg-slate-50 p-4 text-sm">
          <div className="font-bold">{result.title}</div>
          <div className="mt-1">Comp Count: {result.soldCompCount}</div>
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