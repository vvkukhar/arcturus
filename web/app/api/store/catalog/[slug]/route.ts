import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const res = await fetch(`${appConfig.apiBaseUrl}/public/catalog/${encodeURIComponent(slug)}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}