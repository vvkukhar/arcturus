'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/components/providers/i18n-provider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/client-api';

export default function HistoricalPage() {
  const { t } = useI18n();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    apiFetch<any[]>('/api/profit/monthly')
      .then((data) => {
        if (mounted) {
          if (Array.isArray(data)) {
            setHistory(data.map(d => ({
              period: d.date || d.month,
              revenue: typeof d.revenue === 'string' ? parseFloat(d.revenue.replace(/[^0-9.-]+/g,"")) : d.revenue,
              profit: typeof d.grossProfit === 'string' ? parseFloat(d.grossProfit.replace(/[^0-9.-]+/g,"")) : (d.grossProfit || d.profit)
            })));
          }
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  const totalRevenue = history.reduce((sum, h) => sum + h.revenue, 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('historical.title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">{t('historical.subtitle')}</p>
        </div>
        <div className="bg-[var(--card)] px-4 py-2 border border-[var(--border)] rounded-xl font-bold text-sm">
          {t('historical.global')}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[var(--card)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-lg flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" />
              {t('historical.timeline')}
            </h3>
          </div>
          <div className="h-[400px] w-full">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={history}>
                  <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
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
              <div className="h-full flex items-center justify-center text-slate-400 font-medium">{t('historical.noData')}</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-slate-900 p-8 rounded-3xl border border-[var(--border)]">
            <h4 className="text-xs font-black uppercase text-slate-400 mb-6 tracking-widest">{t('historical.metrics')}</h4>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">{t('historical.totalRev')}</p>
                <p className="text-2xl font-black">{totalRevenue.toLocaleString()} ₴</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 mb-1">{t('historical.activePeriods')}</p>
                <p className="text-2xl font-black">{history.length}</p>
              </div>
            </div>
          </div>
          
          <button className="w-full p-6 bg-[var(--card)] border border-[var(--border)] hover:border-blue-600 rounded-3xl transition-all flex items-center justify-between group">
            <div className="text-left">
              <p className="font-black text-lg">{t('historical.compare')}</p>
              <p className="text-sm text-slate-500 font-medium">{t('historical.relative')}</p>
            </div>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}