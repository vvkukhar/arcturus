'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AuthGate({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
  const [status, setStatus] = useState<'loading' | 'authorized' | 'forbidden'>('loading');
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!response.ok) throw new Error('Unauthorized');
        
        const user = await response.json();
        
        if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
          setStatus('forbidden');
        } else {
          setStatus('authorized');
        }
      } catch {
        if (mounted) router.push('/login');
      }
    };

    checkAuth();
    return () => { mounted = false; };
  }, [requiredRole, router]);

  if (status === 'loading') {
    return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>;
  }

  if (status === 'forbidden') {
    return <div className="p-10 text-center font-bold text-red-500">Access Denied: Insufficient Permissions</div>;
  }

  return <>{children}</>;
}