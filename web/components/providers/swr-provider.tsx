'use client';

import { SWRConfig } from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { useEffect } from 'react';

export function SWRProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleUnauthorized = async () => {
      try {
        // ФІКС: Жорстко вбиваємо сесію на сервері перед редиректом, 
        // щоб Middleware не завернув нас назад на дашборд.
        await fetch('/api/auth/logout', { method: 'POST' });
      } catch (e) {
        console.error('Failed to clear session', e);
      }
      window.location.href = '/login';
    };
    
    window.addEventListener('arcturus:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('arcturus:unauthorized', handleUnauthorized);
  }, []);

  return (
    <SWRConfig
      value={{
        fetcher: swrFetcher,
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
        revalidateIfStale: false,
        focusThrottleInterval: 5000,
        errorRetryCount: 3,
        errorRetryInterval: 2000,
        dedupingInterval: 5000,
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}