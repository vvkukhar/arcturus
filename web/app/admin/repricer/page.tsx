import { DealExplainer } from '@/components/admin/deal-explainer';
import { RepricerPanel } from '@/components/admin/repricer-panel';

export default function RepricerPage() {
  return (
    <div className="space-y-6">
      <div className="text-2xl font-black">Repricer</div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RepricerPanel />
        <DealExplainer />
      </div>
    </div>
  );
}