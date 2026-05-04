import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.orderId) {
      return NextResponse.json({ ok: false, error: 'orderId is required' }, { status: 400 });
    }

    const response = await fetch(`${appConfig.apiBaseUrl}/payments/checkout/${body.orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { ok: false, error: errorData.message || 'Payment initialization failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ ok: true, url: data.url });
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}