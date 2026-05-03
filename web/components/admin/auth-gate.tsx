'use client';

import { useEffect, useState } from 'react';

type Props = {
  children: React.ReactNode;
};

export function AuthGate({ children }: Props) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          cache: 'no-store',
        });

        if (!response.ok) {
          window.location.href = '/login';
          return;
        }

        setReady(true);
      } catch {
        window.location.href = '/login';
      }
    };

    check();
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm font-semibold text-slate-500">Checking access...</div>
      </div>
    );
  }

  return <>{children}</>;
}