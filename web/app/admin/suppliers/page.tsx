'use client';

import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { ShieldAlert, ShieldCheck, Shield, UserX, UserCheck, Loader2 } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { SectionCard } from '@/components/admin/section-card';
import { StatusPill } from '@/components/admin/status-pill';
import { apiFetch } from '@/lib/api';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminSuppliersPage() {
  const { data: suppliers, isLoading, mutate } = useSWR<any[]>('/api/admin/suppliers', swrFetcher);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const rows = Array.isArray(suppliers) ? suppliers : [];

  const updateStatus = async (id: string, action: 'trusted' | 'scammer') => {
    const notes = prompt(`Enter notes for this supplier (optional):`) ?? '';
    try {
      setLoadingId(`${action}-${id}`);
      await apiFetch(`/api/admin/suppliers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ action, notes }),
      });
      toast.success(`Supplier status updated to ${action}`);
      mutate();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 hardware-accelerated">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-lg">
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Supplier CRM (Radar)</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Manage seller reputation, Whitelist trusted sources, and block scammers.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-[var(--card)] p-6 rounded-[2rem] border border-[var(--border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl"><ShieldCheck size={24}/></div>
          <div>
            <div className="text-2xl font-black">{rows.filter(s => s.status === 'trusted').length}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trusted Partners</div>
          </div>
        </div>
        <div className="bg-[var(--card)] p-6 rounded-[2rem] border border-[var(--border)] shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl"><ShieldAlert size={24}/></div>
          <div>
            <div className="text-2xl font-black">{rows.filter(s => s.status === 'blacklisted').length}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Blacklisted (Scammers)</div>
          </div>
        </div>
      </div>

      <SectionCard title="Supplier Registry">
        <DataTable
          rows={rows}
          emptyText={isLoading ? "Loading reputation database..." : "No suppliers in registry yet."}
          getRowKey={(row) => row.id}
          columns={[
            {
              key: 'supplier',
              header: 'Platform & External ID',
              render: (row) => (
                <div className="flex flex-col">
                  <span className="font-bold text-[var(--foreground)] text-base">{row.name || 'Anonymous Seller'}</span>
                  <span className="text-xs font-mono text-slate-400 mt-0.5 uppercase tracking-wider">{row.sourceCode} • ID: {row.externalId}</span>
                </div>
              ),
            },
            {
              key: 'score',
              header: 'Trust Score',
              render: (row) => (
                <span className={`font-mono font-black text-sm ${row.trustScore >= 80 ? 'text-emerald-500' : row.trustScore <= 30 ? 'text-red-500' : 'text-slate-500'}`}>
                  {row.trustScore} / 100
                </span>
              ),
            },
            {
              key: 'status',
              header: 'Status',
              render: (row) => <StatusPill value={row.status} />,
            },
            {
              key: 'notes',
              header: 'Internal Notes',
              render: (row) => <span className="text-sm font-medium text-slate-500 truncate max-w-[200px]" title={row.notes}>{row.notes || '—'}</span>,
            },
            {
              key: 'actions',
              header: '',
              render: (row) => (
                <div className="flex justify-end gap-2">
                  <button
                    disabled={loadingId !== null || row.status === 'trusted'}
                    onClick={() => updateStatus(row.id, 'trusted')}
                    className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-40"
                    title="Mark as Trusted"
                  >
                    {loadingId === `trusted-${row.id}` ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
                  </button>
                  <button
                    disabled={loadingId !== null || row.status === 'blacklisted'}
                    onClick={() => updateStatus(row.id, 'scammer')}
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-40"
                    title="Blacklist Scammer"
                  >
                    {loadingId === `scammer-${row.id}` ? <Loader2 size={16} className="animate-spin" /> : <UserX size={16} />}
                  </button>
                </div>
              ),
            },
          ]}
        />
      </SectionCard>
    </div>
  );
}