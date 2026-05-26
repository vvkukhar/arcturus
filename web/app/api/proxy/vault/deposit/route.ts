import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function POST(req: NextRequest) {
  const token = await getAdminToken();
  const body = await req.json();
  const res = await fetch(`${appConfig.apiBaseUrl}/vault/deposit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) return NextResponse.json({ ok: false }, { status: res.status });
  return NextResponse.json(await res.json());
}