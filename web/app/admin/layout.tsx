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
      <div className="flex h-screen w-full bg-[var(--background)] text-[var(--foreground)] overflow-hidden transition-colors duration-300">
        <AdminSidebar />
        <div className="flex min-w-0 flex-1 flex-col h-screen overflow-y-auto custom-scrollbar">
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