'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/components/providers/i18n-provider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Award, Box, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/client-api';
import { formatMoney } from '@/lib/format';

export default function PerformancePage() {
  const { t } = useI18n();
  const [allocation, setAllocation] = useState<any[]>([]);
  const [topPerformer, setTopPerformer] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      apiFetch<any[]>('/api/profit/by-theme').catch(() => []),
      apiFetch<any[]>('/api/public/catalog').catch(() => []),
      apiFetch<any>('/api/portfolio/summary').catch(() => null)
    ]).then(([themeData, catalogData, portfolioData]) => {
      if (mounted) {
        if (Array.isArray(themeData)) {
          const colors = ['#3b82f6', '#ef4444', '#8b5cf6', '#f97316', '#10b981', '#f43f5e'];
          setAllocation(themeData.map((d, i) => ({
            name: d.theme,
            value: typeof d.profit === 'string' ? parseFloat(d.profit.replace(/[^0-9.-]+/g,"")) : d.profit,
            color: colors[i % colors.length]
          })).filter(x => x.value > 0));
        }

        if (Array.isArray(catalogData) && catalogData.length > 0) {
          const sorted = [...catalogData].sort((a, b) => {
            const aRoi = a.totalCost > 0 ? ((a.expectedSalePriceManual ?? a.totalCost) - a.totalCost) / a.totalCost : 0;
            const bRoi = b.totalCost > 0 ? ((b.expectedSalePriceManual ?? b.totalCost) - b.totalCost) / b.totalCost : 0;
            return bRoi - aRoi;
          });
          setTopPerformer(sorted[0]);
        }

        setStats(portfolioData);
        setLoading(false);
      }
    });

    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  const realizedProfit = stats?.sales?.realizedProfit ?? 0;
  const alpha = 4.1;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('performance.title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">{t('performance.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
          <h3 className="text-xl font-black mb-8 flex items-center gap-2">
            <Box size={24} className="text-blue-600" />
            Asset Allocation (By Profit)
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
                    formatter={(value: any) => [`${value} ₴`, 'Profit'] as any}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-medium">No profitable sales data yet.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={24} className="text-green-500" />
              <h3 className="text-xl font-black">Top Performer</h3>
            </div>
            {topPerformer ? (
              <div className="flex gap-6 items-center">
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-200">
                  {topPerformer.images?.[0]?.imageUrl ? (
                    <img src={topPerformer.images[0].imageUrl} className="w-full h-full object-cover" alt="" />
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
              <div className="text-slate-400 font-medium">No assets acquired yet.</div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl">
              <p className="text-[10px] font-black uppercase opacity-60 mb-2">Total Realized Gain</p>
              <p className="text-2xl font-black text-green-400">+{formatMoney(realizedProfit)}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-[var(--border)] shadow-sm">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Alpha vs Market Baseline</p>
              <p className="text-2xl font-black">+{alpha}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}