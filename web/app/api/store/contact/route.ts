import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
export async function POST(request: NextRequest) {
 const body = await request.json();
 const response = await fetch(`${appConfig.apiBaseUrl}/public/reserve`, {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json',
  },
  body: JSON.stringify({
   inventoryItemId: body.inventoryItemId,
   productTitle: body.productTitle,
   name: body.name,
   contact: body.contact,
   message: body.message,
  }),
  cache: 'no-store',
 });
 if (!response.ok) {
  return NextResponse.json(
   { ok: false, error: `Reserve failed: ${response.status}` },
   { status: 500 },
  );
 }
 return NextResponse.json({ ok: true, data: await response.json() });
}