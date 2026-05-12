'use client';

import { use } from 'react';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { Loader2 } from 'lucide-react';

export default function SellOpportunityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading } = useSWR<any>(`/api/admin/opportunities/sell/${id}`, swrFetcher as any);

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-blue-500" /></div>;
  if (!data) return <div className="p-10 text-center font-bold text-slate-500">Opportunity not found</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-[var(--foreground)]">Sell Details</h1>
        <p className="mt-1 text-sm text-slate-500 font-mono">Item ID: {id}</p>
      </div>
      <pre className="p-4 bg-slate-900 text-slate-300 rounded-xl overflow-x-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}