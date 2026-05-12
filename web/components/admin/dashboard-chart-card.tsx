'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const ResponsiveContainer = dynamic(
  () => import('recharts').then((mod) => mod.ResponsiveContainer),
  { ssr: false, loading: () => <div className="h-full w-full flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div> }
);
const AreaChart = dynamic(() => import('recharts').then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then((mod) => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });

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
    <div className="rounded-[2.5rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm transition-all hover:shadow-md hardware-accelerated">
      <div className="mb-6 text-xl font-black tracking-tight text-[var(--foreground)]">{title}</div>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`colorValue-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
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
                border: '1px solid var(--border)', 
                backgroundColor: 'var(--card)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              }}
              itemStyle={{ color: 'var(--foreground)', fontWeight: '900' }}
              labelStyle={{ color: '#64748b', fontWeight: '700', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill={`url(#colorValue-${title.replace(/\s+/g, '')})`} 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}