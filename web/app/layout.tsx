import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/providers/cart-provider";
import { Navbar } from "@/components/layout/navbar";
import { CartSidebar } from "@/components/cart/cart-sidebar";

export const metadata: Metadata = {
  title: "Arcturus Store | Premium LEGO",
  description: "Find the best deals on rare and retired LEGO sets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased text-slate-900 bg-slate-50 min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <CartSidebar />
          <main className="flex-1">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}