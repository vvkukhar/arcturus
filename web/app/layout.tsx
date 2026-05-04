import '@/app/globals.css';
import { ToastProvider } from '@/components/ui/toast-provider';
import { LiveToasts } from '@/components/admin/live-toasts';
import { Metadata, Viewport } from 'next';
import { FomoTicker } from '@/components/store/fomo-ticker';

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: '%s | Arcturus',
    default: 'Arcturus - Premium LEGO Trading',
  },
  description: 'Ексклюзивний доступ до раритетних наборів LEGO. Миттєве бронювання та гарантія.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icons/Icon-192.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="antialiased">
        <ToastProvider>
          <LiveToasts />
          <FomoTicker />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}