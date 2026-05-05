'use client';

import Link from 'next/link';
import { useI18n } from '../providers/i18n-provider';
import { Package, Instagram, Twitter, Mail } from 'lucide-react';

export function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/store" className="flex items-center gap-2 mb-4">
              <div className="bg-slate-900 dark:bg-blue-600 text-white p-1.5 rounded-lg">
                <Package size={20} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Arcturus
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Premium, rare, and verified LEGO sets. Built for collectors.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="mailto:contact@arcturus.store" className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 uppercase text-sm tracking-wider">{t('footer.links')}</h3>
            <ul className="space-y-3">
              <li><Link href="/store/catalog" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.catalog')}</Link></li>
              <li><Link href="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.about')}</Link></li>
              <li><Link href="/delivery" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('nav.delivery')}</Link></li>
              <li><Link href="/faq" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.faq')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 uppercase text-sm tracking-wider">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="text-sm text-slate-500 dark:text-slate-400">Kyiv, Ukraine</li>
              <li className="text-sm text-slate-500 dark:text-slate-400">support@arcturus.store</li>
              <li className="text-sm text-slate-500 dark:text-slate-400">+380 (50) 123-45-67</li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 uppercase text-sm tracking-wider">{t('footer.legal')}</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{t('footer.terms')}</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-200 dark:border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            &copy; {currentYear} {t('footer.company')}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}