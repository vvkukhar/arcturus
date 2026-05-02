import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export async function GET() {
  const res = await fetch(`${appConfig.apiBaseUrl}/scanner/jobs`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(await res.json());
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const res = await fetch(`${appConfig.apiBaseUrl}/scanner/jobs`, {
    method: 'POST',
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