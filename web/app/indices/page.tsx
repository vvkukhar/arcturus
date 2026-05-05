'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Star, Zap } from 'lucide-react';

const indexData = [
  { month: 'Jan', starwars: 100, ninjago: 100, technic: 100 },
  { month: 'Feb', starwars: 105, ninjago: 102, technic: 98 },
  { month: 'Mar', starwars: 108, ninjago: 107, technic: 101 },
  { month: 'Apr', starwars: 106, ninjago: 112, technic: 105 },
  { month: 'May', starwars: 115, ninjago: 118, technic: 109 },
  { month: 'Jun', starwars: 122, ninjago: 121, technic: 112 },
];

export default function IndicesPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">Market Indices</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Track the performance of major LEGO themes over time. Baseline 100.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-blue-500">
            <Star size={24} />
            <span className="font-bold">Star Wars Index</span>
          </div>
          <p className="text-3xl font-black">122.00</p>
          <p className="text-sm font-bold text-green-500 mt-1">+22.0% YTD</p>
        </div>
        <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-red-500">
            <Zap size={24} />
            <span className="font-bold">Ninjago Index</span>
          </div>
          <p className="text-3xl font-black">121.00</p>
          <p className="text-sm font-bold text-green-500 mt-1">+21.0% YTD</p>
        </div>
        <div className="bg-[var(--card)] p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-3 mb-4 text-orange-500">
            <Activity size={24} />
            <span className="font-bold">Technic Index</span>
          </div>
          <p className="text-3xl font-black">112.00</p>
          <p className="text-sm font-bold text-green-500 mt-1">+12.0% YTD</p>
        </div>
      </div>

      <div className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm">
        <div className="h-[500px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={indexData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', borderRadius: '12px', border: '1px solid var(--border)', fontWeight: 'bold' }}
                itemStyle={{ color: 'var(--foreground)' }}
              />
              <Line type="monotone" dataKey="starwars" name="Star Wars" stroke="#3b82f6" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="ninjago" name="Ninjago" stroke="#ef4444" strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="technic" name="Technic" stroke="#f97316" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}