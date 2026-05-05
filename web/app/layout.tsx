import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/providers/cart-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Arcturus | Premium LEGO Store",
  description: "Rare and retired LEGO. Verified items, safe shipping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col">
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
        <Toaster position="bottom-right" theme="system" richColors closeButton />
      </body>
    </html>
  );
}