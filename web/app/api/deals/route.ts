import { NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export async function GET() {
  const res = await fetch(`${appConfig.apiBaseUrl}/deals`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(await res.json());
}

export async function POST() {
  const res = await fetch(`${appConfig.apiBaseUrl}/deals/detect`, {
    method: 'POST',
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(await res.json());
}