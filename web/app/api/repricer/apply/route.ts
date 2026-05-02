import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export async function PATCH(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${appConfig.apiBaseUrl}/repricer/apply`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json(await res.json());
}