import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function handleProxy(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const { path } = await props.params;
  const token = await getAdminToken();
  const sanitizedPath = path.map(p => p.replace(/[^a-zA-Z0-9\-_\.]/g, '')).join('/');
  
  if (!token && !sanitizedPath.startsWith('public/')) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const backendUrl = new URL(`${appConfig.apiBaseUrl}/${sanitizedPath}${url.search}`);
  const headers = new Headers(req.headers);

  headers.delete('host');
  headers.delete('connection');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const options: RequestInit & { duplex?: 'half' } = {
    method: req.method,
    headers,
    redirect: 'manual',
    body: req.body,
  };

  if (req.body) options.duplex = 'half';

  try {
    const response = await fetch(backendUrl.toString(), options);
    const responseHeaders = new Headers(response.headers);

    responseHeaders.delete('content-encoding');
    responseHeaders.delete('transfer-encoding');
    responseHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    responseHeaders.set('Pragma', 'no-cache');
    responseHeaders.set('Expires', '0');

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Gateway Timeout' }, { status: 504 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PATCH = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;