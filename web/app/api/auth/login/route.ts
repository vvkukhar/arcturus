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
      email: body.email,
      password: body.password,
      rememberMe: body.rememberMe,
    }),
    cache: 'no-store',
  });

  if (!apiRes.ok) {
    const errorData = await apiRes.json().catch(() => ({}));
    return NextResponse.json(
      { ok: false, error: errorData.message || 'Authentication failed' },
      { status: apiRes.status },
    );
  }

  const data = await apiRes.json();
  const response = NextResponse.json({ ok: true, user: data.user });

  response.cookies.set('arcturus_admin_token', data.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: (body.rememberMe ? 30 : 1) * 24 * 60 * 60,
  });

  return response;
}