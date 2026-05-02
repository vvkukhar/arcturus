import Link from 'next/link';
import { api } from '@/lib/api';

type ReserveRow = {
  id: string;
  productTitle: string;
  name: string;
  contact: string;
  status: string;
};

async function getBoard(): Promise<{
  pending: ReserveRow[];
  approved: ReserveRow[];
  contacted: ReserveRow[];
  rejected: ReserveRow[];
}> {
  try {
    return await api.get('/public/reserve-board');
  } catch {
    return {
      pending: [],
      approved: [],
      contacted: [],
      rejected: [],
    };
  }
}

function Column({
  title,
  items,
}: {
  title: string;
  items: ReserveRow[];
}) {
  return (
    <div className="rounded-3xl border border-border bg-white p-5">
      <div className="text-lg font-black">{title}</div>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-slate-500">No items</div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              href={`/admin/reserves/${item.id}`}
              className="block rounded-2xl border border-border p-4 hover:bg-slate-50"
            >
              <div className="font-bold">{item.productTitle || '—'}</div>
              <div className="mt-1 text-sm text-slate-500">{item.name}</div>
              <div className="mt-1 text-xs text-slate-400">{item.contact}</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default async function OrdersBoardPage() {
  const board = await getBoard();

  return (
    <div className="grid gap-6 xl:grid-cols-4">
      <Column title="Pending" items={board.pending} />
      <Column title="Approved" items={board.approved} />
      <Column title="Contacted" items={board.contacted} />
      <Column title="Rejected" items={board.rejected} />
    </div>
  );
}