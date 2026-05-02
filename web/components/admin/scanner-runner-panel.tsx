'use client';

import { useEffect, useState } from 'react';
import type { ScannerJob } from '@/lib/entities';
import { apiFetch } from '@/lib/client-api';

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

  const load = async () => {
    const data = await apiFetch<ScannerJob[]>('/api/scanner/jobs');
    setJobs(Array.isArray(data) ? data : []);

    if (Array.isArray(data) && data[0]?.id && !jobId) {
      setJobId(data[0].id);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5">
      <div className="text-xl font-black">Scanner Runner</div>

      <select
        value={jobId}
        onChange={(e) => setJobId(e.target.value)}
        className="rounded-xl border border-border px-4 py-3 text-sm"
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
        className="min-h-48 w-full rounded-xl border border-border px-4 py-3 text-sm"
      />

      <button
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        onClick={async () => {
          await apiFetch('/api/scanner/jobs/run', {
            method: 'POST',
            body: JSON.stringify({
              jobId,
              listings: JSON.parse(payload),
            }),
          });

          load();
        }}
      >
        Run Job
      </button>
    </div>
  );
}