'use client';

import useSWR from 'swr';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { ChartNoAxesCombined, Loader2, Landmark, Boxes, PiggyBank } from 'lucide-react';
import { swrFetcher } from '@/lib/swr-fetcher';
import { formatMoney } from '@/lib/format';

interface AllocationData {
  capitalAtWork: number;
  inventoryCost: number;
  committedProcurementCost: number;
  byTheme: Array<{ theme: string; units: number; cost: number }>;
}

interface CashflowPlan {
  reserveAmount: number;
  reinvestAmount: number;
  monthlyBudget: number;
  reinvestPercent: number;
  estimatedNewItems: number;
}

export default function AdminAllocationPage() {
  const { data: allocation, isLoading: aLoading } = useSWR<AllocationData>('/api/allocation', swrFetcher);
  const { data: cashflow, isLoading: cLoading } = useSWR<CashflowPlan>('/api/allocation/cashflow-plan', swrFetcher);

  if (aLoading || cLoading) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const chartData = [
    { name: 'Inventory Cost', value: allocation?.inventoryCost ?? 0, color: '#3b82f6' },
    { name: 'Procurement', value: allocation?.committedProcurementCost ?? 0, color: '#f59e0b' },
    { name: 'Liquid Reserve', value: cashflow?.reserveAmount ?? 0, color: '#10b981' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-blue-500/20">
            <ChartNoAxesCombined className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Capital Allocation</h1>
            <p className="mt-1 text-sm font-medium text-slate-500">Portfolio exposure, risk distribution, and reinvestment planning.</p>
          </div>
        </div>
        <div className="bg-[var(--background)]/50 border border-[var(--border)] px-6 py-4 rounded-2xl">
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Capital at Work</div>
          <div className="text-3xl font-black text-[var(--foreground)]">{formatMoney(allocation?.capitalAtWork)}</div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1 rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm flex flex-col">
          <div className="mb-6 flex items-center gap-3">
            <Landmark className="text-indigo-500" />
            <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Distribution</h2>
          </div>
          <div className="flex-1 min-h-[250px] w-full relative">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: '1px solid var(--border)', backgroundColor: 'var(--card)', fontWeight: 'bold' }} formatter={(val: any) => [formatMoney(Number(val)), 'Value']} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-bold">No active capital</div>
            )}
          </div>
        </div>

        <div className="xl:col-span-2 grid gap-6 sm:grid-cols-2">
          <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <Boxes className="text-emerald-500" />
              <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Exposure by Theme</h2>
            </div>
            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {allocation?.byTheme?.map((t, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                  <div>
                    <div className="font-bold text-[var(--foreground)] group-hover:text-emerald-500 transition-colors">{t.theme}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t.units} units</div>
                  </div>
                  <div className="font-black text-slate-700 dark:text-slate-300">{formatMoney(t.cost)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <PiggyBank className="text-amber-500" />
              <h2 className="text-xl font-black text-[var(--foreground)] tracking-tight">Cashflow Plan</h2>
            </div>
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30">
                <div className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500 mb-1">Target Reinvestment</div>
                <div className="text-2xl font-black text-amber-700 dark:text-amber-400">{formatMoney(cashflow?.reinvestAmount)}</div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
                <span className="font-bold text-slate-500">Monthly Budget</span>
                <span className="font-black text-[var(--foreground)]">{formatMoney(cashflow?.monthlyBudget)}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-[var(--border)]">
                <span className="font-bold text-slate-500">Reinvest Rate</span>
                <span className="font-black text-[var(--foreground)]">{cashflow?.reinvestPercent ?? 0}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-500">Est. New Assets</span>
                <span className="font-black text-blue-600 dark:text-blue-400">~{cashflow?.estimatedNewItems ?? 0} items</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}