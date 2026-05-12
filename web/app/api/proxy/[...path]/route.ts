import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function handleRequest(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const params = await props.params;
  const token = await getAdminToken();
  
  const sanitizedPath = params.path.map(p => p.replace(/[^a-zA-Z0-9\-_\.]/g, '')).join('/');
  
  if (!token && !sanitizedPath.startsWith('public/')) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const backendUrl = new URL(`${appConfig.apiBaseUrl}/${sanitizedPath}${url.search}`);
  const headers = new Headers();

  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (request.headers.has('content-type')) {
    headers.set('Content-Type', request.headers.get('content-type')!);
  }

  const options: RequestInit = {
    method: request.method,
    headers,
    cache: 'no-store',
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const rawBody = await request.arrayBuffer();
    if (rawBody.byteLength > 0) {
      options.body = rawBody;
    }
  }

  try {
    const response = await fetch(backendUrl.toString(), options);
    const responseHeaders = new Headers(response.headers);

    responseHeaders.delete('content-encoding');
    responseHeaders.set('Cache-Control', 'no-store, max-age=0');

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Gateway Timeout' }, { status: 502 });
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PATCH = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;