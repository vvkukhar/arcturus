import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set('arcturus_admin_token', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    expires: new Date(0),
  });
  return response;
}