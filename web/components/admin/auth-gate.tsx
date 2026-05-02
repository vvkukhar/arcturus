'use client';

import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

export function AuthGate({ children }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem('arcturus_admin_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm font-semibold text-slate-500">Checking access…</div>
      </div>
    );
  }

  return <>{children}</>;
}