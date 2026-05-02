import { CompsPanel } from '@/components/admin/comps-panel';
import { DealsPanel } from '@/components/admin/deals-panel';
import { RepricerFromCompsPanel } from '@/components/admin/repricer-from-comps-panel';
import { ScannerPanel } from '@/components/admin/scanner-panel';
import { ScannerRunnerPanel } from '@/components/admin/scanner-runner-panel';

export default function ScannerPage() {
  return (
    <div className="space-y-6">
      <div className="text-2xl font-black">Scanner</div>
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