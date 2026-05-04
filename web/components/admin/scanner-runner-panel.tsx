'use client';

import { useEffect, useState } from 'react';
import type { ScannerJob } from '@/lib/types';
import { apiFetch } from '@/lib/client-api';
import { Loader2 } from 'lucide-react';
import { StatusPill } from '@/components/admin/status-pill';

interface ListingPayload {
  externalId: string;
  title: string;
  price: number;
  url: string;
}

function parseListings(value: string): ListingPayload[] {
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) {
    throw new Error('Listings payload must be a JSON array');
  }
  return parsed as ListingPayload[];
}

export function ScannerRunnerPanel() {
  const [jobs, setJobs] = useState<ScannerJob[]>([]);
  const [jobId, setJobId] = useState('');
  const [payload, setPayload] = useState(`[\n  {\n    "externalId": "listing-1",\n    "title": "LEGO Ninjago 71700 Kai Mech",\n    "price": 80,\n    "url": "https://example.com/listing-1"\n  }\n]`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadJobs = async () => {
    try {
      const data = await apiFetch<ScannerJob[]>('/api/scanner/jobs');
      const rows = Array.isArray(data) ? data : [];
      setJobs(rows);
      if (rows.length > 0 && !jobId) {
        setJobId(rows[0].id);
      }
    } catch {
      setJobs([]);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;

    try {
      setLoading(true);
      setError(null);

      const listings = parseListings(payload);

      await apiFetch('/api/scanner/jobs/run', {
        method: 'POST',
        body: JSON.stringify({ jobId, listings }),
      });

      setPayload('[\n\n]');
      await loadJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scanner run failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-black text-slate-900">Manual Scanner Runner</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">Inject custom JSON payload directly into a scanner job.</p>
      </div>

      <form onSubmit={handleRun} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Target Job</label>
          <select
            required
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 outline-none cursor-pointer"
          >
            <option value="" disabled>Select active job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.sourceCode} • {job.status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Listings JSON</label>
          <textarea
            required
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="min-h-[240px] w-full resize-y rounded-xl border border-border bg-slate-50 p-4 font-mono text-sm focus:bg-white focus:border-blue-500 outline-none"
            spellCheck={false}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !jobId || !payload.trim()}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Executing...' : 'Run Payload'}
        </button>
      </form>
    </div>
  );
}