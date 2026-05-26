'use client';

import { useState, useCallback } from 'react';
import useSWR from 'swr';
import type { User } from '@/lib/types';
import { apiFetch } from '@/lib/api';
import { Loader2, Plus, UserCircle, UserX, UserCheck } from 'lucide-react';
import { StatusPill } from '@/components/admin/status-pill';
import { swrFetcher } from '@/lib/swr-fetcher';

export function UserManagement() {
  const { data, isLoading, mutate } = useSWR<User[]>('/api/collaboration/users', swrFetcher);
  const users = Array.isArray(data) ? data : [];

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;

    try {
      setLoading(true);
      await apiFetch('/api/collaboration/users', {
        method: 'POST',
        body: JSON.stringify({ name: name.trim(), role: 'operator' }),
      });
      setName('');
      await mutate();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add user');
    } finally {
      setLoading(false);
    }
  }, [name, loading, mutate]);

  return (
    <div className="space-y-6 rounded-[2rem] border border-border bg-white p-6 shadow-sm flex flex-col h-full">
      <div>
        <h2 className="text-xl font-black text-slate-900">User Management</h2>
        <p className="mt-1 text-sm font-medium text-slate-500">Add operators and manage collaboration.</p>
      </div>

      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New user name"
          className="flex-1 rounded-xl border border-border bg-slate-50 px-4 py-2 text-sm focus:bg-white focus:border-blue-500 outline-none transition-all"
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 min-h-[200px]">
        {isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 text-sm text-slate-400">
            No users found.
          </div>
        ) : (
          users.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-xl border border-border bg-slate-50 p-4 transition-colors hover:bg-white hover:shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <UserCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{u.name}</div>
                  <div className="text-xs font-mono text-slate-400 mt-0.5">ID: {u.id.slice(0, 8)}...</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <StatusPill value={u.active ? u.role : 'banned'} />
                <button 
                  onClick={async () => {
                    if (!confirm(`Точно ${u.active ? 'звільнити' : 'поновити'} ${u.name}?`)) return;
                    try {
                        await apiFetch(`/api/proxy/users/${u.id}`, {
                          method: 'PATCH',
                          body: JSON.stringify({ active: !u.active })
                        });
                        mutate();
                    } catch (e) {
                        alert('Помилка оновлення статусу користувача');
                    }
                  }}
                  className={`p-2 rounded-lg transition-colors ${u.active ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                  title={u.active ? "Заблокувати" : "Розблокувати"}
                >
                  {u.active ? <UserX size={18} /> : <UserCheck size={18} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}