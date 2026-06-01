import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  const token = await getAdminToken();
  const body = await request.json();

  const response = await fetch(`${appConfig.apiBaseUrl}/orders/approve-dropship`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    return NextResponse.json(
      { ok: false, error: errData.message || 'Dropship approval failed' },
      { status: response.status }
    );
  }

  return NextResponse.json({ ok: true, data: await response.json() });
}