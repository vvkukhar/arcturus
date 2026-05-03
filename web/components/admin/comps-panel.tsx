'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';

function parseJsonArray(value: string): any[] {
  const parsed = JSON.parse(value);

  if (!Array.isArray(parsed)) {
    throw new Error('Payload must be a JSON array');
  }

  return parsed;
}

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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await apiFetch<any[]>('/api/comps/sold');
      setRows(Array.isArray(data) ? data : []);
    } catch {
      setRows([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5">
      <div>
        <div className="text-xl font-black">Sold Comps</div>
        <div className="mt-1 text-sm text-slate-500">
          Ingest sold-market examples for pricing intelligence.
        </div>
      </div>

      <input
        value={sourceCode}
        onChange={(e) => setSourceCode(e.target.value)}
        placeholder="Source code"
        className="w-full rounded-xl border border-border px-4 py-3 text-sm"
      />

      <textarea
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        className="min-h-48 w-full rounded-xl border border-border px-4 py-3 font-mono text-sm"
      />

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <button
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        disabled={loading}
        onClick={async () => {
          try {
            setLoading(true);
            setError(null);

            const comps = parseJsonArray(payload);

            await apiFetch('/api/comps/ingest', {
              method: 'POST',
              body: JSON.stringify({
                sourceCode,
                comps,
              }),
            });

            await load();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Invalid payload or ingest failed');
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? 'Ingesting...' : 'Ingest Comps'}
      </button>

      <div className="space-y-2">
        {rows.length === 0 ? (
          <div className="text-sm text-slate-500">No sold comps</div>
        ) : (
          rows.slice(0, 20).map((row) => (
            <div key={row.id} className="rounded-xl border border-border p-3">
              <div className="font-bold">{row.title}</div>
              <div className="mt-1 text-sm text-slate-500">
                {row.sourceCode ?? '—'} • sold {row.soldPrice ?? '—'}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                {row.extractedSetNo ?? '—'} • {row.soldAt ?? row.createdAt ?? '—'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}