import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const token = await getAdminToken();
  const body = await request.json(); // body.action = 'trusted' | 'scammer'

  if (!body.action || !['trusted', 'scammer'].includes(body.action)) {
    return NextResponse.json({ ok: false, error: 'Invalid action' }, { status: 400 });
  }

  const response = await fetch(`${appConfig.apiBaseUrl}/suppliers/${id}/${body.action}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ notes: body.notes }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json({ ok: false, error: 'Failed to update supplier status' }, { status: response.status });
  }

  return NextResponse.json({ ok: true, data: await response.json() });
}