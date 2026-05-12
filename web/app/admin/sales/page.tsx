import { SalesRegistrationPanel } from '@/components/admin/sales-registration-panel';

export default function SalesPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)]">Sales Record</h1>
        <p className="mt-1 text-sm text-slate-500">Log manual transactions and review aggregated profit metrics.</p>
      </div>
      
      <div className="max-w-3xl">
        <SalesRegistrationPanel />
      </div>
    </div>
  );
}