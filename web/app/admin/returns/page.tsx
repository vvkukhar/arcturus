import { ReturnsBoard } from '@/components/admin/returns-board';

export const metadata = {
  title: 'Returns & Refunds | Arcturus Admin',
};

export default function AdminReturnsPage() {
  return (
    <div className="h-[calc(100vh-8rem)] min-h-[600px] flex flex-col space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black text-[var(--foreground)] tracking-tight">Returns & Refunds</h1>
        <p className="mt-1 text-sm font-medium text-slate-500">Manage customer return requests, restocking, and refund processing.</p>
      </div>

      <ReturnsBoard />
    </div>
  );
}