'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
        await fetch('/api/auth/logout', { method: 'POST' });
        if (mounted) {
          window.location.href = '/login';
        }
      }
    };

    checkAuth();

    const timeout = setTimeout(() => {
      if (!ready && mounted) {
         setErrorMsg("Бекенд не відповідає. Перевір, чи запущений NestJS на порту 4000.");
      }
    }, 8000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [ready]);

  if (errorMsg) {
    return (
      <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-slate-900 text-white gap-4 p-6 text-center">
        <div className="text-xl font-black text-red-500">Помилка з'єднання</div>
        <p className="text-slate-400">{errorMsg}</p>
        <button 
          onClick={() => window.location.href = '/login'} 
          className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
        >
          Повернутися на сторінку входу
        </button>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-slate-900 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <div className="text-sm font-bold uppercase tracking-widest text-slate-400">Authenticating...</div>
      </div>
    );
  }

  return <>{children}</>;
}