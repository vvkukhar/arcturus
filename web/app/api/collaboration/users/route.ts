import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export async function GET() {
  const res = await fetch(`${appConfig.apiBaseUrl}/collaboration/users`);
  return NextResponse.json(await res.json());
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const res = await fetch(`${appConfig.apiBaseUrl}/collaboration/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return NextResponse.json(await res.json());
}