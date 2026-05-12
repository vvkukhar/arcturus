'use client';

import useSWR from 'swr';
import { useI18n } from '@/components/providers/i18n-provider';
import { FileText, Download, Loader2 } from 'lucide-react';
import { swrFetcher } from '@/lib/swr-fetcher';

interface ReportSnapshot {
  id: string;
  type: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  payloadJson: Record<string, unknown>;
}

export default function ReportsPage() {
  const { t } = useI18n();
  const { data: rawData, isLoading } = useSWR<ReportSnapshot[]>('/api/reports', swrFetcher);

  const reports = Array.isArray(rawData) ? rawData : [];

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{t('sidebar.reports' as any)}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-medium">Financial snapshots and audits.</p>
      </div>

      {reports.length === 0 ? (
        <div className="text-center py-20 bg-[var(--card)] border border-[var(--border)] rounded-3xl text-slate-500 font-medium">
          {t('reports.empty' as any)}
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
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{report.type || t('reports.system' as any)}</span>
                  <h3 className="text-xl font-bold mt-1 mb-2 leading-tight">Financial Snapshot {new Date(report.createdAt).toLocaleDateString('uk-UA')}</h3>
                  <p className="text-sm text-slate-500 font-medium">From {new Date(report.periodStart).toLocaleDateString('uk-UA')} to {new Date(report.periodEnd).toLocaleDateString('uk-UA')}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  const blob = new Blob([JSON.stringify(report.payloadJson, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `report-${report.id}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
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