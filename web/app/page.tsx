import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl border border-border bg-white p-10 shadow-sm">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
            Arcturus
          </div>
          <h1 className="mt-4 text-5xl font-black tracking-tight text-slate-950">
            LEGO trading operating system
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Admin workflows, market opportunities, sync health, operator review,
            and a future public storefront on top of one backend.
          </p>
          <div className="mt-8 flex gap-3">
            <Link
              href="/admin/dashboard"
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
            >
              Open Admin
            </Link>
            <Link
              href="/store"
              className="rounded-xl border border-border bg-white px-5 py-3 text-sm font-bold text-slate-900"
            >
              Storefront Stub
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}