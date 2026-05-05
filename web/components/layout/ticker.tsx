'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { useState, useEffect } from 'react';

const initialData = [
  { id: '75192', name: 'UCS Millennium Falcon', price: 34500, change: 2.4, isUp: true },
  { id: '71741', name: 'Ninjago City Gardens', price: 14200, change: 5.1, isUp: true },
  { id: '10305', name: 'Lion Knights\' Castle', price: 16800, change: 1.2, isUp: false },
  { id: '75313', name: 'UCS AT-AT', price: 32000, change: 0.8, isUp: true },
  { id: '71799', name: 'Ninjago City Markets', price: 15500, change: 3.7, isUp: true },
  { id: '21330', name: 'Home Alone', price: 11400, change: 1.5, isUp: true },
];

export function Ticker() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(current => current.map(item => {
        const drift = (Math.random() - 0.5) * 50;
        const newPrice = Math.max(1000, item.price + drift);
        const newChange = item.change + (Math.random() - 0.5) * 0.1;
        return { 
          ...item, 
          price: Math.round(newPrice), 
          change: Number(newChange.toFixed(2)),
          isUp: newChange > 0 
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-950 dark:bg-black text-slate-300 border-b border-slate-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider overflow-hidden flex items-center h-8 sm:h-10 relative z-50">
      <div className="flex animate-[ticker_40s_linear_infinite] whitespace-nowrap">
        {[...data, ...data, ...data].map((item, index) => (
          <div key={index} className="flex items-center gap-2 mx-6">
            <span className="text-slate-500">#{item.id}</span>
            <span className="text-white">{item.name}</span>
            <span className="text-slate-400 font-mono">{item.price.toLocaleString()} ₴</span>
            <span className={`flex items-center gap-0.5 font-mono ${item.isUp ? 'text-green-500' : 'text-red-500'}`}>
              {item.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {item.change > 0 ? '+' : ''}{item.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}