import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = await getAdminToken();
  const { id } = await params;

  const res = await fetch(`${appConfig.apiBaseUrl}/inventory/${id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}