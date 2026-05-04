import '@/app/globals.css';
import { ToastProvider } from '@/components/ui/toast-provider';
import { LiveToasts } from '@/components/admin/live-toasts';
import { Metadata } from 'next';
import { FomoTicker } from '@/components/store/fomo-ticker';

export const metadata: Metadata = {
  title: {
    template: '%s | Arcturus',
    default: 'Arcturus - Premium LEGO Trading',
  },
  description: 'Ексклюзивний доступ до раритетних наборів та лімітованих мініфігурок LEGO. Миттєве бронювання та абсолютна гарантія оригінальності.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Arcturus - Premium LEGO',
    description: 'Ексклюзивний доступ до раритетних наборів LEGO',
    type: 'website',
    siteName: 'Arcturus',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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