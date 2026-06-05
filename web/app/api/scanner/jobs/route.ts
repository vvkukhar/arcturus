import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function GET() {
  const token = await getAdminToken();
  const res = await fetch(`${appConfig.apiBaseUrl}/scanner/jobs`, {
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

export async function POST(request: NextRequest) {
  const token = await getAdminToken();
  const body = await request.json();

  try {
    const res = await fetch(`${appConfig.apiBaseUrl}/scanner/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      return NextResponse.json(
        { ok: false, error: errData.message || `Scanner queue error: ${res.statusText}` }, 
        { status: res.status >= 500 ? 500 : 400 }
      );
    }

    return NextResponse.json(await res.json());
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: `Backend connection failed. Is Redis running? Details: ${error.message}` },
      { status: 503 }
    );
  }
}