'use client';

import { useEffect, useState } from 'react';
import type { CollaborationUser } from '@/lib/entities';
import { apiFetch } from '@/lib/client-api';

export function UserManagement() {
  const [users, setUsers] = useState<CollaborationUser[]>([]);
  const [name, setName] = useState('');

  const load = async () => {
    const data = await apiFetch<CollaborationUser[]>('/api/collaboration/users');
    setUsers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4 rounded-2xl border p-5 bg-white">
      <div className="text-xl font-black">Users</div>

      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="flex-1 rounded-xl border px-3 py-2"
        />

        <button
          onClick={async () => {
            if (!name) return;

            await apiFetch('/api/collaboration/users', {
              method: 'POST',
              body: JSON.stringify({ name }),
            });

            setName('');
            load();
          }}
          className="rounded-xl bg-slate-900 px-4 py-2 text-white"
        >
          Add
        </button>
      </div>

      {users.map((u) => (
        <div key={u.id} className="border rounded-xl p-3">
          <div className="font-bold">{u.name}</div>
          <div className="text-xs text-slate-500">{u.role}</div>
        </div>
      ))}
    </div>
  );
}