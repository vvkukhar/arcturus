'use client';

import useSWR from 'swr';
import { useI18n } from '@/components/providers/i18n-provider';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { swrFetcher } from '@/lib/swr-fetcher';

const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then((mod) => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false });

interface HistoricalData {
  date?: string;
  month?: string;
  revenue: number | string;
  grossProfit?: number | string;
  profit?: number | string;
}

const parseVal = (val: string | number | undefined): number => {
  if (val === undefined) return 0;
  return typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, "")) || 0 : val;
};

export default function HistoricalPage() {
  const { t } = useI18n();
  const { data: rawData, isLoading } = useSWR<HistoricalData[]>('/api/profit/monthly', swrFetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const history = Array.isArray(rawData) ? rawData.map(d => ({
    period: d.date || d.month,
    revenue: parseVal(d.revenue),
    profit: parseVal(d.grossProfit ?? d.profit)
  })) : [];

  const totalRevenue = history.reduce((sum, h) => sum + h.revenue, 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('historical.title' as any) as string}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">{t('historical.subtitle' as any) as string}</p>
        </div>
        <div className="bg-[var(--card)] px-4 py-2 border border-[var(--border)] rounded-xl font-bold text-sm">
          {t('historical.global' as any) as string}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[var(--card)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-lg flex items-center gap-2 text-[var(--foreground)]">
              <Calendar size={20} className="text-blue-600" />
              {t('historical.timeline' as any) as string}
            </h3>
          </div>
          <div className="h-[400px] w-full">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={history}>
                  <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'var(--background)' }}
                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 'bold' }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                  <Bar dataKey="revenue" name="Revenue ₴" radius={[8, 8, 0, 0]}>
                    {history.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === history.length - 1 ? '#2563eb' : '#cbd5e1'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-medium">{t('historical.noData' as any) as string}</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--background)] p-8 rounded-3xl border border-[var(--border)]">
            <h4 className="text-xs font-black uppercase text-slate-400 mb-6 tracking-widest">{t('historical.metrics' as any) as string}</h4>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">{t('historical.totalRev' as any) as string}</p>
                <p className="text-2xl font-black text-[var(--foreground)]">{new Intl.NumberFormat('uk-UA').format(totalRevenue)} ₴</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">{t('historical.activePeriods' as any) as string}</p>
                <p className="text-2xl font-black text-[var(--foreground)]">{history.length}</p>
              </div>
            </div>
          </div>
          
          <button className="w-full p-6 bg-[var(--card)] border border-[var(--border)] hover:border-blue-600 rounded-3xl transition-all flex items-center justify-between group">
            <div className="text-left">
              <p className="font-black text-lg text-[var(--foreground)]">{t('historical.compare' as any) as string}</p>
              <p className="text-sm text-slate-500 font-medium">{t('historical.relative' as any) as string}</p>
            </div>
            <ArrowRight size={20} className="text-[var(--foreground)] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}