import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  const token = await getAdminToken();
  const itemId = request.nextUrl.searchParams.get('itemId');
  
  if (!itemId) {
    return NextResponse.json([], { status: 200 });
  }

  const res = await fetch(`${appConfig.apiBaseUrl}/market/item/${itemId}/listings`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(await res.json());
}