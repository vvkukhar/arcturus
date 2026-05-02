import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';
export async function DELETE(request: NextRequest) {
 const token = await getAdminToken();
 const body = await request.json();
 const response = await fetch(`${appConfig.apiBaseUrl}/media/inventory-image`, {
  method: 'DELETE',
  headers: {
   'Content-Type': 'application/json',
   ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
  body: JSON.stringify(body),
  cache: 'no-store',
 });
 if (!response.ok) {
  return NextResponse.json(
   { ok: false, error: `Image delete failed: ${response.status}` },
   { status: 500 },
  );
 }
 return NextResponse.json({ ok: true, data: await response.json() });
}