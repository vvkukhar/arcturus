import { AlertTriangle } from 'lucide-react';

export default function SourcesErrorsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in-up text-center">
      <div className="h-24 w-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-6">
        <AlertTriangle size={40} />
      </div>
      <h1 className="text-3xl font-black text-[var(--foreground)] mb-2">Error Logs</h1>
      <p className="text-slate-500 max-w-md">Centralized error reporting for unresolved matches, broken proxies, and sync failures. Module coming soon.</p>
    </div>
  );
}