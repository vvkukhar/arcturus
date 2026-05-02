import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';
export async function POST(request: NextRequest) {
 const token = await getAdminToken();
 const formData = await request.formData();
 const response = await fetch(`${appConfig.apiBaseUrl}/media/inventory-image`, {
  method: 'POST',
  headers: {
   ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
  body: formData,
  cache: 'no-store',
 });
 if (!response.ok) {
  return NextResponse.json(
   { ok: false, error: `Image upload failed: ${response.status}` },
   { status: 500 },
  );
 }
 return NextResponse.json({ ok: true, data: await response.json() });
}