import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { getAdminToken } from '@/lib/server-auth';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

async function handleProxy(req: NextRequest, props: { params: Promise<{ path: string[] }> }) {
  const { path } = await props.params;
  const token = await getAdminToken();
  
  // ФІКС БЕЗПЕКИ: Видаляємо крапки, щоб унеможливити Directory Traversal (../)
  const sanitizedPath = path.map(p => p.replace(/[^a-zA-Z0-9\-_]/g, '')).join('/');
  
  if (!token && !sanitizedPath.startsWith('public/')) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const backendUrl = new URL(`${appConfig.apiBaseUrl}/${sanitizedPath}${url.search}`);
  const headers = new Headers(req.headers);

  headers.delete('host');
  headers.delete('connection');
  
  // 🔥 ГАРАНТІЯ №1: Забороняємо бекенду стискати відповідь (вимкне gzip/br).
  // Це виключає конфлікти з Content-Length та Content-Encoding на рівні Vercel.
  headers.delete('accept-encoding');
  
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const options: RequestInit & { duplex?: 'half' } = {
    method: req.method,
    headers,
    redirect: 'manual',
  };

  if (req.body && req.method !== 'GET' && req.method !== 'HEAD') {
    options.body = req.body;
    options.duplex = 'half';
  }

  try {
    const response = await fetch(backendUrl.toString(), options);
    
    // 🔥 ГАРАНТІЯ №2: Повністю зчитуємо тіло в буфер (уникаємо стрімінгу, який крашить Vercel)
    const buffer = await response.arrayBuffer();
    
    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('transfer-encoding');
    responseHeaders.delete('content-length');
    
    // Забороняємо браузеру кешувати ці приватні дані
    responseHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    responseHeaders.set('Pragma', 'no-cache');
    responseHeaders.set('Expires', '0');

    // Next.js автоматично проставить правильний Content-Length на основі розміру buffer
    return new NextResponse(buffer, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('[Proxy Error]', error);
    return NextResponse.json({ ok: false, error: 'Gateway Timeout or Backend Unreachable' }, { status: 504 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PATCH = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;