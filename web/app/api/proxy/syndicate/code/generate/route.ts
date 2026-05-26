import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function POST(req: NextRequest) {
  const token = await getAdminToken();
  const res = await fetch(`${appConfig.apiBaseUrl}/syndicate/code/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    cache: 'no-store',
  });
  if (!res.ok) {
    const err = await res.json().catch(()=>({}));
    return NextResponse.json({ ok: false, error: err.message }, { status: res.status });
  }
  return NextResponse.json(await res.json());
}