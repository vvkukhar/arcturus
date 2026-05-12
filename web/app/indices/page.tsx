'use client';

import useSWR from 'swr';
import dynamic from 'next/dynamic';
import { Activity, Star, Zap, Loader2 } from 'lucide-react';
import { useI18n } from '@/components/providers/i18n-provider';
import { swrFetcher } from '@/lib/swr-fetcher';

const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });

interface ThemeData {
  theme: string;
  revenue: number | string;
  profit: number | string;
  roiPercent: number;
}

const parseVal = (val: string | number | undefined): number => {
  if (val === undefined) return 0;
  return typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, "")) || 0 : val;
};

export default function IndicesPage() {
  const { t } = useI18n();
  const { data: rawData, isLoading } = useSWR<ThemeData[]>('/api/profit/by-theme', swrFetcher);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const themes = Array.isArray(rawData) ? rawData : [];

  const getThemeData = (themeName: string) => {
    const found = themes.find(t => t.theme === themeName);
    return {
      revenue: found ? parseVal(found.revenue) : 0,
      profit: found ? parseVal(found.profit) : 0,
      roi: found?.roiPercent ?? 0
    };
  };

  const starwars = getThemeData('Star Wars');
  const ninjago = getThemeData('Ninjago');
  const technic = getThemeData('Technic');

  const chartData = themes.slice(0, 8).map(t => ({
    name: t.theme,
    profit: parseVal(t.profit)
  }));

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('indices.title' as any) as string}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">{t('indices.subtitle' as any) as string}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-blue-500">
            <Star size={24} />
            <span className="font-bold">{t('indices.swPerf' as any) as string}</span>
          </div>
          <p className="text-3xl font-black">{starwars.roi}% ROI</p>
          <p className="text-sm font-bold text-green-500 mt-1">{t('indices.realized' as any) as string}: {starwars.profit}</p>
        </div>
        <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-red-500">
            <Zap size={24} />
            <span className="font-bold">{t('indices.njPerf' as any) as string}</span>
          </div>
          <p className="text-3xl font-black">{ninjago.roi}% ROI</p>
          <p className="text-sm font-bold text-green-500 mt-1">{t('indices.realized' as any) as string}: {ninjago.profit}</p>
        </div>
        <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-orange-500">
            <Activity size={24} />
            <span className="font-bold">{t('indices.tcPerf' as any) as string}</span>
          </div>
          <p className="text-3xl font-black">{technic.roi}% ROI</p>
          <p className="text-sm font-bold text-green-500 mt-1">{t('indices.realized' as any) as string}: {technic.profit}</p>
        </div>
      </div>

      <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
        <h3 className="font-black text-xl mb-6 ml-4">{t('indices.profitByTheme' as any) as string}</h3>
        <div className="h-[500px] w-full mt-4">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 'bold' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Line type="monotone" dataKey="profit" name="Profit ₴" stroke="#3b82f6" strokeWidth={4} dot={{ r: 6, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 font-medium">{t('indices.noData' as any) as string}</div>
          )}
        </div>
      </div>
    </div>
  );
}