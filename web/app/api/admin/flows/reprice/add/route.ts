import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const response = await fetch(`${appConfig.apiBaseUrl}/flows/reprice/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inventoryItemId: body.inventoryItemId,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: `Add to reprice flow failed: ${response.status}` },
      { status: 500 },
    );
  }

  const data = await response.json();
  return NextResponse.json({ ok: true, data });
}