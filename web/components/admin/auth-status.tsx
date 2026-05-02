'use client';

import { useEffect, useState } from 'react';

export function AuthStatus() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (r) => {
        if (!r.ok) return null;
        return r.json();
      })
      .then(setUser);
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