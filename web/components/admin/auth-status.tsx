'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/client-api';

export function AuthStatus() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    apiFetch<any>('/api/auth/me')
      .then((data) => {
        if (mounted) setUser(data);
      })
      .catch(() => {
        if (mounted) setUser(null);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-white p-4 text-sm">
      {user ? (
        <div>
          <div className="font-bold">{user.name}</div>
          <div className="text-slate-500">{user.role}</div>
        </div>
      ) : (
        <div className="text-slate-500">No session</div>
      )}
    </div>
  );
}