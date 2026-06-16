'use client';

import { SWRConfig } from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { useEffect } from 'react';

export function SWRProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleUnauthorized = async () => {
      // Редіректимо на логін ТІЛЬКИ якщо юзер знаходиться в закритих зонах (Адмінка або Кабінет)
      const pathname = window.location.pathname;
      if (pathname.startsWith('/admin') || pathname.startsWith('/account')) {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch (e) {
          console.error('Failed to clear session', e);
        }
        window.location.href = '/login';
      }
    };
    
    window.addEventListener('arcturus:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('arcturus:unauthorized', handleUnauthorized);
  }, []);

  return (
    <SWRConfig
      value={{
        fetcher: swrFetcher,
        revalidateOnFocus: false,      
        revalidateOnReconnect: false,  
        revalidateIfStale: false,      
        dedupingInterval: 15000,       
        errorRetryCount: 1,            
        keepPreviousData: true,        
      }}
    >
      {children}
    </SWRConfig>
  );
}