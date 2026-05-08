import { RefreshCw } from 'lucide-react';

export default function SyncCenterPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] animate-fade-in-up text-center">
      <div className="h-24 w-24 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
        <RefreshCw size={40} />
      </div>
      <h1 className="text-3xl font-black text-[var(--foreground)] mb-2">Sync Center</h1>
      <p className="text-slate-500 max-w-md">Manual control panel to force-sync databases, clear cache, and update external integrations. Module coming soon.</p>
    </div>
  );
}