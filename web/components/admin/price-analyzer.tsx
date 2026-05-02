'use client';

import { useState } from 'react';

export function PriceAnalyzer() {
  const [buy, setBuy] = useState('');
  const [sell, setSell] = useState('');
  const [result, setResult] = useState<any>(null);

  return (
    <div className="space-y-3 rounded-2xl border p-4">
      <div className="text-lg font-black">Price Analyzer</div>
      <input
        value={buy}
        onChange={(e) => setBuy(e.target.value)}
        placeholder="Buy price"
        className="w-full rounded-xl border px-3 py-2"
      />
      <input
        value={sell}
        onChange={(e) => setSell(e.target.value)}
        placeholder="Sell price (optional)"
        className="w-full rounded-xl border px-3 py-2"
      />
      <button
        onClick={async () => {
          const res = await fetch('/api/pricing/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              buyPrice: Number(buy),
              sellPrice: sell ? Number(sell) : undefined,
            }),
          });
          setResult(await res.json());
        }}
        className="rounded-xl bg-slate-900 px-4 py-2 text-white"
      >
        Analyze
      </button>
      {result ? (
        <div className="space-y-1 text-sm">
          <div>Sell: {result.suggestedSellPrice}</div>
          <div>ROI: {result.roi.toFixed(2)}%</div>
          <div>Profit: {result.profit}</div>
          <div>Type: {result.classification}</div>
        </div>
      ) : null}
    </div>
  );
}