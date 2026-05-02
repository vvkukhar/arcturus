'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Boxes,
  ChartColumn,
  ClipboardList,
  Gauge,
  Package,
  RefreshCw,
  SearchCheck,
  Wallet,
  Activity,
  ChartNoAxesCombined,
  Coins,
  AlertTriangle,
  DatabaseZap,
  MailCheck,
  KanbanSquare,
  Bell,
  Users,
  ReceiptText,
  ScrollText,
  Handshake,
  BadgeDollarSign,
  ScanSearch,
} from 'lucide-react';
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
    <aside className="w-72 shrink-0 border-r border-border bg-white">
      <div className="border-b border-border px-6 py-5">
        <div className="text-xl font-black tracking-tight">Arcturus</div>
        <div className="mt-1 text-sm text-slate-500">Admin Panel</div>
      </div>

      <div className="border-b border-border px-4 py-3">
        <div className="grid grid-cols-3 gap-2">
          <Link
            href="/admin/notifications"
            className="flex items-center justify-center rounded-xl border border-border p-2 hover:bg-slate-50"
          >
            <Bell size={16} />
          </Link>
          <Link
            href="/admin/collaboration"
            className="flex items-center justify-center rounded-xl border border-border p-2 hover:bg-slate-50"
          >
            <Users size={16} />
          </Link>
          <Link
            href="/admin/scanner"
            className="flex items-center justify-center rounded-xl border border-border p-2 hover:bg-slate-50"
          >
            <ScanSearch size={16} />
          </Link>
        </div>
      </div>

      <nav className="space-y-1 p-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition',
                active
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-700 hover:bg-slate-100',
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}