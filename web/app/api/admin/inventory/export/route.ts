import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function GET(_: NextRequest) {
  const token = await getAdminToken();

  const res = await fetch(`${appConfig.apiBaseUrl}/inventory/export`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json(await res.json());
}