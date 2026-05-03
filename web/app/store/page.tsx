import Link from 'next/link';

export default function StorefrontPage() {
  return (
    <section className="rounded-3xl border border-border bg-white p-10 shadow-sm">
      <div className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
        Arcturus Store
      </div>

      <h1 className="mt-4 max-w-3xl text-5xl font-black tracking-tight">
        LEGO resale storefront powered by the Arcturus operating system.
      </h1>

      <p className="mt-4 max-w-2xl text-lg text-slate-600">
        Browse available inventory, reserve products, and connect public demand
        directly with the internal admin workflow.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/store/catalog"
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
        >
          Browse Catalog
        </Link>

        <Link
          href="/admin/dashboard"
          className="rounded-xl border border-border bg-white px-5 py-3 text-sm font-bold text-slate-900"
        >
          Admin Panel
        </Link>
      </div>
    </section>
  );
}