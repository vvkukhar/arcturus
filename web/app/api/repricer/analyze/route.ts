import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  const token = await getAdminToken();
  const body = await request.json();

  const res = await fetch(`${appConfig.apiBaseUrl}/repricer/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    return NextResponse.json(
      { ok: false, error: errData.message || `HTTP ${res.status}` }, 
      { status: res.status }
    );
  }

  return NextResponse.json(await res.json());
}