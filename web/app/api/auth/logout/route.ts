import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { appConfig } from '@/lib/config';

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('arcturus_admin_token')?.value;

  if (token) {
    await fetch(`${appConfig.apiBaseUrl}/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }

  cookieStore.delete('arcturus_admin_token');
  return NextResponse.json({ success: true });
}