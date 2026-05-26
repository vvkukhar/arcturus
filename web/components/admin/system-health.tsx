'use client';

import useSWR from 'swr';
import { Activity, Server, Database, Box, Loader2 } from 'lucide-react';
import { swrFetcher } from '@/lib/swr-fetcher';

export function SystemHealth() {
  // Тягнемо з двох ендпоінтів бекенда: БД та Черги (BullMQ)
  const { data: dbData } = useSWR<any>('/api/proxy/metrics/db', swrFetcher, { refreshInterval: 10000 });
  const { data: qData } = useSWR<any[]>('/api/proxy/metrics/queues', swrFetcher, { refreshInterval: 10000 });

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
      <StatusItem 
        icon={Server} 
        label="API Gateway" 
        status={dbData ? 'healthy' : 'loading'} 
        sub={dbData ? `${dbData.latencyMs}ms` : ''} 
      />
      <StatusItem 
        icon={Database} 
        label="PostgreSQL" 
        status={dbData?.ok ? 'healthy' : 'loading'} 
      />
      <StatusItem 
        icon={Activity} 
        label="Redis / BullMQ" 
        status={qData ? 'healthy' : 'loading'} 
        sub={qData ? `${qData.reduce((s: number, q: any) => s + q.active, 0)} jobs active` : ''}
      />
      <StatusItem 
        icon={Box} 
        label="Scrapers" 
        status={qData?.find(q => q.name === 'scrapers')?.healthy ? 'healthy' : 'warning'} 
        sub={qData?.find(q => q.name === 'scrapers') ? `${qData.find(q => q.name === 'scrapers').waiting} waiting` : ''}
      />
    </div>
  );
}

function StatusItem({ icon: Icon, label, status, sub }: any) {
  const isHealthy = status === 'healthy';
  const isLoading = status === 'loading';

  return (
    <div className="flex items-center gap-3 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-sm">
      <div className={`p-2 rounded-xl ${isLoading ? 'bg-slate-100 text-slate-400' : isHealthy ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'}`}>
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Icon size={16} />}
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-black uppercase tracking-widest text-slate-500">{label}</span>
        <div className="flex items-center gap-1.5 mt-0.5">
          {!isLoading && <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-amber-500'}`} />}
          <span className="text-sm font-bold text-[var(--foreground)]">{isLoading ? 'Checking...' : isHealthy ? 'Online' : 'Degraded'}</span>
        </div>
        {sub && <span className="text-[10px] font-bold text-slate-400 mt-0.5">{sub}</span>}
      </div>
    </div>
  );
}