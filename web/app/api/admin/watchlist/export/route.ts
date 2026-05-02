import { NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function GET() {
  const token = await getAdminToken();

  const response = await fetch(`${appConfig.apiBaseUrl}/watchlist/export`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(await response.json());
}