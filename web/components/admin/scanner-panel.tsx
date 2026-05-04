'use client';

import { useEffect, useState } from 'react';
import type { ScannerJob, ScannerSource } from '@/lib/types';
import { apiFetch } from '@/lib/client-api';
import { Loader2 } from 'lucide-react';
import { StatusPill } from '@/components/admin/status-pill';

export function ScannerPanel() {
  const [sources, setSources] = useState<ScannerSource[]>([]);
  const [jobs, setJobs] = useState<ScannerJob[]>([]);
  
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [query, setQuery] = useState('');
  
  const [loading, setLoading] = useState<'source' | 'job' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [sourcesRes, jobsRes] = await Promise.all([
        apiFetch<ScannerSource[]>('/api/scanner/sources'),
        apiFetch<ScannerJob[]>('/api/scanner/jobs'),
      ]);

      const sourceRows = Array.isArray(sourcesRes) ? sourcesRes : [];
      const jobRows = Array.isArray(jobsRes) ? jobsRes : [];

      setSources(sourceRows);
      setJobs(jobRows);

      if (sourceRows.length > 0 && !sourceCode) {
        setSourceCode(sourceRows[0].code);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load scanner data');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !name) return;
    
    try {
      setLoading('source');
      setError(null);
      await apiFetch('/api/scanner/sources', {
        method: 'POST',
        body: JSON.stringify({ code, name, type: 'manual', enabled: true }),
      });
      setCode('');
      setName('');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add source');
    } finally {
      setLoading(null);
    }
  };

  const handleEnqueueScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceCode) return;

    try {
      setLoading('job');
      setError(null);
      await apiFetch('/api/scanner/jobs', {
        method: 'POST',
        body: JSON.stringify({ sourceCode, query }),
      });
      setQuery('');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enqueue scan');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-8 rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-black text-slate-900">Scanner Control</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">Manage scraping sources and enqueue parsing jobs.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleAddSource} className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Add New Source</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Source Code (e.g. ebay_uk)"
            className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Display Name (e.g. eBay UK)"
            className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading === 'source' || !code || !name}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-50"
        >
          {loading === 'source' && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading === 'source' ? 'Adding...' : 'Add Source'}
        </button>
      </form>

      <div className="h-px w-full bg-slate-100" />

      <form onSubmit={handleEnqueueScan} className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Enqueue Scan Job</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <select
            required
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer"
          >
            <option value="" disabled>Select Source</option>
            {sources.map((source) => (
              <option key={source.code} value={source.code}>{source.name}</option>
            ))}
          </select>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Query (Optional)"
            className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading === 'job' || !sourceCode}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {loading === 'job' && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading === 'job' ? 'Enqueueing...' : 'Enqueue Scan'}
        </button>
      </form>

      <div className="grid gap-6 md:grid-cols-2 pt-4">
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Active Sources</h3>
          <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
            {sources.length === 0 ? (
              <div className="text-sm text-slate-400">No sources configured.</div>
            ) : (
              sources.map((source) => (
                <div key={source.code} className="flex items-center justify-between rounded-xl border border-border bg-slate-50 p-3">
                  <div className="font-bold text-slate-900">{source.name}</div>
                  <div className="font-mono text-xs text-slate-500">{source.code}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Recent Jobs</h3>
          <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
            {jobs.length === 0 ? (
              <div className="text-sm text-slate-400">No recent jobs.</div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="flex flex-col gap-2 rounded-xl border border-border bg-slate-50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-xs font-bold text-slate-900">{job.sourceCode}</div>
                    <StatusPill value={job.status} />
                  </div>
                  {job.query && <div className="text-sm text-slate-600 truncate">{job.query}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}