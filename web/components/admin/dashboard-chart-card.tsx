'use client';

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type Props = {
  title: string;
  labels: string[];
  values: number[];
};

export function DashboardChartCard({ title, labels, values }: Props) {
  const data = labels.map((label, index) => ({
    name: label,
    value: values[index] || 0,
  }));

  return (
    <div className="rounded-[2.5rem] border border-border bg-white p-8 shadow-sm transition-all hover:shadow-md">
      <div className="mb-6 text-xl font-black tracking-tight text-slate-900">{title}</div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} 
              dy={10} 
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ 
                borderRadius: '1rem', 
                border: 'none', 
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)'
              }}
              itemStyle={{ color: '#0f172a', fontWeight: '900' }}
              labelStyle={{ color: '#64748b', fontWeight: '700', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}