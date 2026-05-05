'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Calendar, ArrowRight } from 'lucide-react';

const historyData = [
  { year: '2020', price: 21500 },
  { year: '2021', price: 24200 },
  { year: '2022', price: 28500 },
  { year: '2023', price: 27800 },
  { year: '2024', price: 31200 },
  { year: '2025', price: 34500 },
];

export default function HistoricalPage() {
  const { t } = useI18n();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('historical.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">{t('historical.subtitle')}</p>
        </div>
        <div className="bg-[var(--card)] px-4 py-2 border border-[var(--border)] rounded-xl font-bold text-sm">
          Set: UCS Millennium Falcon #75192
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[var(--card)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-lg flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              Annual Price Evolution
            </h3>
            <span className="text-green-500 font-black text-sm">+60.4% Overall</span>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyData}>
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 'bold' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Bar dataKey="price" radius={[8, 8, 0, 0]}>
                  {historyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === historyData.length - 1 ? '#2563eb' : '#cbd5e1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-[var(--border)]">
            <h4 className="text-xs font-black uppercase text-slate-400 mb-6 tracking-widest">Key Metrics</h4>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">MSRP (Launch Price)</p>
                <p className="text-2xl font-black">24,999 ₴</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">Max Price (ATH)</p>
                <p className="text-2xl font-black">34,500 ₴</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">CAGR</p>
                <p className="text-2xl font-black text-green-500">+10.2% / year</p>
              </div>
            </div>
          </div>
          
          <button className="w-full p-6 bg-[var(--card)] border border-[var(--border)] hover:border-blue-600 rounded-3xl transition-all flex items-center justify-between group">
            <div className="text-left">
              <p className="font-black text-lg">Compare with Indices</p>
              <p className="text-sm text-slate-500 font-medium">Relative to S&P 500 & LEGO 100</p>
            </div>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}