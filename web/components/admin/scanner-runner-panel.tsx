'use client';

import { useEffect, useState } from 'react';
import type { ScannerJob } from '@/lib/entities';
import { apiFetch } from '@/lib/client-api';

function parseListings(value: string): any[] {
  const parsed = JSON.parse(value);

  if (!Array.isArray(parsed)) {
    throw new Error('Listings payload must be a JSON array');
  }

  return parsed;
}

export function ScannerRunnerPanel() {
  const [jobs, setJobs] = useState<ScannerJob[]>([]);
  const [jobId, setJobId] = useState('');
  const [payload, setPayload] = useState(`[
  {
    "externalId": "listing-1",
    "title": "LEGO Ninjago 71700 Kai Mech",
    "price": 80,
    "url": "https://example.com/listing-1"
  }
]`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const data = await apiFetch<ScannerJob[]>('/api/scanner/jobs');
      const rows = Array.isArray(data) ? data : [];

      setJobs(rows);

      if (rows[0]?.id && !jobId) {
        setJobId(rows[0].id);
      }
    } catch {
      setJobs([]);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5">
      <div>
        <div className="text-xl font-black">Scanner Runner</div>
        <div className="mt-1 text-sm text-slate-500">
          Manually run scanner jobs with listing JSON.
        </div>
      </div>

      <select
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
        className="w-full rounded-xl border border-border px-4 py-3 text-sm"
      >
        <option value="">Select job</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.sourceCode} • {job.query || '—'} • {job.status}
          </option>
        ))}
      </select>

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
        disabled={loading || !jobId}
        onClick={async () => {
          try {
            setLoading(true);
            setError(null);

            const listings = parseListings(payload);

            await apiFetch('/api/scanner/jobs/run', {
              method: 'POST',
              body: JSON.stringify({
                jobId,
                listings,
              }),
            });

            await load();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Scanner run failed');
          } finally {
            setLoading(false);
          }
        }}
      >
        {loading ? 'Running...' : 'Run Job'}
      </button>
    </div>
  );
}