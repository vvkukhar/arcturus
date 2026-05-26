import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function PATCH(request: NextRequest) {
  const token = await getAdminToken();
  const body = await request.json();
  
  // body.action = 'approve' | 'reject' | 'resolve'
  const action = body.action;
  
  if (!['approve', 'reject', 'resolve'].includes(action)) {
    return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 });
  }

  const response = await fetch(`${appConfig.apiBaseUrl}/returns/${action}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      id: body.id,
      adminNote: body.adminNote,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    return NextResponse.json(
      { ok: false, error: errData.message || `Return action failed: ${response.status}` },
      { status: response.status }
    );
  }

  return NextResponse.json({ ok: true, data: await response.json() });
}