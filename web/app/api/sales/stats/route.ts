import { NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export async function GET() {
  const res = await fetch(`${appConfig.apiBaseUrl}/sales/stats`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json({ totalProfit: 0, salesCount: 0 }, { status: 200 });
  }

  return NextResponse.json(await res.json());
}