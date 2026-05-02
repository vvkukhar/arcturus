import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const apiRes = await fetch(`${appConfig.apiBaseUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: body.token,
    }),
    cache: 'no-store',
  });

  if (!apiRes.ok) {
    return NextResponse.json(
      { ok: false, error: 'Invalid token' },
      { status: 401 },
    );
  }

  const data = await apiRes.json();

  const response = NextResponse.json({ ok: true, user: data.user });

  response.cookies.set('arcturus_admin_token', data.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
  });

  return response;
}