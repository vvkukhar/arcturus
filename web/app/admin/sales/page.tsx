import { SalesRegistrationPanel } from '@/components/admin/sales-registration-panel';

export default function SalesPage() {
  return (
    <div className="space-y-4">
      <div className="text-2xl font-black">Sales</div>
      <SalesRegistrationPanel />
    </div>
  );
}