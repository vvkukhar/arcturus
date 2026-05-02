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

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5">
      <div className="text-xl font-black">Auto Repricer</div>

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

      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={async () => {
            try {
              setLoading(true);

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

              setResult(await res.json());
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? 'Analyzing…' : 'Analyze'}
        </button>

        {result ? (
          <button
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold"
            onClick={async () => {
              try {
                setApplying(true);

                await fetch('/api/repricer/apply', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    inventoryItemId: result.inventoryItemId,
                    suggestedPrice: result.suggestedPrice,
                  }),
                });
              } finally {
                setApplying(false);
              }
            }}
          >
            {applying ? 'Applying…' : 'Apply Suggested Price'}
          </button>
        ) : null}
      </div>

      {result ? (
        <div className="rounded-xl border border-border bg-slate-50 p-4 text-sm">
          <div className="font-bold">{result.title}</div>
          <div className="mt-1">Suggested Price: {result.suggestedPrice}</div>
          <div className="mt-1">
            ROI: {result.roiPercent?.toFixed?.(2) ?? result.roiPercent}%
          </div>
          <div className="mt-1">Mode: {result.classification}</div>
        </div>
      ) : null}
    </div>
  );
}