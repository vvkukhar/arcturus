'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { Ticker } from "@/components/layout/ticker";
import { CommandMenu } from "@/components/layout/command-menu";
import { Sidebar } from "@/components/layout/sidebar";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Перевіряємо, чи ми на сторінках авторизації або адмінки
  const isAuthOrAdmin = pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/register';

  // Якщо це адмінка або логін - віддаємо просто контент без магазинного обвісу
  if (isAuthOrAdmin) {
    return <>{children}</>;
  }

  // Якщо це звичайні сторінки магазину - малюємо повний UI
  return (
    <>
      <div className="sticky top-0 z-40 w-full">
        <Ticker />
        <Navbar />
      </div>
      <div className="flex flex-1 w-full mx-auto relative">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </div>
      <CommandMenu />
      <CartSidebar />
    </>
  );
}