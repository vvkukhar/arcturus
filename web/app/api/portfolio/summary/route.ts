import { NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function GET() {
  const token = await getAdminToken();
  const res = await fetch(`${appConfig.apiBaseUrl}/portfolio/summary`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json({ inventory: { expectedRevenue: 0, expectedProfit: 0 }, sales: { totalRevenue: 0, realizedProfit: 0 } }, { status: 200 });
  }

  return NextResponse.json(await res.json());
}