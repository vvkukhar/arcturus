'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error('Unauthorized');
        }

        if (mounted) setReady(true);
      } catch (error) {
        // Якщо бекенд не відповів або токен протух - ПРИМУСОВО чистимо куку
        await fetch('/api/auth/logout', { method: 'POST' });
        
        // Робимо hard redirect (не router.push), щоб збити кеш мідлвари
        if (mounted) {
          window.location.href = '/login';
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-[var(--background)] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <div className="text-sm font-bold uppercase tracking-widest text-slate-400">Authenticating...</div>
      </div>
    );
  }

  return <>{children}</>;
}