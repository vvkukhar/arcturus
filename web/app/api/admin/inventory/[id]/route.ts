import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const token = await getAdminToken();

  const response = await fetch(`${appConfig.apiBaseUrl}/inventory/${params.id}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    return NextResponse.json({ ok: false }, { status: response.status });
  }

  return NextResponse.json(await response.json());
}