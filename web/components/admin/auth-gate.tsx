'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!response.ok) throw new Error('Unauthorized');
        if (mounted) setReady(true);
      } catch {
        await fetch('/api/auth/logout', { method: 'POST' });
        if (mounted) window.location.href = '/login';
      }
    };

    checkAuth();
    return () => { mounted = false; };
  }, []);

  if (!ready) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center bg-[var(--background)] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <div className="text-sm font-bold uppercase tracking-widest text-slate-400">Authenticating...</div>
      </div>
    );
  }

  return <>{children}</>;
}