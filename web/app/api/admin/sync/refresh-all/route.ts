import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  const token = await getAdminToken();

  const response = await fetch(`${appConfig.apiBaseUrl}/sync/refresh-all`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: `Sync dispatch failed: ${response.status}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, data: await response.json() });
}