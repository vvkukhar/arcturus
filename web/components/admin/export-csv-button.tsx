'use client';

import { useState } from 'react';

type Props = {
  endpoint: string;
  filename: string;
};

export function ExportCsvButton({ endpoint, filename }: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={async () => {
        try {
          setLoading(true);
          const res = await fetch(endpoint);
          const data = await res.json();
          const keys = Object.keys(data[0] || {});
          const csv = [
            keys.join(','),
            ...data.map((row: any) =>
              keys.map((k) => JSON.stringify(row[k] ?? '')).join(','),
            ),
          ].join('\n');
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
        } finally {
          setLoading(false);
        }
      }}
      className="rounded-xl border px-4 py-2 text-sm"
    >
      {loading ? 'Exporting...' : 'Export CSV'}
    </button>
  );
}