import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const token = await getAdminToken();
  const body = await req.json();

  const res = await fetch(`${appConfig.apiBaseUrl}/live/auction/${id}/bid`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    const err = await res.json().catch(()=>({}));
    return NextResponse.json({ ok: false, error: err.message }, { status: res.status });
  }

  return NextResponse.json(await res.json());
}