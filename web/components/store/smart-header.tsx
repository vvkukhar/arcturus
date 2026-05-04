'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SmartHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setIsScrolled(currentScrollY > 20);
          setIsHidden(currentScrollY > lastScrollY && currentScrollY > 100);
          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        isHidden ? '-translate-y-full' : 'translate-y-0',
        isScrolled 
          ? 'bg-white/70 backdrop-blur-2xl border-b border-white/40 shadow-sm py-3' 
          : 'bg-transparent border-transparent py-5'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group outline-none">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Gem className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">ARCTURUS</span>
        </Link>
        <nav className="flex items-center gap-8 text-sm font-bold">
          <Link href="/" className="text-slate-600 hover:text-blue-600 transition-colors">Головна</Link>
          <Link href="/store/catalog" className="text-slate-600 hover:text-blue-600 transition-colors">Каталог</Link>
        </nav>
      </div>
    </header>
  );
}