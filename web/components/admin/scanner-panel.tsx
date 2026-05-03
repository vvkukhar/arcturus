'use client';

import { useEffect, useState } from 'react';
import type { ScannerJob, ScannerSource } from '@/lib/entities';
import { apiFetch } from '@/lib/client-api';

export function ScannerPanel() {
  const [sources, setSources] = useState<ScannerSource[]>([]);
  const [jobs, setJobs] = useState<ScannerJob[]>([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const [sourcesRes, jobsRes] = await Promise.all([
        apiFetch<ScannerSource[]>('/api/scanner/sources'),
        apiFetch<ScannerJob[]>('/api/scanner/jobs'),
      ]);

      const sourceRows = Array.isArray(sourcesRes) ? sourcesRes : [];
      const jobRows = Array.isArray(jobsRes) ? jobsRes : [];

      setSources(sourceRows);
      setJobs(jobRows);

      if (sourceRows[0]?.code && !sourceCode) {
        setSourceCode(sourceRows[0].code);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scanner load failed');
      setSources([]);
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
        <div className="text-xl font-black">Scanner</div>
        <div className="mt-1 text-sm text-slate-500">
          Sources, queued scans, and scanner job creation.
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Source code"
          className="rounded-xl border border-border px-4 py-3 text-sm"
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Source name"
          className="rounded-xl border border-border px-4 py-3 text-sm"
        />
      </div>

      <button
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        disabled={loading === 'source' || !code || !name}
        onClick={async () => {
          try {
            setLoading('source');
            setError(null);

            await apiFetch('/api/scanner/sources', {
              method: 'POST',
              body: JSON.stringify({
                code,
                name,
                type: 'manual',
                enabled: true,
              }),
            });

            setCode('');
            setName('');
            await load();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Source create failed');
          } finally {
            setLoading(null);
          }
        }}
      >
        {loading === 'source' ? 'Adding...' : 'Add Source'}
      </button>

      <div className="grid gap-3 md:grid-cols-2">
        <select
          value={sourceCode}
          onChange={(e) => setSourceCode(e.target.value)}
          className="rounded-xl border border-border px-4 py-3 text-sm"
        >
          <option value="">Select source</option>
          {sources.map((source) => (
            <option key={source.code} value={source.code}>
              {source.name}
            </option>
          ))}
        </select>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Scan query"
          className="rounded-xl border border-border px-4 py-3 text-sm"
        />
      </div>

      <button
        className="rounded-xl border border-border px-4 py-2 text-sm font-semibold disabled:opacity-60"
        disabled={loading === 'job' || !sourceCode}
        onClick={async () => {
          try {
            setLoading('job');
            setError(null);

            await apiFetch('/api/scanner/jobs', {
              method: 'POST',
              body: JSON.stringify({
                sourceCode,
                query,
              }),
            });

            setQuery('');
            await load();
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Scan enqueue failed');
          } finally {
            setLoading(null);
          }
        }}
      >
        {loading === 'job' ? 'Enqueueing...' : 'Enqueue Scan'}
      </button>

      <div className="space-y-2">
        <div className="text-sm font-bold text-slate-500">Sources</div>
        {sources.length === 0 ? (
          <div className="text-sm text-slate-500">No sources</div>
        ) : (
          sources.map((source) => (
            <div
              key={source.code}
              className="rounded-xl border border-border p-3 text-sm"
            >
              <div className="font-bold">{source.name}</div>
              <div className="text-slate-500">{source.code}</div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-2">
        <div className="text-sm font-bold text-slate-500">Jobs</div>
        {jobs.length === 0 ? (
          <div className="text-sm text-slate-500">No jobs</div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-border p-3 text-sm"
            >
              <div className="font-bold">{job.sourceCode}</div>
              <div className="text-slate-500">{job.query || '—'}</div>
              <div className="text-xs text-slate-400">{job.status}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}