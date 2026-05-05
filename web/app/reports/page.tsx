'use client';

import { FileText, Download } from 'lucide-react';

const reports = [
  { title: 'Q1 2026 LEGO Market Outlook', date: 'April 2026', type: 'Quarterly Review', size: '2.4 MB' },
  { title: 'Ninjago 15th Anniversary Impact', date: 'March 2026', type: 'Theme Analysis', size: '1.8 MB' },
  { title: 'Star Wars UCS Valuation Models', date: 'February 2026', type: 'Deep Dive', size: '3.1 MB' },
  { title: '2025 EOY Performance Report', date: 'January 2026', type: 'Annual Report', size: '5.5 MB' },
];

export default function ReportsPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">Investment Reports</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">In-depth institutional research and market forecasts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, i) => (
          <div key={i} className="bg-[var(--card)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-blue-500/50 transition-colors">
            <div className="flex gap-5 items-start">
              <div className="p-4 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0 group-hover:scale-105 transition-transform">
                <FileText size={32} />
              </div>
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{report.type}</span>
                <h3 className="text-xl font-bold mt-1 mb-2 leading-tight">{report.title}</h3>
                <p className="text-sm text-slate-500 font-medium">{report.date} • PDF • {report.size}</p>
              </div>
            </div>
            <button className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-900 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
              <Download size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}