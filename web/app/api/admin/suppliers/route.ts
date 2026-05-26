import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  const token = await getAdminToken();
  const status = request.nextUrl.searchParams.get('status') ?? 'all';

  const response = await fetch(`${appConfig.apiBaseUrl}/suppliers?status=${status}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) return NextResponse.json([], { status: 200 });
  return NextResponse.json(await response.json());
}