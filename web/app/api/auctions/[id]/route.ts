import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const res = await fetch(`${appConfig.apiBaseUrl}/public/auctions/${params.id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}