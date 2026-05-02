'use client';

import { useState } from 'react';

export function DealExplainer() {
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [marketFloor, setMarketFloor] = useState('');
  const [marketAverage, setMarketAverage] = useState('');
  const [liquidityScore, setLiquidityScore] = useState('');
  const [result, setResult] = useState<any | null>(null);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5">
      <div className="text-xl font-black">Deal Explainer</div>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={buyPrice}
          onChange={(e) => setBuyPrice(e.target.value)}
          placeholder="Buy Price"
          className="rounded-xl border border-border px-4 py-3 text-sm"
        />
        <input
          value={sellPrice}
          onChange={(e) => setSellPrice(e.target.value)}
          placeholder="Sell Price"
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
          value={liquidityScore}
          onChange={(e) => setLiquidityScore(e.target.value)}
          placeholder="Liquidity Score"
          className="rounded-xl border border-border px-4 py-3 text-sm"
        />
      </div>

      <button
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        onClick={async () => {
          const res = await fetch('/api/ai/explain-deal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              buyPrice: Number(buyPrice || 0),
              sellPrice: Number(sellPrice || 0),
              marketFloor: marketFloor ? Number(marketFloor) : null,
              marketAverage: marketAverage ? Number(marketAverage) : null,
              liquidityScore: liquidityScore ? Number(liquidityScore) : null,
            }),
          });

          setResult(await res.json());
        }}
      >
        Explain Deal
      </button>

      {result ? (
        <div className="space-y-3 rounded-xl border border-border bg-slate-50 p-4">
          <div className="font-bold">{result.verdict}</div>
          <div className="text-sm text-slate-500">
            ROI: {result.roi?.toFixed?.(2) ?? result.roi}%
          </div>
          <div className="space-y-1 text-sm text-slate-600">
            {Array.isArray(result.reasons)
              ? result.reasons.map((reason: string, index: number) => (
                  <div key={`${reason}-${index}`}>{reason}</div>
                ))
              : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}