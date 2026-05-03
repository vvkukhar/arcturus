import { SmartHeader } from '@/components/store/smart-header';
import { DynamicIsland } from '@/components/store/dynamic-island';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50 relative pt-24">
      <SmartHeader />
      <DynamicIsland />
      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </main>
  );
}