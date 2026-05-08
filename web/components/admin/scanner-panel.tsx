'use client';

import { useEffect, useState, useCallback } from 'react';
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

  const loadData = useCallback(async () => {
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
  }, [sourceCode]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;
    
    try {
      setLoading('source');
      setError(null);
      await apiFetch('/api/scanner/sources', {
        method: 'POST',
        body: JSON.stringify({ code: code.trim(), name: name.trim(), type: 'manual', enabled: true }),
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
    if (!sourceCode.trim()) return;

    try {
      setLoading('job');
      setError(null);
      await apiFetch('/api/scanner/jobs', {
        method: 'POST',
        body: JSON.stringify({ sourceCode: sourceCode.trim(), query: query.trim() }),
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
    <div className="flex flex-col space-y-8 rounded-[2rem] border border-border bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-md">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Scanner Control</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">Manage scraping sources and enqueue parsing jobs.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-600 shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleAddSource} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Add New Source</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Source Code (e.g. ebay_uk)"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
          />
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Display Name (e.g. eBay UK)"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading === 'source' || !code.trim() || !name.trim()}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-black hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-md shadow-slate-900/20"
        >
          {loading === 'source' && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading === 'source' ? 'Adding...' : 'Add Source'}
        </button>
      </form>

      <form onSubmit={handleEnqueueScan} className="space-y-4 bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
        <h3 className="text-xs font-black uppercase tracking-widest text-blue-800/60">Enqueue Scan Job</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <select
            required
            value={sourceCode}
            onChange={(e) => setSourceCode(e.target.value)}
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all cursor-pointer shadow-sm"
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
            className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-medium focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading === 'job' || !sourceCode}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-md shadow-blue-600/20"
        >
          {loading === 'job' && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading === 'job' ? 'Enqueueing...' : 'Enqueue Scan'}
        </button>
      </form>

      <div className="grid gap-6 md:grid-cols-2 pt-6 border-t border-slate-100">
        <div className="space-y-3 flex flex-col h-full">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Active Sources</h3>
          <div className="flex-1 max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {sources.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-slate-100 text-sm font-bold text-slate-400">No sources configured</div>
            ) : (
              sources.map((source) => (
                <div key={source.code} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-white hover:border-slate-200">
                  <div className="font-bold text-slate-900">{source.name}</div>
                  <div className="font-mono text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-200/50 px-2 py-1 rounded-md">{source.code}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-3 flex flex-col h-full">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Recent Jobs</h3>
          <div className="flex-1 max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
            {jobs.length === 0 ? (
              <div className="flex h-24 items-center justify-center rounded-xl border-2 border-dashed border-slate-100 text-sm font-bold text-slate-400">No recent jobs</div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:bg-white hover:border-slate-200">
                  <div className="flex items-center justify-between">
                    <div className="font-mono text-xs font-black text-slate-700 uppercase tracking-wider">{job.sourceCode}</div>
                    <StatusPill value={job.status} />
                  </div>
                  {job.query && <div className="text-sm font-medium text-slate-500 truncate mt-1">Q: {job.query}</div>}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}