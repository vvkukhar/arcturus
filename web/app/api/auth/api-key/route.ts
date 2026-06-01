import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function POST(request: NextRequest) {
  const token = await getAdminToken();

  const response = await fetch(`${appConfig.apiBaseUrl}/auth/api-key`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json(
      { ok: false, error: `Generate API Key failed: ${response.status}` },
      { status: 500 },
    );
  }

  return NextResponse.json(await response.json());
}