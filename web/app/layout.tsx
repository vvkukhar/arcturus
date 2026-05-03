import '@/app/globals.css';

import { ToastProvider } from '@/components/ui/toast-provider';
import { LiveToasts } from '@/components/admin/live-toasts';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <LiveToasts />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}