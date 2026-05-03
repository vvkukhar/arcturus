import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function PATCH(request: NextRequest) {
  const token = await getAdminToken();
  const body = await request.json();

  const res = await fetch(`${appConfig.apiBaseUrl}/collaboration/assign/inventory`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      inventoryItemId: body.inventoryItemId,
      userId: body.userId,
    }),
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: `Assign inventory failed: ${res.status}` },
      { status: 500 },
    );
  }

  return NextResponse.json(await res.json());
}