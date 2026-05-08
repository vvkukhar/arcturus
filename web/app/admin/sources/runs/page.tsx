import { DatabaseZap } from 'lucide-react';

export default function SourcesRunsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in-up text-center">
      <div className="h-24 w-24 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
        <DatabaseZap size={40} />
      </div>
      <h1 className="text-3xl font-black text-[var(--foreground)] mb-2">Execution Runs</h1>
      <p className="text-slate-500 max-w-md">Detailed logs of scanner jobs, matching algorithms, and cron executions. Module coming soon.</p>
    </div>
  );
}