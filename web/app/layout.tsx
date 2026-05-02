import { ToastProvider } from '@/components/ui/toast-provider';
import { LiveToasts } from '@/components/admin/live-toasts';

export default function RootLayout({ children }: any) {
  return (
    <html>
      <body>
        <ToastProvider>
          <LiveToasts />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}