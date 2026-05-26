import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function PATCH(request: NextRequest) {
  const token = await getAdminToken();
  const body = await request.json();

  const response = await fetch(`${appConfig.apiBaseUrl}/orders/complete-as-sale`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ id: body.id }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    return NextResponse.json({ ok: false, error: errData.message || 'Failed to complete order' }, { status: response.status });
  }

  return NextResponse.json({ ok: true, data: await response.json() });
}