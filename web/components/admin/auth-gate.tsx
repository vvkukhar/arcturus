'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

type Props = {
  children: React.ReactNode;
};

export function AuthGate({ children }: Props) {
  const [ready, setReady] = useState(false);
  const router = useRouter();

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
      } catch {
        if (mounted) router.replace('/login');
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <div className="text-sm font-bold uppercase tracking-widest text-slate-400">Authenticating...</div>
      </div>
    );
  }

  return <>{children}</>;
}