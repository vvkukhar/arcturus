import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminTopbar } from '@/components/admin/topbar';
import { getAdminToken } from '@/lib/server-auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = await getAdminToken();
  if (!token) {
    redirect('/login');
  }

  return (
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
  );
}