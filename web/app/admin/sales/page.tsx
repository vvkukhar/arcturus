import { SalesRegistrationPanel } from '@/components/admin/sales-registration-panel';

export default function SalesPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Sales Record</h1>
        <p className="mt-1 text-sm text-slate-500">Log manual transactions and review aggregated profit metrics.</p>
      </div>
      
      <div className="max-w-3xl">
        <SalesRegistrationPanel />
      </div>
    </div>
  );
}