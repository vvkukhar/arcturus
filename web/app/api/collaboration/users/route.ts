import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function GET() {
  const token = await getAdminToken();

  const res = await fetch(`${appConfig.apiBaseUrl}/collaboration/users`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(await res.json());
}

export async function POST(req: NextRequest) {
  const token = await getAdminToken();
  const body = await req.json();

  const res = await fetch(`${appConfig.apiBaseUrl}/collaboration/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: `Create user failed: ${res.status}` },
      { status: 500 },
    );
  }

  return NextResponse.json(await res.json());
}