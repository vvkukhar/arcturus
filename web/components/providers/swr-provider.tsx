// web/components/providers/swr-provider.tsx
'use client';

import { SWRConfig } from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { useEffect } from 'react';

export function SWRProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleUnauthorized = async () => {
      try {
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
        // 🔥 ВИМИКАЄМО АГРЕСИВНІ ОНОВЛЕННЯ 🔥
        revalidateOnFocus: false,      // Більше не оновлює дані при кліку на вікно
        revalidateOnReconnect: false,  // Не спамить запитами при відновленні інтернету
        revalidateIfStale: false,      // Кеш живе довше
        dedupingInterval: 15000,       // Не дублює запити протягом 15 секунд
        errorRetryCount: 1,            // Не спамить ретраями, якщо бекенд впав/спить
        keepPreviousData: true,        // Тримає старі дані на екрані, поки вантажаться нові (без блимань)
      }}
    >
      {children}
    </SWRConfig>
  );
}