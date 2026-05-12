'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/components/providers/i18n-provider';
import {
  Activity, AlertTriangle, BadgeDollarSign, Bell, Boxes, BrainCircuit,
  ChartColumn, ChartNoAxesCombined, ClipboardList, Coins, DatabaseZap,
  Gauge, Handshake, KanbanSquare, MailCheck, Package, ReceiptText,
  RefreshCw, ScanSearch, ScrollText, SearchCheck, Users, Wallet,
  Globe, ScanBarcode
} from 'lucide-react';
import { NotificationBadge } from '@/components/admin/notification-badge';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const items = [
    { href: '/admin/dashboard', label: 'admin.dashboard', icon: Gauge },
    { href: '/admin/algo', label: 'admin.algo', icon: BrainCircuit },
    { href: '/admin/arbitrage', label: 'admin.arbitrage', icon: Globe },
    { href: '/admin/inventory', label: 'admin.inventory', icon: Package },
    { href: '/admin/watchlist', label: 'admin.watchlist', icon: Wallet },
    { href: '/admin/opportunities/buy', label: 'admin.opportunities', icon: ChartColumn },
    { href: '/admin/opportunities/sell', label: 'admin.opportunities', icon: ChartColumn },
    { href: '/admin/flows/purchase', label: 'admin.flows', icon: Boxes },
    { href: '/admin/flows/reprice', label: 'admin.flows', icon: RefreshCw },
    { href: '/admin/flows/review', label: 'admin.flows', icon: ClipboardList },
    { href: '/admin/repricer', label: 'sidebar.valuation', icon: BadgeDollarSign },
    { href: '/admin/pos', label: 'POS Terminal', icon: ScanBarcode },
    { href: '/admin/scanner', label: 'admin.scanner', icon: ScanSearch },
    { href: '/admin/operator/unresolved', label: 'nav.auth', icon: SearchCheck },
    { href: '/admin/sources/health', label: 'sidebar.analytics', icon: Activity },
    { href: '/admin/sources/runs', label: 'sidebar.analytics', icon: DatabaseZap },
    { href: '/admin/sources/errors', label: 'admin.sync', icon: AlertTriangle },
    { href: '/admin/sync', label: 'admin.sync', icon: RefreshCw },
    { href: '/admin/planning/daily', label: 'sidebar.reports', icon: ClipboardList },
    { href: '/admin/profit', label: 'admin.profit', icon: Coins },
    { href: '/admin/allocation', label: 'sidebar.portfolio', icon: ChartNoAxesCombined },
    { href: '/admin/reserves', label: 'admin.reserves', icon: MailCheck },
    { href: '/admin/orders/board', label: 'admin.orders', icon: KanbanSquare },
    { href: '/admin/sales', label: 'admin.sales', icon: ReceiptText },
    { href: '/admin/notifications', label: 'account.sysPref', icon: Bell },
    { href: '/admin/collaboration', label: 'admin.collab', icon: Handshake },
    { href: '/admin/activity', label: 'admin.activity', icon: ScrollText },
  ];

  return (
    <aside className="w-72 shrink-0 border-r border-[var(--border)] bg-[var(--card)] flex flex-col h-screen transition-colors duration-300">
      <div className="border-b border-[var(--border)] px-6 py-6">
        <Link className="block outline-none" href="/store">
          <div className="text-2xl font-black tracking-tight text-[var(--foreground)] hover:text-blue-600 transition-colors">Arcturus</div>
        </Link>
        <div className="mt-1 text-[10px] font-black uppercase tracking-widest text-blue-500">Control Panel</div>
      </div>

      <div className="border-b border-[var(--border)] px-4 py-4">
        <div className="grid grid-cols-3 gap-2">
          <Link className="relative flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)] p-2.5 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800" href="/admin/notifications">
            <Bell className="text-slate-500 dark:text-slate-400" size={18} />
            <NotificationBadge />
          </Link>
          <Link className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)] p-2.5 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800" href="/admin/collaboration">
            <Users className="text-slate-500 dark:text-slate-400" size={18} />
          </Link>
          <Link className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)] p-2.5 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 dark:hover:border-blue-800" href="/admin/scanner">
            <ScanSearch className="text-slate-500 dark:text-slate-400" size={18} />
          </Link>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1 p-3 custom-scrollbar">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (pathname?.startsWith(`${item.href}/`) && item.href !== '/admin');

          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200", 
                active 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-[var(--background)] hover:text-[var(--foreground)]"
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              <span>{item.label === 'POS Terminal' ? item.label : t(item.label as any) as string}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}