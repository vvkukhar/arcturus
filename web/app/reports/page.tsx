'use client';

import { useEffect, useState } from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import { apiFetch } from '@/lib/client-api';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    apiFetch<any[]>('/api/reports')
      .then((data) => {
        if (mounted) {
          setReports(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">Investment Reports</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">In-depth institutional research and market forecasts.</p>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-20 bg-[var(--card)] border border-[var(--border)] rounded-3xl text-slate-500 font-medium">
          No financial reports generated yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, i) => (
            <div key={report.id || i} className="bg-[var(--card)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:border-blue-500/50 transition-colors">
              <div className="flex gap-5 items-start">
                <div className="p-4 bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-2xl shrink-0 group-hover:scale-105 transition-transform">
                  <FileText size={32} />
                </div>
                <div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{report.type || 'System Report'}</span>
                  <h3 className="text-xl font-bold mt-1 mb-2 leading-tight">Financial Snapshot {new Date(report.createdAt).toLocaleDateString()}</h3>
                  <p className="text-sm text-slate-500 font-medium">From {new Date(report.periodStart).toLocaleDateString()} to {new Date(report.periodEnd).toLocaleDateString()}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const blob = new Blob([JSON.stringify(report.payloadJson, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `report-${report.id}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-900 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={18} /> JSON
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}