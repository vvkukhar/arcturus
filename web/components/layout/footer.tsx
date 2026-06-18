'use client';

import Link from 'next/link';
import { useI18n } from '../providers/i18n-provider';
import { Package, Instagram, Twitter, Mail } from 'lucide-react';
import { LegalFooter } from './legal-footer';

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 mt-auto">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group outline-none">
              <div className="bg-slate-900 dark:bg-blue-600 text-white p-1.5 rounded-lg group-hover:scale-105 transition-transform">
                <Package size={20} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Arcturus
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
              Premium, rare, and verified LEGO sets. Built for collectors.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                <Twitter size={20} />
              </a>
              <a href="mailto:contact@arcturus.store" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-50 dark:bg-slate-900 p-2 rounded-lg">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-black text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-widest">{t('footer.links' as any)}</h3>
            <ul className="space-y-3">
              <li><Link href="/store/catalog" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.catalog' as any)}</Link></li>
              <li><Link href="/authenticity" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.auth' as any)}</Link></li>
              <li><Link href="/delivery" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.delivery' as any)}</Link></li>
              <li><Link href="/sell" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.sell' as any)}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-black text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-widest">{t('footer.contact' as any)}</h3>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.contact' as any)}</Link></li>
              <li><Link href="/faq" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.faq' as any)}</Link></li>
              <li className="text-sm font-semibold text-slate-500 dark:text-slate-400 pt-2">support@arcturus.store</li>
              <li className="text-sm font-semibold text-slate-500 dark:text-slate-400">+380 (93) 118-22-35</li>
            </ul>
          </div>

          <div>
            <h3 className="font-black text-slate-900 dark:text-white mb-4 uppercase text-xs tracking-widest">{t('footer.legal' as any)}</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.privacy' as any)}</Link></li>
              <li><Link href="/terms" className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.terms' as any)}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            &copy; {currentYear} {t('footer.company' as any)}. {t('footer.rights' as any)}
          </p>
        </div>

        <LegalFooter />

      </div>
    </footer>
  );
}