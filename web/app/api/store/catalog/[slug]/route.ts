import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;

  const response = await fetch(`${appConfig.apiBaseUrl}/public/catalog/${encodeURIComponent(params.slug)}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json({ ok: false }, { status: response.status });
  }

  return NextResponse.json(await response.json());
}