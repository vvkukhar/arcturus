import { Badge } from '@/components/ui/badge';
import { formatMoney, formatPercent } from '@/lib/format';

type Props = {
  item: any;
};

export function OpportunityStrategyBlock({ item }: Props) {
  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-slate-50 p-5 md:grid-cols-2">
      <div className="space-y-2">
        <div className="text-sm font-bold text-slate-500">Strategy</div>
        <div className="flex flex-wrap gap-2">
          <Badge>{item.flipStrategy ?? '—'}</Badge>
          {item.bundleDetected ? <Badge>bundle</Badge> : null}
          {item.arbitrageScore ? <Badge>arb {item.arbitrageScore}</Badge> : null}
        </div>
        <div className="text-sm text-slate-600">
          {item.flipStrategyReasonPrimary ?? item.actionReasonPrimary ?? '—'}
        </div>
        <div className="text-sm text-slate-500">
          {item.flipStrategyReasonSecondary ?? item.actionReasonSecondary ?? '—'}
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-sm font-bold text-slate-500">Pricing</div>
        <div className="text-sm text-slate-700">
          Suggested: {formatMoney(item.suggestedSellPrice)}
        </div>
        <div className="text-sm text-slate-700">
          Floor: {formatMoney(item.floorSellPrice)}
        </div>
        <div className="text-sm text-slate-700">
          Stretch: {formatMoney(item.stretchSellPrice)}
        </div>
        <div className="text-sm text-slate-700">
          ROI: {formatPercent(item.roi)}
        </div>
      </div>
    </div>
  );
}