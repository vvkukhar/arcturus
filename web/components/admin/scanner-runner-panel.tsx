'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import type { ScannerJob } from '@/lib/types';
import { apiFetch } from '@/lib/api';
import { Loader2, PlaySquare } from 'lucide-react';
import { swrFetcher } from '@/lib/swr-fetcher';

interface ListingPayload {
  externalId: string;
  title: string;
  price: number;
  url: string;
}

function parseListings(value: string): ListingPayload[] {
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      throw new Error('Listings payload must be a JSON array');
    }
    return parsed as ListingPayload[];
  } catch {
    throw new Error('Invalid JSON format');
  }
}

export function ScannerRunnerPanel() {
  const { data: rawJobs, mutate } = useSWR<ScannerJob[]>('/api/scanner/jobs', swrFetcher);
  const jobs = Array.isArray(rawJobs) ? rawJobs : [];

  const [jobId, setJobId] = useState('');
  const [payload, setPayload] = useState(`[\n  {\n    "externalId": "listing-1",\n    "title": "LEGO Ninjago 71700 Kai Mech",\n    "price": 80,\n    "url": "[https://example.com/listing-1](https://example.com/listing-1)"\n  }\n]`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (jobs.length > 0 && !jobId) {
      setJobId(jobs[0].id);
    }
  }, [jobs, jobId]);

  const handleRun = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId || loading) return;

    try {
      setLoading(true);
      setError(null);

      const listings = parseListings(payload);

      await apiFetch('/api/scanner/jobs/run', {
        method: 'POST',
        body: JSON.stringify({ jobId, listings }),
      });

      setPayload('[\n\n]');
      await mutate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scanner run failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm transition-all hover:shadow-md h-full flex flex-col">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md">
          <PlaySquare className="h-5 w-5 text-white"/>
        </div>
        <div>
          <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Manual Payload Runner</h2>
          <p className="text-sm font-medium text-slate-500">Inject custom JSON payload directly into an active scanner job.</p>
        </div>
      </div>

      <form onSubmit={handleRun} className="space-y-5 flex-1 flex flex-col">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Target Job</label>
          <select
            required
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold text-[var(--foreground)] focus:bg-[var(--card)] focus:border-emerald-500 outline-none cursor-pointer transition-all shadow-sm"
          >
            <option value="" disabled>Select active job</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.sourceCode} • {job.status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5 flex-1 flex flex-col">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Listings JSON</label>
          <textarea
            required
            value={payload}
            onChange={(e) => setPayload(e.target.value)}
            className="flex-1 min-h-[220px] w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 font-mono text-xs md:text-sm text-[var(--foreground)] focus:bg-[var(--card)] focus:border-emerald-500 outline-none transition-all shadow-sm custom-scrollbar"
            spellCheck={false}
          />
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm dark:bg-red-900/20 dark:border-red-900/50 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !jobId || !payload.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-md shadow-emerald-600/20"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin"/>}
          {loading ? 'Executing...' : 'Run Payload'}
        </button>
      </form>
    </div>
  );
}