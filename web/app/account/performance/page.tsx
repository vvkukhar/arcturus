'use client';

import useSWR from 'swr';
import { useI18n } from '@/components/providers/i18n-provider';
import dynamic from 'next/dynamic';
import { TrendingUp, Award, Box, Loader2 } from 'lucide-react';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney } from '@/lib/format';
import Image from 'next/image';
import { ChartLoader } from '@/components/ui/chart-loader';

const ResponsiveContainer = dynamic(
  () => import('recharts').then((m) => m.ResponsiveContainer), 
  { ssr: false, loading: () => <ChartLoader /> }
);
const PieChart = dynamic(() => import('recharts').then((m) => m.PieChart), { ssr: false, loading: () => <ChartLoader /> });
const Pie = dynamic(() => import('recharts').then((m) => m.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then((m) => m.Cell), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((m) => m.Tooltip), { ssr: false });
const Legend = dynamic(() => import('recharts').then((m) => m.Legend), { ssr: false });

interface ThemeData {
  theme: string;
  profit: number | string;
}

interface CatalogData {
  totalCost: number;
  expectedSalePriceManual?: number;
  titleSnapshot: string;
  images?: { imageUrl: string }[];
}

interface PortfolioData {
  sales?: { realizedProfit: number };
}

const parseVal = (val: string | number | undefined): number => {
  if (val === undefined) return 0;
  return typeof val === 'string' ? parseFloat(val.replace(/[^0-9.-]+/g, "")) || 0 : val;
};

export default function PerformancePage() {
  const { t } = useI18n();

  const { data: themeData, isLoading: tLoading } = useSWR<ThemeData[]>('/api/profit/by-theme', swrFetcher);
  const { data: catalogData, isLoading: cLoading } = useSWR<CatalogData[]>('/api/public/catalog', swrFetcher);
  const { data: stats, isLoading: sLoading } = useSWR<PortfolioData>('/api/portfolio/summary', swrFetcher);

  if (tLoading || cLoading || sLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;
  }

  let allocation: { name: string; value: number; color: string }[] = [];
  if (Array.isArray(themeData)) {
    const colors = ['#3b82f6', '#ef4444', '#8b5cf6', '#f97316', '#10b981', '#f43f5e'];
    allocation = themeData.map((d, i) => ({
      name: d.theme,
      value: parseVal(d.profit),
      color: colors[i % colors.length]
    })).filter(x => x.value > 0);
  }

  let topPerformer = null;
  if (Array.isArray(catalogData) && catalogData.length > 0) {
    const sorted = [...catalogData].sort((a, b) => {
      const aRoi = a.totalCost > 0 ? ((a.expectedSalePriceManual ?? a.totalCost) - a.totalCost) / a.totalCost : 0;
      const bRoi = b.totalCost > 0 ? ((b.expectedSalePriceManual ?? b.totalCost) - b.totalCost) / b.totalCost : 0;
      return bRoi - aRoi;
    });
    topPerformer = sorted[0];
  }

  const realizedProfit = stats?.sales?.realizedProfit ?? 0;
  const alpha = 4.1;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('performance.title' as any)}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">{t('performance.subtitle' as any)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
          <h3 className="text-xl font-black mb-8 flex items-center gap-2">
            <Box size={24} className="text-blue-600" />
            {t('performance.assetAlloc' as any)}
          </h3>
          <div className="h-[350px] w-full">
            {allocation.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {allocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 'bold' }}
                    formatter={(value: any) => [`${formatMoney(value)}`, 'Profit']}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-medium">{t('performance.noSales' as any)}</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={24} className="text-green-500" />
              <h3 className="text-xl font-black">{t('performance.topPerformer' as any)}</h3>
            </div>
            {topPerformer ? (
              <div className="flex gap-6 items-center">
                <div className="relative w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden border border-[var(--border)]">
                  {topPerformer.images?.[0]?.imageUrl ? (
                    <Image src={topPerformer.images[0].imageUrl} fill className="object-cover mix-blend-multiply dark:mix-blend-normal" alt="" />
                  ) : (
                    <Award size={40} className="text-orange-500" />
                  )}
                </div>
                <div>
                  <p className="text-lg font-black leading-tight line-clamp-2">{topPerformer.titleSnapshot}</p>
                  <p className="text-sm text-slate-500 font-bold mt-1">
                    ROI: {topPerformer.totalCost > 0 ? (((topPerformer.expectedSalePriceManual ?? topPerformer.totalCost) - topPerformer.totalCost) / topPerformer.totalCost * 100).toFixed(2) : 0}%
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 font-medium">{t('performance.noAssets' as any)}</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl">
              <p className="text-[10px] font-black uppercase opacity-60 mb-2 tracking-widest">{t('performance.totalGain' as any)}</p>
              <p className="text-2xl font-black text-green-400">+{formatMoney(realizedProfit)}</p>
            </div>
            <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">{t('performance.alpha' as any)}</p>
              <p className="text-2xl font-black">+{alpha}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}