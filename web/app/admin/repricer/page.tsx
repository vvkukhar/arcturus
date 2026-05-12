import { DealExplainer } from '@/components/admin/deal-explainer';
import { RepricerPanel } from '@/components/admin/repricer-panel';
import { PriceAnalyzer } from '@/components/admin/price-analyzer';

export default function RepricerPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-[var(--foreground)]">Pricing Tools</h1>
        <p className="mt-1 text-sm text-slate-500">Calculate margins, evaluate deal profitability, and apply automated repricing.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RepricerPanel />
        <DealExplainer />
      </div>

      <div className="max-w-2xl">
        <PriceAnalyzer />
      </div>
    </div>
  );
}