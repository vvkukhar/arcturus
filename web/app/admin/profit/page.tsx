'use client';

import useSWR from 'swr';
import { Coins, Loader2, ArrowUpRight } from 'lucide-react';
import dynamic from 'next/dynamic';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney, formatPercent } from '@/lib/format';
import { MetricCard } from '@/components/admin/metric-card';

const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then((mod) => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });

interface ProfitSummary {
  totalProfit: number;
  totalRevenue: number;
  salesCount: number;
  avgProfitPerSale: number;
  realizedRoiPercent: number;
  expectedInventoryRevenue: number;
  expectedInventoryProfit: number;
  expectedInventoryRoiPercent: number;
}

interface MonthlyProfit {
  date: string;
  revenue: number;
  netProfit: number;
}

interface ThemeProfit {
  theme: string;
  salesCount: number;
  profit: number;
  roiPercent: number;
}

interface VelocityStats {
  soldPerDay: number;
  estimatedDaysToClear: number | null;
}

export default function AdminProfitPage() {
const { data: summary, isLoading: sLoading } = useSWR<ProfitSummary>('/api/proxy/profit/summary', swrFetcher);
  const { data: monthly = [], isLoading: mLoading } = useSWR<MonthlyProfit[]>('/api/proxy/profit/monthly', swrFetcher);
  const { data: themes = [], isLoading: tLoading } = useSWR<ThemeProfit[]>('/api/proxy/profit/by-theme', swrFetcher);
  const { data: velocity, isLoading: vLoading } = useSWR<VelocityStats>('/api/proxy/profit/velocity?days=30', swrFetcher);

  if (sLoading || mLoading || tLoading || vLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-lg shadow-emerald-500/20">
            <Coins className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Profit & Loss</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Realized gains, ROI tracking, and sales velocity.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Realized Profit</div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{formatMoney(summary?.totalProfit)}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Total Revenue" value={formatMoney(summary?.totalRevenue)} subtitle={`${summary?.salesCount ?? 0} total sales completed`} />
        <MetricCard title="Average Profit / Sale" value={formatMoney(summary?.avgProfitPerSale)} subtitle="Net gain per transaction" />
        <MetricCard title="Realized ROI" value={formatPercent(summary?.realizedRoiPercent)} subtitle="Return on sold capital" />
        <MetricCard title="Sales Velocity (30d)" value={`${velocity?.soldPerDay ?? 0} / day`} subtitle={velocity?.estimatedDaysToClear ? `Est. clear time: ${velocity.estimatedDaysToClear} days` : 'Insufficient data'} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Revenue & Profit Timeline</h2>
              <p className="text-sm font-medium text-slate-500">Daily financial performance</p>
            </div>
            <div className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wider uppercase">
              30 Days
            </div>
          </div>
          <div className="h-[350px] w-full">
            {monthly.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} dy={10} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '1rem', border: '1px solid var(--border)', backgroundColor: 'var(--card)', color: 'var(--foreground)', fontWeight: 'bold' }} itemStyle={{ fontWeight: '900' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="netProfit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProf)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-bold border-2 border-dashed border-[var(--border)] rounded-2xl">
                No timeline data available
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm flex flex-col">
          <div className="mb-6">
            <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Theme Performance</h2>
            <p className="text-sm font-medium text-slate-500">Profit distribution</p>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {themes.length > 0 ? (
              themes.map((t, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--background)]/50 border border-[var(--border)] hover:border-emerald-500/30 transition-all group">
                  <div>
                    <div className="font-black text-[var(--foreground)] leading-tight">{t.theme}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{t.salesCount} sales</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-emerald-600 dark:text-emerald-400">{formatMoney(t.profit)}</div>
                    <div className="text-xs font-bold text-slate-500">ROI {formatPercent(t.roiPercent)}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-bold">
                No theme data
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Unrealized Potential</h2>
            <Coins className="text-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
              <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Expected Revenue</div>
              <div className="text-3xl font-black text-blue-700 dark:text-blue-400">{formatMoney(summary?.expectedInventoryRevenue)}</div>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30">
              <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Expected Profit</div>
              <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400">{formatMoney(summary?.expectedInventoryProfit)}</div>
              <div className="text-xs font-bold text-emerald-600/70 mt-1">ROI {formatPercent(summary?.expectedInventoryRoiPercent)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}