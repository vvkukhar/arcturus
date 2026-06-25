import { CompsPanel } from '@/components/admin/comps-panel';
import { DealsPanel } from '@/components/admin/deals-panel';
import { RepricerFromCompsPanel } from '@/components/admin/repricer-from-comps-panel';
import { ScannerPanel } from '@/components/admin/scanner-panel';
import { ScannerRunnerPanel } from '@/components/admin/scanner-runner-panel';
import { dict } from '@/lib/i18n';

export default function ScannerPage() {
  const t = (key: keyof typeof dict.uk) => dict.uk[key] || dict.en[key] || key;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 hardware-accelerated">
      <div className="bg-[var(--card)] border border-[var(--border)] p-6 md:p-8 rounded-[2rem] shadow-sm">
        <h1 className="text-3xl font-black text-[var(--foreground)]">{t('admin.scanner.title' as any)}</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">{t('admin.scanner.subtitle' as any)}</p>
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