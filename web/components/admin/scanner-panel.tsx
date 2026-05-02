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

  const load = async () => {
    const [sourcesRes, jobsRes] = await Promise.all([
      apiFetch<ScannerSource[]>('/api/scanner/sources'),
      apiFetch<ScannerJob[]>('/api/scanner/jobs'),
    ]);

    setSources(Array.isArray(sourcesRes) ? sourcesRes : []);
    setJobs(Array.isArray(jobsRes) ? jobsRes : []);

    if (Array.isArray(sourcesRes) && sourcesRes[0]?.code && !sourceCode) {
      setSourceCode(sourcesRes[0].code);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4 rounded-2xl border border-border bg-white p-5">
      <div className="text-xl font-black">Scanner</div>

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
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        onClick={async () => {
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
          load();
        }}
      >
        Add Source
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
        className="rounded-xl border border-border px-4 py-2 text-sm font-semibold"
        onClick={async () => {
          await apiFetch('/api/scanner/jobs', {
            method: 'POST',
            body: JSON.stringify({
              sourceCode,
              query,
            }),
          });

          setQuery('');
          load();
        }}
      >
        Enqueue Scan
      </button>

      <div className="space-y-2">
        <div className="text-sm font-bold text-slate-500">Sources</div>
        {sources.map((source) => (
          <div
            key={source.code}
            className="rounded-xl border border-border p-3 text-sm"
          >
            <div className="font-bold">{source.name}</div>
            <div className="text-slate-500">{source.code}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="text-sm font-bold text-slate-500">Jobs</div>
        {jobs.map((job) => (
          <div
            key={job.id}
            className="rounded-xl border border-border p-3 text-sm"
          >
            <div className="font-bold">{job.sourceCode}</div>
            <div className="text-slate-500">{job.query || '—'}</div>
            <div className="text-xs text-slate-400">{job.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}