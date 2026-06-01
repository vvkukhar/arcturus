import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/providers/cart-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { ToastProvider } from "@/components/ui/toast-provider";
import { ClientLayoutWrapper } from "@/components/layout/client-layout-wrapper";
import { SWRProvider } from "@/components/providers/swr-provider";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Arcturus Terminal | Institutional LEGO Trading",
    template: "%s | Arcturus",
  },
  description: "Advanced analytics, screening, and trading for premium LEGO assets.",
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('arcturus_theme') === 'dark' || (!('arcturus_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] font-sans antialiased selection:bg-blue-500/30 selection:text-blue-600 dark:selection:text-blue-400">
        <SWRProvider>
          <ThemeProvider>
            <I18nProvider>
              <CartProvider>
                <SidebarProvider>
                  <ToastProvider>
                    <ClientLayoutWrapper>
                      {children}
                    </ClientLayoutWrapper>
                  </ToastProvider>
                </SidebarProvider>
              </CartProvider>
            </I18nProvider>
          </ThemeProvider>
        </SWRProvider>
      </body>
    </html>
  );
}