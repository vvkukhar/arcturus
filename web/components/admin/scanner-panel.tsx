'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import type { ScannerSource } from '@/lib/types';
import { apiFetch } from '@/lib/api';
import { Loader2, Trash2 } from 'lucide-react';
import { getSocket } from '@/lib/socket';
import { toast } from 'sonner';

export function ScannerPanel() {
  const { data: rawSources, mutate: mutateSources } = useSWR<ScannerSource[]>('/api/scanner/sources', swrFetcher);
  const { mutate: mutateJobs } = useSWR('/api/scanner/jobs', swrFetcher, { refreshInterval: 3000 });

  const sources = Array.isArray(rawSources) ? rawSources : [];
  
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [sourceCode, setSourceCode] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState<'source' | 'job' | 'clear' | null>(null);

  useEffect(() => {
    const socket = getSocket();
    const handleJobUpdate = () => mutateJobs();
    
    socket.on('scanner.job_queued', handleJobUpdate);
    socket.on('scanner.job_completed', () => { mutateJobs(); toast.success('Скрапер успішно завершив роботу!'); });
    socket.on('scanner.job_failed', () => { mutateJobs(); toast.error('Помилка скрапера. Перевірте логи.'); });

    return () => {
      socket.off('scanner.job_queued', handleJobUpdate);
      socket.off('scanner.job_completed', handleJobUpdate);
      socket.off('scanner.job_failed', handleJobUpdate);
    };
  }, [mutateJobs]);

  const handleAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !code.trim() || !name.trim()) return;
    try {
      setLoading('source');
      await apiFetch('/api/scanner/sources', { 
        method: 'POST', 
        body: JSON.stringify({ code: code.trim(), name: name.trim(), type: 'manual', enabled: true }) 
      });
      setCode(''); 
      setName(''); 
      await mutateSources();
      toast.success('Джерело успішно додано!');
    } finally { 
      setLoading(null); 
    }
  };

  const handleEnqueueScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !sourceCode.trim()) return;
    try {
      setLoading('job');
      await apiFetch('/api/scanner/jobs', { 
        method: 'POST', 
        body: JSON.stringify({ sourceCode: sourceCode.trim(), query: query.trim() }) 
      });
      setQuery(''); 
      await mutateJobs();
      toast.success('Джоба додана в чергу! Скрапер запуститься протягом 5 секунд...');
    } finally { 
      setLoading(null); 
    }
  };

  const handleClearStuck = async () => {
    try {
      setLoading('clear');
      const res = await apiFetch<any>('/api/proxy/scanner/jobs/clear-stuck', { method: 'POST' });
      toast.success(`Очищено ${res?.data?.clearedCount ?? res?.clearedCount ?? 0} мертвих джобів`);
      await mutateJobs();
    } catch (e: any) {
      toast.error(e.message || 'Бекенд ще не оновився. Зачекайте пару хвилин.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col space-y-8 rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[var(--foreground)] tracking-tight">Scanner Control</h2>
          <p className="mt-1 text-sm font-medium text-slate-500">Manage scraping sources and enqueue parsing jobs.</p>
        </div>
        <button 
          onClick={handleClearStuck}
          disabled={loading !== null}
          className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
          title="Очистити завислі джоби"
        >
          {loading === 'clear' ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
        </button>
      </div>

      <form onSubmit={handleAddSource} className="space-y-4 bg-[var(--background)]/50 p-5 rounded-2xl border border-[var(--border)]">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Add New Source</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input required value={code} onChange={(e) => setCode(e.target.value)} placeholder="Source Code" className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-medium focus:border-blue-500 outline-none text-[var(--foreground)]" />
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Display Name" className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-medium focus:border-blue-500 outline-none text-[var(--foreground)]" />
        </div>
        <button type="submit" disabled={loading === 'source' || !code.trim() || !name.trim()} className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">
          {loading === 'source' && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading === 'source' ? 'Adding...' : 'Add Source'}
        </button>
      </form>

      <form onSubmit={handleEnqueueScan} className="space-y-4 bg-blue-500/10 p-5 rounded-2xl border border-blue-500/20">
        <h3 className="text-xs font-black uppercase tracking-widest text-blue-500">Enqueue Scan Job</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <select required value={sourceCode} onChange={(e) => setSourceCode(e.target.value)} className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-bold text-[var(--foreground)] focus:border-blue-500 outline-none cursor-pointer">
            <option value="" disabled>Select Source</option>
            {sources.map((source) => <option key={source.code} value={source.code}>{source.name}</option>)}
          </select>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Query (Optional)" className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-medium focus:border-blue-500 outline-none text-[var(--foreground)]" />
        </div>
        <button type="submit" disabled={loading === 'job' || !sourceCode} className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">
          {loading === 'job' && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading === 'job' ? 'Enqueueing...' : 'Enqueue Scan'}
        </button>
      </form>
    </div>
  );
}