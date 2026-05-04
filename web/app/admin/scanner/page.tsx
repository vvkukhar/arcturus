import { CompsPanel } from '@/components/admin/comps-panel';
import { DealsPanel } from '@/components/admin/deals-panel';
import { RepricerFromCompsPanel } from '@/components/admin/repricer-from-comps-panel';
import { ScannerPanel } from '@/components/admin/scanner-panel';
import { ScannerRunnerPanel } from '@/components/admin/scanner-runner-panel';

export default function ScannerPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Scanner & Intelligence</h1>
        <p className="mt-1 text-sm text-slate-500">Manage automated market scanning, job execution, and deal detection.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ScannerPanel />
        <ScannerRunnerPanel />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CompsPanel />
        <RepricerFromCompsPanel />
      </div>

      <DealsPanel />
    </div>
  );
}