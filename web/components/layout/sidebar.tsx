'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '../providers/i18n-provider';
import { 
  LineChart, Activity, Filter, BarChart2, BookOpen, Clock, 
  FileText, PieChart, Wallet, Heart, TrendingUp, Package, 
  HelpCircle, ShieldCheck
} from 'lucide-react';

export function Sidebar() {
  const { t } = useI18n();
  const pathname = usePathname();

  const menu = [
    {
      title: 'sidebar.trading',
      items: [
        { name: 'sidebar.market', path: '/market', icon: LineChart },
        { name: 'sidebar.screener', path: '/screener', icon: Filter },
        { name: 'sidebar.indices', path: '/indices', icon: BarChart2 },
        { name: 'sidebar.orderbook', path: '/orderbook', icon: Activity },
      ]
    },
    {
      title: 'sidebar.analytics',
      items: [
        { name: 'sidebar.valuation', path: '/valuation', icon: PieChart },
        { name: 'sidebar.historical', path: '/historical', icon: Clock },
        { name: 'sidebar.reports', path: '/reports', icon: FileText },
      ]
    },
    {
      title: 'sidebar.portfolio',
      items: [
        { name: 'sidebar.dashboard', path: '/account', icon: Wallet },
        { name: 'sidebar.watchlist', path: '/account/watchlist', icon: Heart },
        { name: 'sidebar.performance', path: '/account/performance', icon: TrendingUp },
      ]
    },
    {
      title: 'sidebar.platform',
      items: [
        { name: 'nav.catalog', path: '/store/catalog', icon: Package },
        { name: 'sidebar.sell', path: '/sell', icon: Package },
        { name: 'nav.auth', path: '/authenticity', icon: ShieldCheck },
        { name: 'footer.faq', path: '/faq', icon: HelpCircle },
      ]
    }
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-[var(--border)] bg-[var(--card)] hidden lg:flex flex-col h-[calc(100vh-120px)] sticky top-[120px] overflow-y-auto custom-scrollbar">
      <div className="p-6 space-y-8">
        {menu.map((section, idx) => (
          <div key={idx}>
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-3">
              {t(section.title as any)}
            </h4>
            <div className="space-y-1">
              {section.items.map((item, iIdx) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link 
                    key={iIdx} 
                    href={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm transition-all ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
                  >
                    <Icon size={16} />
                    {t(item.name as any)}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}