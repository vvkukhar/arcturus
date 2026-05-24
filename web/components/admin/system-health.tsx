'use client';
import useSWR from 'swr';
import { Activity, Server, Database, AlertCircle } from 'lucide-react';

export function SystemHealth() {
  const { data } = useSWR('/api/admin/health', swrFetcher, { refreshInterval: 5000 });
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatusItem icon={Server} label="API" status={data?.status} />
      <StatusItem icon={Database} label="Postgres" status={data?.dbStatus} />
      {/* Тут відображаємо статус всіх 5 воркерів з Redis */}
    </div>
  );
}