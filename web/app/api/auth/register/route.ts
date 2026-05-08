import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const apiRes = await fetch(`${appConfig.apiBaseUrl}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: body.name,
      email: body.email,
      password: body.password,
      inviteCode: body.inviteCode,
    }),
    cache: 'no-store',
  });

  if (!apiRes.ok) {
    const errorData = await apiRes.json().catch(() => ({}));
    return NextResponse.json(
      { ok: false, error: errorData.message || 'Registration failed' },
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
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}