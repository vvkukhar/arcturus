import Link from 'next/link';

export default function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/store" className="text-xl font-black tracking-tight">
            Arcturus Store
          </Link>

          <nav className="flex items-center gap-4 text-sm font-semibold text-slate-600">
            <Link href="/store/catalog" className="hover:text-slate-950">
              Catalog
            </Link>
            <Link href="/" className="hover:text-slate-950">
              Main
            </Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </main>
  );
}