import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';
export async function GET(request: NextRequest) {
 const token = await getAdminToken();
 const q = request.nextUrl.searchParams.get('q') ?? '';
 const response = await fetch(
  `${appConfig.apiBaseUrl}/items?q=${encodeURIComponent(q)}&limit=10`,
  {
   headers: {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
   },
   cache: 'no-store',
  },
 );
 if (!response.ok) {
  return NextResponse.json([], { status: 200 });
 }
 return NextResponse.json(await response.json());
}