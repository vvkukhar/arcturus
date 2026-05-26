import { NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const token = await getAdminToken();

  const res = await fetch(`${appConfig.apiBaseUrl}/returns/board`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json({ requested: [], approved: [], rejected: [], resolved: [] }, { status: 200 });
  }

  return NextResponse.json(await res.json());
}