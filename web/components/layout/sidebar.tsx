'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '../providers/i18n-provider';
import { useSidebar } from '../providers/sidebar-provider';
import { 
  LineChart, Activity, Filter, BarChart2, BookOpen, Clock, 
  FileText, PieChart, Wallet, Heart, TrendingUp, Package, 
  HelpCircle, ShieldCheck, X
} from 'lucide-react';

export function Sidebar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useSidebar();

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
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)} 
      />

      <aside 
        className={`fixed inset-y-0 left-0 z-[70] w-72 bg-[var(--card)] border-r border-[var(--border)] shadow-2xl flex flex-col transform transition-transform duration-300 ease-out-expo ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <span className="font-extrabold text-xl flex items-center gap-2">
            <Package size={24} className="text-blue-600" />
            Terminal
          </span>
          <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
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
    </>
  );
}