'use client';

import { useEffect, useState } from 'react';

export function CompsPanel() {
  const [rows, setRows] = useState<any[]>([]);
  const [sourceCode, setSourceCode] = useState('');
  const [payload, setPayload] = useState(`[
  {
    "externalId": "demo-1",
    "title": "LEGO Ninjago 71700",
    "soldPrice": 120,
    "soldAt": "2026-04-01T10:00:00.000Z"
  }
]`);

  const load = async () => {
    const res = await fetch('/api/comps/sold');
    const data = await res.json();
    setRows(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5">
      <div className="text-xl font-black">Sold Comps</div>
      <input
        value={sourceCode}
        onChange={(e) => setSourceCode(e.target.value)}
        placeholder="Source code"
        className="rounded-xl border border-border px-4 py-3 text-sm"
      />
      <textarea
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        className="min-h-48 w-full rounded-xl border border-border px-4 py-3 text-sm"
      />
      <button
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        onClick={async () => {
          await fetch('/api/comps/ingest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sourceCode,
              comps: JSON.parse(payload),
            }),
          });
          load();
        }}
      >
        Ingest Comps
      </button>
      <div className="space-y-2">
        {rows.slice(0, 20).map((row) => (
          <div key={row.id} className="rounded-xl border border-border p-3">
            <div className="font-bold">{row.title}</div>
            <div className="mt-1 text-sm text-slate-500">
              {row.sourceCode} • sold {row.soldPrice}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {row.extractedSetNo ?? '—'} • {row.soldAt ?? row.createdAt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}