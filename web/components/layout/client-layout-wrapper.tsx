// call:function_1{"queries":["web/components/layout/client-layout-wrapper.tsx"]}
'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Sidebar } from "@/components/layout/sidebar";
import { initAnalytics, pageview } from '@/lib/analytics';

const CommandMenu = dynamic(() => import('@/components/layout/command-menu').then(mod => mod.CommandMenu), { ssr: false });
const CartSidebar = dynamic(() => import('@/components/cart/cart-sidebar').then(mod => mod.CartSidebar), { ssr: false });

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthOrAdmin = pathname?.startsWith('/admin') || pathname === '/login' || pathname === '/register';

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    if (pathname) pageview(pathname);
  }, [pathname]);

  if (isAuthOrAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="sticky top-0 z-40 w-full transform-gpu">
        {/* Тікер вирізано */}
        <Navbar />
      </div>
      <div className="flex flex-1 w-full mx-auto relative transform-gpu">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
      <CommandMenu />
      <CartSidebar />
    </>
  );
}