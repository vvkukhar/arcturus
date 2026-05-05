'use client';

import { Activity } from 'lucide-react';

const asks = [
  { price: '34,800', size: 1, total: '34,800' },
  { price: '34,750', size: 2, total: '69,500' },
  { price: '34,600', size: 1, total: '34,600' },
  { price: '34,550', size: 3, total: '103,650' },
  { price: '34,500', size: 1, total: '34,500' },
];

const bids = [
  { price: '34,200', size: 2, total: '68,400' },
  { price: '34,100', size: 1, total: '34,100' },
  { price: '34,050', size: 4, total: '136,200' },
  { price: '33,900', size: 1, total: '33,900' },
  { price: '33,500', size: 5, total: '167,500' },
];

export default function OrderBookPage() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">Order Book</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Real-time depth chart for UCS Millennium Falcon (75192).</p>
        </div>
        <div className="px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-xl flex items-center gap-2 font-bold text-sm shadow-sm">
          <Activity size={16} className="text-blue-500" /> Live Updates
        </div>
      </div>

      <div className="bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="flex-1 border-r border-[var(--border)]">
          <div className="p-4 border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-bold text-center text-red-500">ASKS (Sellers)</h3>
          </div>
          <table className="w-full text-right text-sm font-medium">
            <thead>
              <tr className="text-slate-500 text-xs">
                <th className="p-3">Price (₴)</th>
                <th className="p-3">Size</th>
                <th className="p-3">Total (₴)</th>
              </tr>
            </thead>
            <tbody>
              {asks.map((ask, i) => (
                <tr key={i} className="relative hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="p-3 text-red-500 font-bold relative z-10">{ask.price}</td>
                  <td className="p-3 relative z-10">{ask.size}</td>
                  <td className="p-3 relative z-10">{ask.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex-1">
          <div className="p-4 border-b border-[var(--border)] bg-slate-50/50 dark:bg-slate-900/50">
            <h3 className="font-bold text-center text-green-500">BIDS (Buyers)</h3>
          </div>
          <table className="w-full text-right text-sm font-medium">
            <thead>
              <tr className="text-slate-500 text-xs">
                <th className="p-3">Price (₴)</th>
                <th className="p-3">Size</th>
                <th className="p-3">Total (₴)</th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="p-3 text-green-500 font-bold">{bid.price}</td>
                  <td className="p-3">{bid.size}</td>
                  <td className="p-3">{bid.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}