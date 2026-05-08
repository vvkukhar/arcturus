import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/providers/cart-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Arcturus Terminal | Institutional LEGO Trading",
  description: "Advanced analytics, screening, and trading for premium LEGO assets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col bg-[var(--background)]">
        <ThemeProvider>
          <I18nProvider>
            <CartProvider>
              <SidebarProvider>
                {children}
              </SidebarProvider>
            </CartProvider>
          </I18nProvider>
        </ThemeProvider>
        <Toaster position="bottom-right" theme="system" richColors closeButton />
      </body>
    </html>
  );
}