'use client';

import { useState } from 'react';

type Props = {
  endpoint: string;
  filename: string;
};

function toCsvValue(value: unknown): string {
  if (value == null) return '';

  if (typeof value === 'object') {
    return JSON.stringify(JSON.stringify(value));
  }

  return JSON.stringify(String(value));
}

export function ExportCsvButton({ endpoint, filename }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={async () => {
          try {
            setLoading(true);
            setError(null);

            const res = await fetch(endpoint, {
              cache: 'no-store',
            });

            if (!res.ok) {
              throw new Error(`Export failed: ${res.status}`);
            }

            const data = await res.json();
            const rows: Record<string, unknown>[] = Array.isArray(data)
              ? data.filter(
                  (row): row is Record<string, unknown> =>
                    row != null && typeof row === 'object' && !Array.isArray(row),
                )
              : [];

            if (rows.length === 0) {
              setError('Nothing to export');
              return;
            }

            const keySet = new Set<string>();

            for (const row of rows) {
              for (const key of Object.keys(row)) {
                keySet.add(key);
              }
            }

            const keys = Array.from(keySet);

            const csv = [
              keys.join(','),
              ...rows.map((row) =>
                keys.map((key) => toCsvValue(row[key])).join(','),
              ),
            ].join('\n');

            const blob = new Blob([csv], {
              type: 'text/csv;charset=utf-8;',
            });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');

            a.href = url;
            a.download = filename;
            a.click();

            URL.revokeObjectURL(url);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Export failed');
          } finally {
            setLoading(false);
          }
        }}
        className="rounded-xl border border-border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
      >
        {loading ? 'Exporting...' : 'Export CSV'}
      </button>

      {error ? <div className="text-xs text-red-600">{error}</div> : null}
    </div>
  );
}