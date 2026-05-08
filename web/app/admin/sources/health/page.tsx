import { Activity } from 'lucide-react';

export default function SourcesHealthPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in-up text-center">
      <div className="h-24 w-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
        <Activity size={40} />
      </div>
      <h1 className="text-3xl font-black text-[var(--foreground)] mb-2">Sources Health</h1>
      <p className="text-slate-500 max-w-md">Real-time monitoring of marketplace scrapers, API endpoints, and data ingestion pipelines. Module coming soon.</p>
    </div>
  );
}