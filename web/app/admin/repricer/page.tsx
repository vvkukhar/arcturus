import { DealExplainer } from '@/components/admin/deal-explainer';
import { RepricerPanel } from '@/components/admin/repricer-panel';
import { PriceAnalyzer } from '@/components/admin/price-analyzer';
import { dict } from '@/lib/i18n';

export default function RepricerPage() {
  const t = (key: keyof typeof dict.uk) => dict.uk[key] || dict.en[key] || key;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-black text-[var(--foreground)]">{t('admin.algo.pricingEngine' as any) || 'Pricing Tools'}</h1>
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