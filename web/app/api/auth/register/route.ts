import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
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
      let errorMessage = 'Registration failed';
      try {
        const errorData = await apiRes.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = `Server Error: ${apiRes.statusText || apiRes.status}. Check API URL: ${appConfig.apiBaseUrl}`;
      }
      return NextResponse.json({ ok: false, error: errorMessage }, { status: apiRes.status });
    }

    const data = await apiRes.json();
    const response = NextResponse.json({ ok: true, user: data.user, token: data.token });

    response.cookies.set('arcturus_admin_token', data.token, {
      httpOnly: false,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: `Connection to backend failed. If using Render, wait 60s and try again.` },
      { status: 503 }
    );
  }
}