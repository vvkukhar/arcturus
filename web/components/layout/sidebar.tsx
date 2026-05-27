'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '../providers/i18n-provider';
import { useSidebar } from '../providers/sidebar-provider';
import useSWR from 'swr';
import { swrFetcher } from '@/lib/swr-fetcher';
import { 
  LineChart, Activity, Filter, BarChart2, Clock, 
  FileText, PieChart, Wallet, Heart, TrendingUp, Package, 
  HelpCircle, ShieldCheck, X, Crown, Target, Gift, Vault
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function Sidebar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);
  const { data: user } = useSWR('/api/auth/me', swrFetcher);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAdmin = user?.role === 'admin' || user?.role === 'operator';
  const isPro = isAdmin || user?.isPro;
  const isAuth = !!user;

  const menu = [
    {
      title: 'sidebar.trading',
      show: true,
      items: [
        { name: 'sidebar.market', path: '/market', icon: LineChart, show: true },
        { name: 'sidebar.screener', path: '/screener', icon: Filter, show: isPro },
        { name: 'PRO Deals', path: '/deals', icon: Target, show: isPro },
        { name: 'sidebar.indices', path: '/indices', icon: BarChart2, show: true },
        { name: 'sidebar.orderbook', path: '/orderbook', icon: Activity, show: true },
      ]
    },
    {
      title: 'sidebar.analytics',
      show: isAdmin,
      items: [
        { name: 'sidebar.valuation', path: '/valuation', icon: PieChart, show: isAdmin },
        { name: 'sidebar.historical', path: '/historical', icon: Clock, show: isAdmin },
        { name: 'sidebar.reports', path: '/reports', icon: FileText, show: isAdmin },
      ]
    },
    {
      title: 'sidebar.portfolio',
      show: isAuth,
      items: [
        { name: 'sidebar.dashboard', path: '/account', icon: Wallet, show: isAuth },
        { name: 'sidebar.watchlist', path: '/account/watchlist', icon: Heart, show: isAuth },
        { name: 'sidebar.performance', path: '/account/performance', icon: TrendingUp, show: isAuth },
        { name: 'Arcturus Vault', path: '/vault', icon: Vault, show: isPro },
        { name: 'Arcturus PRO', path: '/pro', icon: Crown, show: isAuth },
      ]
    },
    {
      title: 'sidebar.platform',
      show: true,
      items: [
        { name: 'nav.catalog', path: '/store/catalog', icon: Package, show: true },
        { name: 'Mystery Boxes', path: '/store/mystery-boxes', icon: Gift, show: true },
        { name: 'sidebar.sell', path: '/sell', icon: Package, show: true },
        { name: 'nav.auth', path: '/authenticity', icon: ShieldCheck, show: true },
        { name: 'footer.faq', path: '/faq', icon: HelpCircle, show: true },
      ]
    }
  ];

  return (
    <>
      <div 
        className={cn("fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden", isOpen ? "opacity-100" : "opacity-0 pointer-events-none")} 
        onClick={() => setIsOpen(false)} 
      />

      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-[70] w-[280px] bg-[var(--card)] border-r border-[var(--border)] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out-expo lg:sticky lg:top-20 lg:h-[calc(100dvh-5rem)] lg:translate-x-0 lg:shadow-none", 
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)] lg:hidden">
          <span className="font-extrabold text-xl flex items-center gap-2 text-[var(--foreground)]">
            <Package className="text-blue-600" size={24} />
            Terminal
          </span>
          <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:bg-[var(--background)] hover:text-slate-600 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          {menu.filter(s => s.show).map((section, idx) => {
            const visibleItems = section.items.filter(i => i.show);
            if (visibleItems.length === 0) return null;

            return (
              <div key={idx}>
                <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-3">
                  {isMounted ? t(section.title as any) : '...'}
                </h4>
                <div className="space-y-1">
                  {visibleItems.map((item, iIdx) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path || (pathname?.startsWith(`${item.path}/`) && item.path !== '/');
                    const isSpecial = item.name.includes('PRO') || item.name.includes('Mystery') || item.name.includes('Vault');
                    
                    return (
                      <Link href={item.path} key={iIdx} onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 border border-transparent outline-none", 
                          isActive 
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                            : "text-slate-600 dark:text-slate-400 hover:bg-[var(--background)] hover:text-[var(--foreground)] hover:border-[var(--border)]"
                        )}
                      >
                        <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isSpecial && !isActive ? 'text-purple-500' : ''} />
                        <span className={isSpecial && !isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600' : ''}>
                          {isMounted && (item.name.includes('PRO') || item.name.includes('Mystery') || item.name.includes('Vault')) ? item.name : isMounted ? t(item.name as any) : '...'}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}