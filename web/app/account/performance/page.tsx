'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Award, Box } from 'lucide-react';

const allocationData = [
  { name: 'Star Wars', value: 45, color: '#3b82f6' },
  { name: 'Ninjago', value: 25, color: '#ef4444' },
  { name: 'Icons', value: 20, color: '#8b5cf6' },
  { name: 'Technic', value: 10, color: '#f97316' },
];

export default function PerformancePage() {
  const { t } = useI18n();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('performance.title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">{t('performance.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
          <h3 className="text-xl font-black mb-8 flex items-center gap-2">
            <Box size={24} className="text-blue-600" />
            Asset Allocation
          </h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp size={24} className="text-green-500" />
              <h3 className="text-xl font-black">Top Performer</h3>
            </div>
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <Award size={40} className="text-orange-500" />
              </div>
              <div>
                <p className="text-lg font-black leading-tight">Ninjago City Gardens</p>
                <p className="text-sm text-slate-500 font-bold mt-1">ROI: +34.2% since purchase</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-900 text-white p-6 rounded-3xl">
              <p className="text-[10px] font-black uppercase opacity-60 mb-2">Total Gain</p>
              <p className="text-2xl font-black text-green-400">+12,400 ₴</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-[var(--border)]">
              <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Alpha vs Market</p>
              <p className="text-2xl font-black">+4.1%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}