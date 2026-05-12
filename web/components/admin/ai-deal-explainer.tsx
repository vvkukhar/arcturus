'use client';

import { useState } from 'react';
import { apiFetch } from '@/lib/client-api';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';

export function AiDealExplainer({ item }: { item: any }) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const data = await apiFetch('/api/proxy/ai/explain-deal', {
        method: 'POST',
        body: JSON.stringify({
          title: item.titleSnapshot,
          buyPrice: item.totalCost,
          marketPrice: item.expectedSalePriceManual,
          condition: item.condition,
        }),
      });
      setResult(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-indigo-600 flex items-center gap-2">
          <Sparkles size={18} /> Arcturus AI Analysis
        </h3>
        <Button onClick={handleAnalyze} disabled={loading} size="sm">
          {loading ? <Loader2 className="animate-spin" /> : 'Run AI'}
        </Button>
      </div>
      {result && (
        <div className="text-sm font-medium text-slate-700 dark:text-slate-300 animate-in fade-in">
          <p className="mb-2 font-bold text-indigo-500">{result.verdict}</p>
          <ul className="list-disc pl-4 space-y-1">
            {result.points?.map((p: string, i: number) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}