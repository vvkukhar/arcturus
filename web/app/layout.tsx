import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/providers/cart-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { Ticker } from "@/components/layout/ticker";
import { CommandMenu } from "@/components/layout/command-menu";
import { Sidebar } from "@/components/layout/sidebar";
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
              <div className="sticky top-0 z-50 w-full">
                <Ticker />
                <Navbar />
              </div>
              <div className="flex flex-1 w-full max-w-[1920px] mx-auto relative">
                <Sidebar />
                <div className="flex-1 flex flex-col min-w-0">
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </div>
              <CommandMenu />
              <CartSidebar />
            </CartProvider>
          </I18nProvider>
        </ThemeProvider>
        <Toaster position="bottom-right" theme="system" richColors closeButton />
      </body>
    </html>
  );
}