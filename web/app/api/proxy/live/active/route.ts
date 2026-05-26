import { NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const res = await fetch(`${appConfig.apiBaseUrl}/live/active`, { cache: 'no-store' });
  if (!res.ok) return NextResponse.json(null, { status: 200 });
  return NextResponse.json(await res.json());
}