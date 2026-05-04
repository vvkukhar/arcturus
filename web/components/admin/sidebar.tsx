'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  AlertTriangle,
  BadgeDollarSign,
  Bell,
  Boxes,
  ChartColumn,
  ChartNoAxesCombined,
  ClipboardList,
  Coins,
  DatabaseZap,
  Gauge,
  Handshake,
  KanbanSquare,
  MailCheck,
  Package,
  ReceiptText,
  RefreshCw,
  ScanSearch,
  ScrollText,
  SearchCheck,
  Users,
  Wallet,
} from 'lucide-react';
import { NotificationBadge } from '@/components/admin/notification-badge';
import { cn } from '@/lib/utils';

const items = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Gauge },
  { href: '/admin/inventory', label: 'Inventory', icon: Package },
  { href: '/admin/watchlist', label: 'Watchlist', icon: Wallet },
  { href: '/admin/opportunities/buy', label: 'Buy Opps', icon: ChartColumn },
  { href: '/admin/opportunities/sell', label: 'Sell Opps', icon: ChartColumn },
  { href: '/admin/flows/purchase', label: 'Purchase Flow', icon: Boxes },
  { href: '/admin/flows/reprice', label: 'Reprice Flow', icon: RefreshCw },
  { href: '/admin/flows/review', label: 'Review Flow', icon: ClipboardList },
  { href: '/admin/repricer', label: 'Repricer', icon: BadgeDollarSign },
  { href: '/admin/scanner', label: 'Scanner', icon: ScanSearch },
  { href: '/admin/operator/unresolved', label: 'Operator', icon: SearchCheck },
  { href: '/admin/sources/health', label: 'Source Health', icon: Activity },
  { href: '/admin/sources/runs', label: 'Source Runs', icon: DatabaseZap },
  { href: '/admin/sources/errors', label: 'Sync Errors', icon: AlertTriangle },
  { href: '/admin/sync', label: 'Sync Center', icon: RefreshCw },
  { href: '/admin/planning/daily', label: 'Daily Plan', icon: ClipboardList },
  { href: '/admin/profit', label: 'Profit', icon: Coins },
  { href: '/admin/allocation', label: 'Allocation', icon: ChartNoAxesCombined },
  { href: '/admin/reserves', label: 'Reserves', icon: MailCheck },
  { href: '/admin/orders/board', label: 'Order Board', icon: KanbanSquare },
  { href: '/admin/sales', label: 'Sales', icon: ReceiptText },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/collaboration', label: 'Collaboration', icon: Handshake },
  { href: '/admin/activity', label: 'Activity', icon: ScrollText },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 shrink-0 border-r border-border bg-white flex flex-col h-screen">
      <div className="border-b border-border px-6 py-6">
        <div className="text-2xl font-black tracking-tight text-slate-900">Arcturus</div>
        <div className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">Control Panel</div>
      </div>

      <div className="border-b border-border px-4 py-4">
        <div className="grid grid-cols-3 gap-2">
          <Link
            href="/admin/notifications"
            className="relative flex items-center justify-center rounded-xl border border-border bg-slate-50 p-2.5 transition-colors hover:bg-slate-100 hover:border-slate-300"
          >
            <Bell size={18} className="text-slate-600" />
            <NotificationBadge />
          </Link>

          <Link
            href="/admin/collaboration"
            className="flex items-center justify-center rounded-xl border border-border bg-slate-50 p-2.5 transition-colors hover:bg-slate-100 hover:border-slate-300"
          >
            <Users size={18} className="text-slate-600" />
          </Link>

          <Link
            href="/admin/scanner"
            className="flex items-center justify-center rounded-xl border border-border bg-slate-50 p-2.5 transition-colors hover:bg-slate-100 hover:border-slate-300"
          >
            <ScanSearch size={18} className="text-slate-600" />
          </Link>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1 p-3 custom-scrollbar">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}