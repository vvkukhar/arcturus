'use client';

import { useI18n } from '@/components/providers/i18n-provider';
import { Activity, TrendingUp, TrendingDown, DollarSign, Package } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { time: '09:00', value: 124000 },
  { time: '10:00', value: 125500 },
  { time: '11:00', value: 124800 },
  { time: '12:00', value: 127200 },
  { time: '13:00', value: 126900 },
  { time: '14:00', value: 129000 },
  { time: '15:00', value: 131500 },
];

const topMovers = [
  { id: '75192', name: 'UCS Millennium Falcon', price: '34,500 ₴', change: '+2.4%', up: true },
  { id: '10305', name: 'Lion Knights\' Castle', price: '16,800 ₴', change: '-1.2%', up: false },
  { id: '21330', name: 'Home Alone', price: '11,400 ₴', change: '+1.5%', up: true },
  { id: '71741', name: 'Ninjago City Gardens', price: '14,200 ₴', change: '+5.1%', up: true },
];

export default function MarketPage() {
  const { t } = useI18n();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('market.title')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">{t('market.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
              <Activity size={24} />
            </div>
            <span className="flex items-center gap-1 text-green-500 font-bold text-sm bg-green-500/10 px-2 py-1 rounded-md">
              <TrendingUp size={14} /> +3.2%
            </span>
          </div>
          <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Global Market Cap</h3>
          <p className="text-3xl font-black">2.4B ₴</p>
        </div>
        <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 rounded-xl">
              <DollarSign size={24} />
            </div>
            <span className="flex items-center gap-1 text-green-500 font-bold text-sm bg-green-500/10 px-2 py-1 rounded-md">
              <TrendingUp size={14} /> +1.8%
            </span>
          </div>
          <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">24h Trading Volume</h3>
          <p className="text-3xl font-black">15.2M ₴</p>
        </div>
        <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-xl">
              <Package size={24} />
            </div>
          </div>
          <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Active Listings</h3>
          <p className="text-3xl font-black">14,239</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
          <h2 className="text-xl font-black mb-6">Arcturus 500 Index (Intraday)</h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 'bold' }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorIndex)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="text-xl font-black">Top Movers</h2>
          </div>
          <div className="p-2 flex-1 overflow-y-auto">
            {topMovers.map((mover, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors cursor-pointer">
                <div>
                  <p className="font-bold text-sm">{mover.name}</p>
                  <p className="text-xs text-slate-500 font-medium">Set #{mover.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-black">{mover.price}</p>
                  <p className={`text-xs font-bold flex items-center justify-end gap-1 ${mover.up ? 'text-green-500' : 'text-red-500'}`}>
                    {mover.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {mover.change}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}