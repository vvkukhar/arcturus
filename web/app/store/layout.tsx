import { SmartHeader } from '@/components/store/smart-header';
import { DynamicIsland } from '@/components/store/dynamic-island';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50 relative pt-24 pb-12">
      <SmartHeader />
      <DynamicIsland />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </main>
  );
}