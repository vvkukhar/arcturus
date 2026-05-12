import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ query: string }> }
) {
  try {
    const resolvedParams = await props.params;
    const query = resolvedParams.query;
    
    const response = await fetch(`${appConfig.apiBaseUrl}/public/track/${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.json(null, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(null, { status: 500 });
  }
}