import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function PATCH(request: NextRequest) {
  const token = await getAdminToken();
  const body = await request.json();

  const response = await fetch(`${appConfig.apiBaseUrl}/watchlist/bulk-activate`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      ids: body.ids ?? [],
      active: Boolean(body.active),
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: `Watchlist bulk activate failed: ${response.status}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, data: await response.json() });
}