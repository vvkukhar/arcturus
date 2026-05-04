import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminTopbar } from '@/components/admin/topbar';
import { AuthGate } from '@/components/admin/auth-gate';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGate>
      <div className="flex min-h-screen bg-slate-50 overflow-hidden">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col h-screen overflow-y-auto">
          <AdminTopbar />
          <main className="flex-1 p-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthGate>
  );
}