import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function PATCH(request: NextRequest) {
  const token = await getAdminToken();
  const body = await request.json();

  const response = await fetch(`${appConfig.apiBaseUrl}/watchlist`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      id: body.id,
      desiredBuyPrice: body.desiredBuyPrice,
      maxBuyPrice: body.maxBuyPrice,
      targetSellPrice: body.targetSellPrice,
      active: body.active,
      titleSnapshot: body.titleSnapshot,
      priority: body.priority,
      notes: body.notes,
      assignedUserId: body.assignedUserId,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: `Watchlist update failed: ${response.status}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, data: await response.json() });
}