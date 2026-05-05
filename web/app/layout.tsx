import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/providers/cart-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartSidebar } from "@/components/cart/cart-sidebar";

export const metadata: Metadata = {
  title: "Arcturus | Premium LEGO Store",
  description: "Rare and retired LEGO. Verified parts, fair prices, fast delivery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased text-slate-900 bg-slate-50 dark:bg-slate-950 dark:text-slate-100 min-h-screen flex flex-col transition-colors duration-300">
        <ThemeProvider>
          <I18nProvider>
            <CartProvider>
              <Navbar />
              <CartSidebar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}