'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity, AlertTriangle, BadgeDollarSign, Bell, Boxes, BrainCircuit,
  ChartColumn, ChartNoAxesCombined, ClipboardList, Coins, DatabaseZap,
  Gauge, Handshake, KanbanSquare, MailCheck, Package, ReceiptText,
  RefreshCw, ScanSearch, ScrollText, SearchCheck, Shield, Wallet,
  Globe, ScanBarcode, CornerDownLeft, Flame, Megaphone
} from 'lucide-react';
import { NotificationBadge } from '@/components/admin/notification-badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const menuGroups = [
  {
    title: 'Overview & Activity',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: Gauge },
      { href: '/admin/activity', label: 'Activity Logs', icon: ScrollText },
    ]
  },
  {
    title: 'Trading & AI',
    items: [
      { href: '/admin/algo', label: 'Algorithm Settings', icon: BrainCircuit },
      { href: '/admin/marketing', label: 'AI Marketing Hub', icon: Megaphone },
      { href: '/admin/arbitrage', label: 'Global Arbitrage', icon: Globe },
    ]
  },
  {
    title: 'Market Intelligence',
    items: [
      { href: '/admin/scanner', label: 'Scanner Control', icon: ScanSearch },
      { href: '/admin/operator/unresolved', label: 'Operator Queue', icon: SearchCheck },
      { href: '/admin/opportunities/demand', label: 'Demand Heatmap', icon: Flame },
      { href: '/admin/opportunities/buy', label: 'Buy Opportunities', icon: ChartColumn },
      { href: '/admin/opportunities/sell', label: 'Sell Opportunities', icon: ChartColumn },
      { href: '/admin/repricer', label: 'Valuation Models', icon: BadgeDollarSign },
    ]
  },
  {
    title: 'Execution Flows',
    items: [
      { href: '/admin/flows/purchase', label: 'Purchase Flow', icon: Boxes },
      { href: '/admin/flows/reprice', label: 'Reprice Flow', icon: RefreshCw },
      { href: '/admin/flows/review', label: 'Review Flow', icon: ClipboardList },
    ]
  },
  {
    title: 'Core & Inventory',
    items: [
      { href: '/admin/inventory', label: 'Inventory Manager', icon: Package },
      { href: '/admin/watchlist', label: 'Watchlist', icon: Wallet },
      { href: '/admin/orders', label: 'Orders List', icon: Package },
      { href: '/admin/orders/board', label: 'Orders Board', icon: KanbanSquare },
      { href: '/admin/reserves', label: 'Client Reserves', icon: MailCheck },
    ]
  },
  {
    title: 'Finance & Sales',
    items: [
      { href: '/admin/pos', label: 'POS Terminal', icon: ScanBarcode },
      { href: '/admin/sales', label: 'Sales Records', icon: ReceiptText },
      { href: '/admin/payouts', label: 'Seller Payouts', icon: Coins },
      { href: '/admin/returns', label: 'Returns & Refunds', icon: CornerDownLeft },
      { href: '/admin/profit', label: 'Profit & Loss', icon: Coins },
      { href: '/admin/allocation', label: 'Capital Allocation', icon: ChartNoAxesCombined },
    ]
  },
  {
    title: 'System Health',
    items: [
      { href: '/admin/suppliers', label: 'Supplier CRM', icon: Shield },
      { href: '/admin/collaboration', label: 'Team & Users', icon: Handshake },
      { href: '/admin/sync', label: 'Sync Center', icon: RefreshCw },
      { href: '/admin/sources/health', label: 'Scraper Health', icon: Activity },
      { href: '/admin/sources/runs', label: 'Scraper Logs', icon: DatabaseZap },
      { href: '/admin/sources/errors', label: 'Sync Errors', icon: AlertTriangle },
    ]
  }
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn("shrink-0 border-r border-[var(--border)] bg-[var(--card)] flex flex-col h-screen transition-all duration-300", collapsed ? "w-20" : "w-72")}>
      <div className="border-b border-[var(--border)] px-6 py-6 flex items-center justify-between">
        {!collapsed && (
          <Link className="block outline-none" href="/store/catalog">
            <div className="text-2xl font-black tracking-tight text-[var(--foreground)] hover:text-blue-600 transition-colors">Arcturus</div>
            <div className="mt-1 text-[10px] font-black uppercase tracking-widest text-blue-500">Control Panel</div>
          </Link>
        )}
        {collapsed && (
          <div className="w-full flex justify-center text-blue-600 font-black text-xl">A</div>
        )}
      </div>

      <div className="border-b border-[var(--border)] px-4 py-4">
        <div className={cn("grid gap-2", collapsed ? "grid-cols-1" : "grid-cols-3")}>
          <Link className="relative flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)] p-2.5 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200" href="/admin/notifications">
            <Bell className="text-slate-500 dark:text-slate-400" size={18} />
            <NotificationBadge />
          </Link>
          <Link className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)] p-2.5 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200" href="/admin/collaboration">
            <Users className="text-slate-500 dark:text-slate-400" size={18} />
          </Link>
          <Link className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background)] p-2.5 transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200" href="/admin/scanner">
            <ScanSearch className="text-slate-500 dark:text-slate-400" size={18} />
          </Link>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-6 p-4 custom-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            {!collapsed && (
              <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-2">
                {group.title}
              </h4>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || (pathname?.startsWith(`${item.href}/`) && item.href !== '/admin');

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 outline-none",
                      active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-600 dark:text-slate-400 hover:bg-[var(--background)] hover:text-[var(--foreground)] hover:border-[var(--border)] border border-transparent",
                      collapsed && "justify-center px-0"
                    )}
                  >
                    <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}