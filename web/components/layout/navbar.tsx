'use client';

import Link from 'next/link';
import { useCart } from '../providers/cart-provider';
import { ShoppingCart, Menu, Search, Package } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/store" className="flex items-center gap-2 group">
              <div className="bg-slate-900 text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                <Package size={20} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Arcturus<span className="text-blue-600">Store</span>
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link href="/store/catalog" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Catalog
              </Link>
              <Link href="/store/catalog?theme=Star+Wars" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Star Wars
              </Link>
              <Link href="/store/catalog?theme=Ninjago" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                Ninjago
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center justify-center p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-colors">
              <Search size={20} />
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-full transition-colors group"
            >
              <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm animate-fade-in-up">
                  {totalItems}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link href="/store/catalog" className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-slate-50">
              All Catalog
            </Link>
            <Link href="/store/catalog?theme=Star+Wars" className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-slate-50">
              Star Wars
            </Link>
            <Link href="/store/catalog?theme=Ninjago" className="block px-3 py-2 rounded-md text-base font-medium text-slate-900 hover:bg-slate-50">
              Ninjago
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}